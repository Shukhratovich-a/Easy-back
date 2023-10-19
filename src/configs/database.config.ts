import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { join } from 'path';

export const getDatabaseConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'sqlite',
    database: join(process.cwd(), 'database', 'db.sqlite'),
    // type: 'postgres',
    // url: getDatabaseString(configService),
    ...getDatabaseOptions(),
  };
};

// export const getDatabaseString = (configService: ConfigService) =>
//   configService.get('postgresql') +
//   '://' +
//   configService.get('DB_USERNAME') +
//   ':' +
//   configService.get('DB_PASSWORD') +
//   '@' +
//   configService.get('DB_HOST') +
//   ':' +
//   configService.get('DB_PORT') +
//   '/' +
//   configService.get('DB_DATABASE');

const getDatabaseOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoLoadEntities: true,
  synchronize: true,
});
