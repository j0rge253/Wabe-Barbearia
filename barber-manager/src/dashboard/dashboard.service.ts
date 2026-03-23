import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const appointments = await this.prisma.appointment.findMany({
      where: { dateTime: { gte: start, lte: end } },
      include: { service: true, client: true },
      orderBy: { dateTime: 'asc' },
    });

    const revenue = appointments.reduce((sum, a) => sum + a.service.price, 0);
    const scheduled = appointments.length;

    // próximo agendamento a partir de agora
    const next = appointments.find((a) => new Date(a.dateTime) >= new Date());
    const nextClient = next ? next.client.name : null;

    return { revenue, scheduled, nextClient };
  }
}
