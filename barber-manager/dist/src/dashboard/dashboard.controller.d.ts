import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<{
        revenue: number;
        scheduled: number;
        nextClient: string | null;
    }>;
}
