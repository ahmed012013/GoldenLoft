import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}
