import { Module } from '@nestjs/common';
import { HorariosController } from './horarios.controller';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
  imports: [AppointmentsModule],
  controllers: [HorariosController],
})
export class HorariosModule {}
