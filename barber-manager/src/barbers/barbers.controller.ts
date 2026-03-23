import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('barbers')
export class BarbersController {
  constructor(private prisma: PrismaService) {}

  // Público — usado na landing page
  @Get()
  findAll() {
    return this.prisma.user.findMany({
      where: { role: 'BARBER' },
      select: { id: true, name: true },
    });
  }
}
