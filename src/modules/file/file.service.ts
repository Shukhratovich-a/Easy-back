import { Injectable } from '@nestjs/common';

import {
  // extname,
  join,
} from 'path';
import { ensureDir, writeFile } from 'fs-extra';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import * as sharp from 'sharp';

import { FileElementResponse } from './dto/file-element.dto';

import { MFile } from './mfile.class';

@Injectable()
export class FileService {
  async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = join(path, 'uploads', dateFolder);
    await ensureDir(uploadFolder);

    const res: FileElementResponse[] = [];
    for (const file of files) {
      // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      // const ext = extname(file.originalname);
      // const filename = `${file.originalname}-${uniqueSuffix}${ext}`;

      await writeFile(join(uploadFolder, file.originalname), file.buffer);
      res.push({ url: `/uploads/${dateFolder}/${file.originalname}`, name: file.originalname });
    }

    return res;
  }

  convertToWebp(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }
}
