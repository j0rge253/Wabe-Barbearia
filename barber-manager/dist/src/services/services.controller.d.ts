import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
export declare class ServicesController {
    private servicesService;
    constructor(servicesService: ServicesService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
    }[]>;
    create(dto: CreateServiceDto): import(".prisma/client").Prisma.Prisma__ServiceClient<{
        id: number;
        name: string;
        price: number;
        duration: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
