import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsController {
    private appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    getHorarios(data: string, barbeiro: string): Promise<string[]>;
    createPublic(dto: CreateAppointmentDto): Promise<{
        id: any;
        clientName: any;
        barber: any;
        service: any;
        time: string;
        status: any;
        whatsapp: any;
    }>;
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
    update(id: string, body: {
        data: string;
        horario: string;
    }): Promise<{
        id: any;
        clientName: any;
        barber: any;
        service: any;
        time: string;
        status: any;
        whatsapp: any;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
