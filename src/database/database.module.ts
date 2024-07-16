import { Logger, Module } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (): Promise<Db> => {
        try {
          const client = await MongoClient.connect(process.env.MONGO_URI, {});
          Logger.log('Base de datos conectada exitosamente');
          return client.db(process.env.DB_IA);
        } catch (e) {
          Logger.error('Error al conectar la bd');
          throw e;
        }
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
