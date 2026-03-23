import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        revenue: number;
        scheduled: number;
        nextClient: string | null;
    }>;
}
