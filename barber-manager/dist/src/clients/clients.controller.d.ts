import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
export declare class ClientsController {
    private clientsService;
    constructor(clientsService: ClientsService);
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
