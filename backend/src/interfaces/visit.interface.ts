export enum VisitStatus {
  pending = 'pending',
  completed = 'completed',
  canceled = 'canceled',
  confirmed = 'confirmed',
}
export const visitStatuses = Object.values(VisitStatus);

export interface Visit {
  _id?: string;
  visitDate: Date;
  place: string;
  service: string;
  user: string;
  status: VisitStatus;
}
