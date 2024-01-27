// const visitStatus = {
//   pending: "pending",
//   completed: "completed",
//   canceled: "canceled",
//   confirmed: "confirmed",
// } as const;
// export const visitStatutes = Object.values(visitStatus);

export const visitStatutes = [
  "pending",
  "completed",
  "canceled",
  "confirmed",
] as const;

export type VisitStatus = (typeof visitStatutes)[number];
