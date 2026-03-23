import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAvailableSlots(date: string, barberId: number): Promise<string[]>;
    create(dto: CreateAppointmentDto): Promise<{
        id: any;
        clientName: any;
        barber: any;
        service: any;
        time: string;
        status: any;
        whatsapp: any;
    }>;
    findByDate(date: string): Promise<{
        id: any;
        clientName: any;
        barber: any;
        service: any;
        time: string;
        status: any;
        whatsapp: any;
    }[]>;
    updateDateTime(id: number, data: string, horario: string): Promise<{
        id: any;
        clientName: any;
        barber: any;
        service: any;
        time: string;
        status: any;
        whatsapp: any;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
