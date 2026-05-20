export type CoworkingSpace = {
  id: number;
  name: string;
  description?: string;
  capacity: number;
  occupied: boolean;
  reservedBy?: string;
  startTime?: string;
  endTime?: string;
  features?: string[];
};

export type Reservation = {
  id?: number | string;
  spaceId: number;
  user: string;
  startTime: string;
  endTime: string;
};
