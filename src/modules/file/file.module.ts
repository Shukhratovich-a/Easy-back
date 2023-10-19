import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';
import { path } from 'app-root-path';

import { FileController } from './file.controller';

import { FileService } from './file.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(path, 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
