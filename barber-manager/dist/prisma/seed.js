"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const hashed = await bcrypt.hash('123456', 10);
    const barber = await prisma.user.upsert({
        where: { email: 'carlos@wave.com' },
        update: {},
        create: { name: 'Carlos Barbeiro', email: 'carlos@wave.com', password: hashed, role: 'BARBER' },
    });
    console.log('Barbeiro criado:', barber.name);
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
//# sourceMappingURL=seed.js.map