"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
    console.log('Antes:', users);
    await prisma.user.update({ where: { id: users[0].id }, data: { name: 'Carlos' } });
    await prisma.user.update({ where: { id: users[1].id }, data: { name: 'Ismael' } });
    const final = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
    console.log('Depois:', final);
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=fix-barbers.js.map