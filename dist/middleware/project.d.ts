import type { Request, Response, NextFunction } from 'express';
import { IProjet } from "../models/Project";
declare global {
    namespace Express {
        interface Request {
            project: IProjet;
        }
    }
}
export declare function projectExists(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
