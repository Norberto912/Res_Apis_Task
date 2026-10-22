import type { Request, Response } from "express";
export declare class ProjectController {
    static CreateProjects: (req: Request, res: Response) => Promise<void>;
    static getAllProjects: (req: Request, res: Response) => Promise<void>;
    static getProjectById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static updateProjectById: (req: Request, res: Response) => Promise<void>;
    static deleteProject: (req: Request, res: Response) => Promise<void>;
}
