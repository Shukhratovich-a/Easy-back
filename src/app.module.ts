import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getDatabaseConfig } from '@/configs/database.config';

import { Modules } from '@/modules/modules.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.dev' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),

    Modules,
  ],
})
export class AppModule {}
