import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
  console.log('Antes:', users);

  // Atualiza só o nome, sem mexer no email
  await prisma.user.update({ where: { id: users[0].id }, data: { name: 'Carlos' } });
  await prisma.user.update({ where: { id: users[1].id }, data: { name: 'Ismael' } });

  const final = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
  console.log('Depois:', final);
}

main().catch(console.error).finally(() => prisma.$disconnect());
