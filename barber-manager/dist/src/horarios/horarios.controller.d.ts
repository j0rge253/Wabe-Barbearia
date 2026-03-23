import { AppointmentsService } from '../appointments/appointments.service';
export declare class HorariosController {
    private appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    getHorarios(data: string, barbeiro: string): Promise<string[]>;
}
