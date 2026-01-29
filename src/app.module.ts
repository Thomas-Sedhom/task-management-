import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: './src/environment/.development.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
  ],
})
export class AppModule {}
