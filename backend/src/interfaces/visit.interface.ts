export const VisitStatus = {
  pending: "pending",
  completed: "completed",
  canceled: "canceled",
  confirmed: "confirmed",
} as const;

export const visitStatuses = [
  "pending",
  "completed",
  "canceled",
  "confirmed",
] as const;

export type VisitStatus = (typeof visitStatuses)[number];
export interface Visit {
  _id?: string;
  visitDate: Date;
  place: string;
  service: string;
  user: string;
  status: VisitStatus;
}
