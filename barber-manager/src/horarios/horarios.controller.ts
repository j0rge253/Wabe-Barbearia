import { Controller, Get, Query } from '@nestjs/common';
import { AppointmentsService } from '../appointments/appointments.service';

@Controller('horarios')
export class HorariosController {
  constructor(private appointmentsService: AppointmentsService) {}

  // GET /api/horarios?data=2026-03-25&barbeiro=1
  @Get()
  getHorarios(
    @Query('data') data: string,
    @Query('barbeiro') barbeiro: string,
  ) {
    const today = new Date().toISOString().split('T')[0];
    return this.appointmentsService.getAvailableSlots(
      data ?? today,
      Number(barbeiro),
    );
  }
}
