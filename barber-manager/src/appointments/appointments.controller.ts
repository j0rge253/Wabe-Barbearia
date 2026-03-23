import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  // Público — slots disponíveis
  @Get('horarios')
  getHorarios(@Query('data') data: string, @Query('barbeiro') barbeiro: string) {
    const today = new Date().toISOString().split('T')[0];
    return this.appointmentsService.getAvailableSlots(data ?? today, Number(barbeiro));
  }

  // Público — agendamento landing page
  @Post('public')
  createPublic(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  // Protegidas — área do barbeiro
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findByDate(@Query('date') date: string) {
    const target = date ?? new Date().toISOString().split('T')[0];
    return this.appointmentsService.findByDate(target);
  }

  // PATCH /api/appointments/:id — editar horário
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { data: string; horario: string }) {
    return this.appointmentsService.updateDateTime(Number(id), body.data, body.horario);
  }

  // DELETE /api/appointments/:id — excluir agendamento
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(Number(id));
  }
}
