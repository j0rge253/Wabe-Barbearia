import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { ServicesModule } from './services/services.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { BarbersModule } from './barbers/barbers.module';
import { HorariosModule } from './horarios/horarios.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    ServicesModule,
    AppointmentsModule,
    DashboardModule,
    BarbersModule,
    HorariosModule,
  ],
})
export class AppModule {}
