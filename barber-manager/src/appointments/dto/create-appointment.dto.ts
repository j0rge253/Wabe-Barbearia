import { IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  data: string; // YYYY-MM-DD

  @IsString()
  horario: string; // HH:mm

  @IsString()
  barberId: string | number;

  @IsString()
  serviceId: string | number;

  // Agendamento público
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  // Agendamento admin
  @IsOptional()
  clientId?: string | number;
}
