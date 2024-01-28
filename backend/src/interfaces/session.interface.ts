export interface Session {
  _id?: string;
  user_id: string;
  active_expires: number;
  idle_expires: number;
}
