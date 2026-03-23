import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Barbeiro
  const hashed = await bcrypt.hash('123456', 10);
  const barber = await prisma.user.upsert({
    where: { email: 'carlos@wave.com' },
    update: {},
    create: { name: 'Carlos Barbeiro', email: 'carlos@wave.com', password: hashed, role: 'BARBER' },
  });
  console.log('Barbeiro criado:', barber.name);

  // Serviços
  const services = [
    { name: 'Corte', price: 35, duration: 30 },
    { name: 'Corte + Barba', price: 55, duration: 50 },
    { name: 'Barba', price: 25, duration: 20 },
    { name: 'Hidratação', price: 40, duration: 40 },
  ];

  for (const s of services) {
    const created = await prisma.service.upsert({
      where: { id: (await prisma.service.findFirst({ where: { name: s.name } }))?.id ?? 0 },
      update: {},
      create: s,
    });
    console.log('Serviço criado:', created.name);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
