import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BikeModule } from './modules/bike/infrastructure/bike.module.js';
import { CustomerModule } from './modules/customer/customer.module.js';
import { InventoryModule } from './modules/inventory/infrastructure/inventory.module.js';
import { RentalModule } from './modules/rental/infrastructure/rental.module.js';
import { SaleModule } from './modules/sale/infrastructure/sale.module.js';
import { HealthController } from './libs/health/health.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BikeModule,
    CustomerModule,
    InventoryModule,
    RentalModule,
    SaleModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
