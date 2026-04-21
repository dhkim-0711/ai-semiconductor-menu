const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

function readUInt64LE(buf, offset) {
  const low = buf.readUInt32LE(offset);
  const high = buf.readUInt32LE(offset + 4);
  return high * 0x100000000 + low;
}

function parseCfb(filePath) {
  const data = fs.readFileSync(filePath);
  const sectorShift = data.readUInt16LE(30);
  const miniSectorShift = data.readUInt16LE(32);
  const sectorSize = 1 << sectorShift;
  const miniSectorSize = 1 << miniSectorShift;
  const numFatSectors = data.readUInt32LE(44);
  const firstDirSector = data.readInt32LE(48);
  const miniStreamCutoff = data.readUInt32LE(56);
  const firstMiniFatSector = data.readInt32LE(60);
  const numMiniFatSectors = data.readUInt32LE(64);
  const firstDifatSector = data.readInt32LE(68);
  const numDifatSectors = data.readUInt32LE(72);

  const END_OF_CHAIN = -2;
  const FREE_SECTOR = -1;

  function sectorOffset(sectorId) {
    return (sectorId + 1) * sectorSize;
  }

  const difat = [];
  for (let i = 0; i < 109; i += 1) {
    const sid = data.readInt32LE(76 + i * 4);
    if (sid !== FREE_SECTOR) difat.push(sid);
  }

  let difatSector = firstDifatSector;
  for (let i = 0; i < numDifatSectors && difatSector !== END_OF_CHAIN; i += 1) {
    const base = sectorOffset(difatSector);
    const entriesPerSector = sectorSize / 4 - 1;
    for (let j = 0; j < entriesPerSector; j += 1) {
      const sid = data.readInt32LE(base + j * 4);
      if (sid !== FREE_SECTOR) difat.push(sid);
    }
    difatSector = data.readInt32LE(base + sectorSize - 4);
  }

  const fat = [];
  for (const fatSector of difat.slice(0, numFatSectors)) {
    const base = sectorOffset(fatSector);
    for (let i = 0; i < sectorSize / 4; i += 1) {
      fat.push(data.readInt32LE(base + i * 4));
    }
  }

  function readChain(startSector, size, useMini = false, miniStreamBuffer = null, miniFat = []) {
    const chunks = [];
    let sid = startSector;
    let remaining = size;

    while (sid !== END_OF_CHAIN && sid !== FREE_SECTOR && sid >= 0 && remaining > 0) {
      if (useMini) {
        const start = sid * miniSectorSize;
        chunks.push(miniStreamBuffer.slice(start, start + Math.min(miniSectorSize, remaining)));
        sid = miniFat[sid];
      } else {
        const start = sectorOffset(sid);
        chunks.push(data.slice(start, start + Math.min(sectorSize, remaining)));
        sid = fat[sid];
      }
      remaining -= useMini ? miniSectorSize : sectorSize;
    }

    return Buffer.concat(chunks).slice(0, size);
  }

  const dirStream = readChain(firstDirSector, sectorSize * 8);
  const entries = [];
  for (let offset = 0; offset + 128 <= dirStream.length; offset += 128) {
    const nameLength = dirStream.readUInt16LE(offset + 64);
    if (nameLength < 2) continue;
    const rawName = dirStream.slice(offset, offset + nameLength - 2);
    const name = rawName.toString("utf16le");
    const type = dirStream.readUInt8(offset + 66);
    const left = dirStream.readInt32LE(offset + 68);
    const right = dirStream.readInt32LE(offset + 72);
    const child = dirStream.readInt32LE(offset + 76);
    const startSector = dirStream.readInt32LE(offset + 116);
    const size = Number(readUInt64LE(dirStream, offset + 120));
    entries.push({ name, type, left, right, child, startSector, size, index: entries.length });
  }

  function buildPath(index, currentPath = "") {
    const entry = entries[index];
    if (!entry) return [];
    const paths = [];
    if (entry.left >= 0) paths.push(...buildPath(entry.left, currentPath));
    const nextPath = entry.name === "Root Entry" ? "" : `${currentPath}/${entry.name}`;
    if (entry.type === 2) {
      paths.push({ ...entry, fullPath: nextPath || "/" });
    }
    if (entry.child >= 0) {
      paths.push(...buildPath(entry.child, nextPath));
    }
    if (entry.right >= 0) paths.push(...buildPath(entry.right, currentPath));
    return paths;
  }

  const rootEntry = entries.find((entry) => entry.name === "Root Entry");
  const miniStreamBuffer = rootEntry ? readChain(rootEntry.startSector, rootEntry.size) : Buffer.alloc(0);

  const miniFat = [];
  if (firstMiniFatSector >= 0 && numMiniFatSectors > 0) {
    const miniFatBuffer = readChain(firstMiniFatSector, numMiniFatSectors * sectorSize);
    for (let i = 0; i < miniFatBuffer.length; i += 4) {
      miniFat.push(miniFatBuffer.readInt32LE(i));
    }
  }

  const streams = buildPath(rootEntry.child);
  return {
    streams: streams.map((stream) => {
      const content =
        stream.size < miniStreamCutoff
          ? readChain(stream.startSector, stream.size, true, miniStreamBuffer, miniFat)
          : readChain(stream.startSector, stream.size);
      return { ...stream, content };
    })
  };
}

function decodeRecordText(buffer) {
  const pieces = [];
  let offset = 0;
  while (offset + 4 <= buffer.length) {
    const header = buffer.readUInt32LE(offset);
    const tagId = header & 0x3ff;
    let size = (header >>> 20) & 0xfff;
    offset += 4;
    if (size === 0xfff) {
      if (offset + 4 > buffer.length) break;
      size = buffer.readUInt32LE(offset);
      offset += 4;
    }
    if (offset + size > buffer.length) break;
    const record = buffer.slice(offset, offset + size);
    if (tagId === 67) {
      try {
        pieces.push(record.toString("utf16le").replace(/\u0000/g, ""));
      } catch (error) {
        // Ignore decoding issues and continue.
      }
    }
    offset += size;
  }
  return pieces.join("\n");
}

function extractHwpText(filePath) {
  const { streams } = parseCfb(filePath);
  const fileHeader = streams.find((stream) => stream.fullPath.endsWith("/FileHeader"));
  let compressed = true;
  if (fileHeader) {
    compressed = (fileHeader.content[36] & 0x01) === 0x01;
  }

  const bodyStreams = streams
    .filter((stream) => /\/BodyText\/Section\d+$/i.test(stream.fullPath))
    .sort((a, b) => a.fullPath.localeCompare(b.fullPath, "en"));

  const sections = bodyStreams.map((stream) => {
    let content = stream.content;
    if (compressed) {
      try {
        content = zlib.inflateRawSync(content);
      } catch (error) {
        // Keep original content if decompression fails.
      }
    }
    const text = decodeRecordText(content);
    return { name: stream.fullPath, text };
  });

  return {
    compressed,
    streamNames: streams.map((stream) => stream.fullPath),
    sections
  };
}

const target = process.argv[2];
if (!target) {
  console.error("Usage: node extract-hwp.js <file>");
  process.exit(1);
}

const resolved = path.resolve(target);
const result = extractHwpText(resolved);

console.log(`FILE: ${path.basename(resolved)}`);
console.log(`COMPRESSED: ${result.compressed}`);
console.log("STREAMS:");
for (const name of result.streamNames) {
  console.log(name);
}
console.log("TEXT:");
for (const section of result.sections) {
  console.log(`--- ${section.name} ---`);
  console.log(section.text.slice(0, 12000));
}
