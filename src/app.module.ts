import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BikeModule } from './modules/bike/infrastructure/bike.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BikeModule,
  ],
})
export class AppModule {}
