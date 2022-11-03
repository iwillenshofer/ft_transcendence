import { UserInterface } from "src/user/user.interface";

export interface AuthInterface {
  id?: number;
  user?: UserInterface;
  hash?: string;
  used?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
