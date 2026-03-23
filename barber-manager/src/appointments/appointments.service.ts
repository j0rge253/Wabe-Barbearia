import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

const SLOT_INTERVAL = 30;
const OPEN_HOUR = 9;
const CLOSE_HOUR_WEEK = 19;
const CLOSE_HOUR_SATURDAY = 18;

function gerarSlots(closeHour: number): string[] {
  const slots: string[] = [];
  let hora = OPEN_HOUR;
  let minuto = 0;
  while (hora < closeHour) {
    slots.push(`${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`);
    minuto += SLOT_INTERVAL;
    if (minuto === 60) { minuto = 0; hora++; }
  }
  return slots;
}

function slotsOcupados(durationMinutes: number): number {
  return Math.ceil(durationMinutes / SLOT_INTERVAL);
}

function formatAppointment(appt: any) {
  return {
    id: appt.id,
    clientName: appt.client.name,
    barber: appt.barber.name,
    service: appt.service.name,
    time: new Date(appt.dateTime).toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', hour12: false,
    }),
    status: appt.status ?? 'confirmed',
    whatsapp: appt.whatsapp ?? null,
  };
}

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  /** Retorna array de strings: ["09:00", "09:30", ...] */
  async getAvailableSlots(date: string, barberId: number): Promise<string[]> {
    const [year, month, day] = date.split('-').map(Number);
    const dayDate = new Date(year, month - 1, day);
    const dayOfWeek = dayDate.getDay();

    if (dayOfWeek === 0) return [];

    const closeHour = dayOfWeek === 6 ? CLOSE_HOUR_SATURDAY : CLOSE_HOUR_WEEK;
    const allSlots = gerarSlots(closeHour);

    const start = new Date(year, month - 1, day, 0, 0, 0);
    const end = new Date(year, month - 1, day, 23, 59, 59);

    const agendamentos = await this.prisma.appointment.findMany({
      where: { barberId, dateTime: { gte: start, lte: end } },
      include: { service: true },
    });

    const bloqueados = new Set<string>();
    for (const appt of agendamentos) {
      const apptDate = new Date(appt.dateTime);
      const slotInicio = `${String(apptDate.getHours()).padStart(2, '0')}:${String(apptDate.getMinutes()).padStart(2, '0')}`;
      const qtd = slotsOcupados(appt.service.duration);
      const idxInicio = allSlots.indexOf(slotInicio);
      if (idxInicio !== -1) {
        for (let i = 0; i < qtd; i++) {
          if (allSlots[idxInicio + i]) bloqueados.add(allSlots[idxInicio + i]);
        }
      }
    }

    const now = new Date();
    const isToday = dayDate.toDateString() === now.toDateString();

    return allSlots.filter((slot) => {
      if (bloqueados.has(slot)) return false;
      if (isToday) {
        const [h, m] = slot.split(':').map(Number);
        const slotDate = new Date(year, month - 1, day, h, m);
        if (slotDate <= now) return false;
      }
      return true;
    });
  }

  async create(dto: CreateAppointmentDto) {
    const service = await this.prisma.service.findUnique({ where: { id: Number(dto.serviceId) } });
    if (!service) throw new NotFoundException('Serviço não encontrado');

    // Monta o DateTime a partir de data + horario separados
    const [year, month, day] = dto.data.split('-').map(Number);
    const [hour, minute] = dto.horario.split(':').map(Number);
    const newStart = new Date(year, month - 1, day, hour, minute, 0);
    const newEnd = new Date(newStart.getTime() + service.duration * 60000);

    if (newStart <= new Date()) {
      throw new BadRequestException('Não é possível agendar em uma data e hora que já passou.');
    }

    const dayOfWeek = newStart.getDay();
    if (dayOfWeek === 0) {
      throw new BadRequestException('Não realizamos atendimentos aos domingos.');
    }

    const timeInMinutes = hour * 60 + minute;
    const closeTime = (dayOfWeek === 6 ? CLOSE_HOUR_SATURDAY : CLOSE_HOUR_WEEK) * 60;
    if (timeInMinutes < OPEN_HOUR * 60) {
      throw new BadRequestException('O horário de abertura é às 09:00.');
    }
    if (timeInMinutes + service.duration > closeTime) {
      throw new BadRequestException('O atendimento ultrapassaria o horário de fechamento.');
    }

    // Resolve cliente
    let clientId = dto.clientId ? Number(dto.clientId) : undefined;
    if (!clientId) {
      const resolvedName = dto.name;
      if (!resolvedName) throw new BadRequestException('Informe o nome do cliente.');

      let client = dto.whatsapp
        ? await this.prisma.client.findFirst({ where: { phone: dto.whatsapp } })
        : null;

      if (!client) {
        client = await this.prisma.client.create({
          data: { name: resolvedName, phone: dto.whatsapp ?? '' },
        });
      }
      clientId = client.id;
    }

    // Validação de conflito — retorna 409
    const dayStart = new Date(year, month - 1, day, 0, 0, 0);
    const dayEnd = new Date(year, month - 1, day, 23, 59, 59);

    const existing = await this.prisma.appointment.findMany({
      where: { barberId: Number(dto.barberId), dateTime: { gte: dayStart, lte: dayEnd } },
      include: { service: true },
    });

    for (const appt of existing) {
      const existStart = new Date(appt.dateTime);
      const existEnd = new Date(existStart.getTime() + appt.service.duration * 60000);
      if (newStart < existEnd && newEnd > existStart) {
        throw new ConflictException({ erro: 'Horário indisponível' });
      }
    }

    const created = await this.prisma.appointment.create({
      data: {
        dateTime: newStart,
        barberId: Number(dto.barberId),
        clientId,
        serviceId: Number(dto.serviceId),
        whatsapp: dto.whatsapp,
      },
      include: { barber: true, client: true, service: true },
    });

    return formatAppointment(created);
  }

  async findByDate(date: string) {
    const [year, month, day] = date.split('-').map(Number);
    const start = new Date(year, month - 1, day, 0, 0, 0);
    const end = new Date(year, month - 1, day, 23, 59, 59);

    const appointments = await this.prisma.appointment.findMany({
      where: { dateTime: { gte: start, lte: end } },
      include: { barber: true, client: true, service: true },
      orderBy: { dateTime: 'asc' },
    });

    return appointments.map(formatAppointment);
  }

  async updateDateTime(id: number, data: string, horario: string) {
    const appt = await this.prisma.appointment.findUnique({
      where: { id },
      include: { service: true },
    });
    if (!appt) throw new NotFoundException('Agendamento não encontrado');

    const [year, month, day] = data.split('-').map(Number);
    const [hour, minute] = horario.split(':').map(Number);
    const newStart = new Date(year, month - 1, day, hour, minute, 0);
    const newEnd = new Date(newStart.getTime() + appt.service.duration * 60000);

    // Verifica conflito (excluindo o próprio agendamento)
    const dayStart = new Date(year, month - 1, day, 0, 0, 0);
    const dayEnd = new Date(year, month - 1, day, 23, 59, 59);
    const existing = await this.prisma.appointment.findMany({
      where: { barberId: appt.barberId, dateTime: { gte: dayStart, lte: dayEnd }, NOT: { id } },
      include: { service: true },
    });

    for (const other of existing) {
      const existStart = new Date(other.dateTime);
      const existEnd = new Date(existStart.getTime() + other.service.duration * 60000);
      if (newStart < existEnd && newEnd > existStart) {
        throw new ConflictException({ erro: 'Horário indisponível' });
      }
    }

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { dateTime: newStart },
      include: { barber: true, client: true, service: true },
    });

    return formatAppointment(updated);
  }

  async remove(id: number) {
    await this.prisma.appointment.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new NotFoundException('Agendamento não encontrado');
    });
    await this.prisma.appointment.delete({ where: { id } });
    return { message: 'Agendamento excluído com sucesso' };
  }
}