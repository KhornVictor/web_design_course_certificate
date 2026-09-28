import fs from "fs";
import path from "path";

const imgPath = path.join(process.cwd(), "public", "image.png");
const buf = fs.readFileSync(imgPath);
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);

export const templateDimensions = { width, height, aspectRatio: width / height };
