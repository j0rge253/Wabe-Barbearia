import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
export declare class ClientsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateClientDto): import(".prisma/client").Prisma.Prisma__ClientClient<{
        id: number;
        name: string;
        createdAt: Date;
        phone: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
    }[]>;
}
