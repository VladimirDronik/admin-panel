import fs from 'fs';
import path from 'path';

export default defineEventHandler((event) => fs.readFileSync(path.join(process.cwd(), 'cert.pem')));
