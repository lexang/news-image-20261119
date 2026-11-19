// SPDX-License-Identifier: MIT
// Offline verification of the bundled image and optional two-run outputs.
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function checkPng(filename) {
  const data = readFileSync(filename);
  assert(data.length <= 1024 * 1024, `${filename}: exceeds 1 MiB`);
  assert(data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), 'Invalid PNG signature');
  let offset = 8;
  let header;
  let ended = false;
  let idatSeen = false;
  let idatClosed = false;
  const compressed = [];
  while (offset < data.length) {
    assert(offset + 12 <= data.length, 'Truncated chunk');
    const length = data.readUInt32BE(offset);
    const end = offset + length + 12;
    assert(end <= data.length, 'Truncated chunk payload');
    const type = data.toString('ascii', offset + 4, offset + 8);
    assert(/^[A-Za-z]{4}$/.test(type), 'Invalid chunk type');
    const payload = data.subarray(offset + 8, end - 4);
    assert(crc32(data.subarray(offset + 4, end - 4)) === data.readUInt32BE(end - 4), `CRC mismatch: ${type}`);
    assert(header || type === 'IHDR', 'IHDR must be first');
    if (type === 'IHDR') {
      assert(!header && length === 13, 'Invalid or repeated IHDR');
      header = { width: payload.readUInt32BE(0), height: payload.readUInt32BE(4), depth: payload[8], color: payload[9] };
      assert(header.width === 1000 && header.height === 1000, 'Image must be exactly 1000 × 1000');
      assert(header.depth === 8 && [2, 6].includes(header.color), 'Expected Chromium 8-bit RGB/RGBA PNG');
      assert(payload[10] === 0 && payload[11] === 0 && payload[12] === 0, 'Unsupported compression, filter, or interlace');
    } else if (type === 'IDAT') {
      assert(!idatClosed, 'Nonconsecutive IDAT chunks');
      idatSeen = true;
      compressed.push(payload);
    } else if (type === 'IEND') {
      assert(length === 0 && idatSeen && end === data.length, 'Invalid IEND or trailing bytes');
      ended = true;
    } else {
      if (idatSeen) idatClosed = true;
      assert(type === 'PLTE' || type.charCodeAt(0) >= 97, `Unknown critical chunk: ${type}`);
      if (type === 'PLTE') assert(!idatSeen && length > 0 && length <= 768 && length % 3 === 0, 'Invalid palette');
    }
    offset = end;
  }
  assert(ended && compressed.length, 'Incomplete PNG');
  const stride = header.width * (header.color === 6 ? 4 : 3);
  const expectedLength = (stride + 1) * header.height;
  const raw = inflateSync(Buffer.concat(compressed), { maxOutputLength: expectedLength });
  assert(raw.length === expectedLength, 'Incorrect decompressed pixel length');
  for (let row = 0; row < header.height; row++) {
    assert(raw[row * (stride + 1)] <= 4, `Invalid filter at row ${row}`);
  }
  const sha256 = createHash('sha256').update(data).digest('hex');
  console.log(`${filename}: valid ${header.width}×${header.height} PNG, ${data.length} bytes, SHA-256 ${sha256}`);
  return data;
}

const args = process.argv.slice(2);
assert(args.length === 0 || args.length === 2, 'Usage: node verify.mjs [first/entry.png second/entry.png]');
const bundled = checkPng(fileURLToPath(new URL('./entry.png', import.meta.url)));
if (args.length === 2) {
  const first = checkPng(args[0]);
  const second = checkPng(args[1]);
  assert(first.equals(second) && first.equals(bundled), 'Outputs differ from each other or the bundled PNG');
  console.log('PASS: both output files are byte-identical to the bundled image.');
}
