const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

function readEOCD(buffer) {
  for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65557); i -= 1) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      return {
        cdOffset: buffer.readUInt32LE(i + 16),
        cdSize: buffer.readUInt32LE(i + 12)
      };
    }
  }
  throw new Error("EOCD not found");
}

function unzipEntries(filePath) {
  const buffer = fs.readFileSync(filePath);
  const { cdOffset, cdSize } = readEOCD(buffer);
  const entries = [];
  let offset = cdOffset;
  const end = cdOffset + cdSize;

  while (offset < end) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) break;
    const compression = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const fileName = buffer.slice(offset + 46, offset + 46 + fileNameLength).toString("utf8");

    const localNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
    const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.slice(dataStart, dataStart + compressedSize);
    let content;
    if (compression === 0) content = compressed;
    else if (compression === 8) content = zlib.inflateRawSync(compressed);
    else throw new Error(`Unsupported compression ${compression}`);

    entries.push({ fileName, content });
    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries;
}

function decodeXmlText(xml) {
  const texts = [];
  const regex = /<a:t>([\s\S]*?)<\/a:t>/g;
  let match;
  while ((match = regex.exec(xml))) {
    texts.push(
      match[1]
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#10;/g, "\n")
        .replace(/&#13;/g, "\r")
    );
  }
  return texts.join("\n");
}

const target = process.argv[2];
if (!target) {
  console.error("Usage: node extract-pptx.js <file> [keywords...]");
  process.exit(1);
}

const keywords = process.argv.slice(3);
const entries = unzipEntries(path.resolve(target))
  .filter((entry) => /^ppt\/slides\/slide\d+\.xml$/.test(entry.fileName))
  .sort((a, b) => {
    const ai = Number(a.fileName.match(/slide(\d+)\.xml$/)[1]);
    const bi = Number(b.fileName.match(/slide(\d+)\.xml$/)[1]);
    return ai - bi;
  });

for (const entry of entries) {
  const slideNo = Number(entry.fileName.match(/slide(\d+)\.xml$/)[1]);
  const text = decodeXmlText(entry.content.toString("utf8"));
  if (!keywords.length || keywords.some((keyword) => text.includes(keyword))) {
    console.log(`=== slide ${slideNo} ===`);
    console.log(text.slice(0, 8000));
    console.log("---");
  }
}
