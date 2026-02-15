import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    id: string; // Alias for userId to satisfy inconsistent usage
    email: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}
