export interface ServiceLaunchLog {
  createdAt: string;
  message: string;
}

export interface ServiceLastLaunch {
  id: number;
  serviceId: number;
  status: string;
  statusTitle: string | null;
  log: ServiceLaunchLog[];
  startAt: string;
  endedAt: string;
}

export interface StatusAllResponse {
  name: string;
  serviceId: number;
  slug: string;
  lastLaunch: ServiceLastLaunch;
  status: string;
  statusTitle: string;
  message: string;
  lastTrigger: string;
  ago: string;
}

export interface StatusHistoryDetailsResponse {
  id: number;
  serviceName: string;
  serviceId: number;
  status: string;
  statusTitle: string | null;
  log: ServiceLaunchLog[];
  startAt: string;
  endedAt: string | null;
}

export interface ServerMonitoringDisk {
  diskTotal: string;
  diskFree: string;
  diskSpaceFreePercent: number;
}

export interface ServerMonitoringQueuesItem {
  connection: string;
  queue: string;
  size: number;
}

export interface ServerMonitoringResponse {
  disk: ServerMonitoringDisk;
  queues: ServerMonitoringQueuesItem[];
}
