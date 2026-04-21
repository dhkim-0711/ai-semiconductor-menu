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

  const dirStream = readChain(firstDirSector, sectorSize * 16);
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

  function walk(index, currentPath = "") {
    const entry = entries[index];
    if (!entry) return [];
    const items = [];
    if (entry.left >= 0) items.push(...walk(entry.left, currentPath));
    const nextPath = entry.name === "Root Entry" ? "" : `${currentPath}/${entry.name}`;
    if (entry.type === 2) items.push({ ...entry, fullPath: nextPath });
    if (entry.child >= 0) items.push(...walk(entry.child, nextPath));
    if (entry.right >= 0) items.push(...walk(entry.right, currentPath));
    return items;
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

  return walk(rootEntry.child).map((stream) => {
    const content =
      stream.size < miniStreamCutoff
        ? readChain(stream.startSector, stream.size, true, miniStreamBuffer, miniFat)
        : readChain(stream.startSector, stream.size);
    return { ...stream, content };
  });
}

function decodeText(content, compressed) {
  let buffer = content;
  if (compressed) {
    try {
      buffer = zlib.inflateRawSync(content);
    } catch (error) {
      return "";
    }
  }

  const parts = [];
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
    if (tagId === 67) {
      parts.push(buffer.slice(offset, offset + size).toString("utf16le"));
    }
    offset += size;
  }
  return parts.join("\n").replace(/\u0000/g, "");
}

function extract(filePath) {
  const streams = parseCfb(filePath);
  const fileHeader = streams.find((stream) => stream.fullPath.endsWith("/FileHeader"));
  const compressed = fileHeader ? (fileHeader.content[36] & 0x01) === 0x01 : true;
  const sections = streams.filter((stream) => stream.fullPath.includes("/BodyText/Section"));
  return sections.map((section) => decodeText(section.content, compressed)).join("\n");
}

const target = process.argv[2];
const terms = process.argv.slice(3);
const text = extract(path.resolve(target));

for (const term of terms) {
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (line.includes(term)) {
      const from = Math.max(0, index - 2);
      const to = Math.min(lines.length, index + 3);
      console.log(`### ${term} @ line ${index + 1}`);
      console.log(lines.slice(from, to).join("\n"));
      console.log("---");
    }
  });
}
