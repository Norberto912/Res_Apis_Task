"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const Project_1 = __importDefault(require("../models/Project"));
class ProjectController {
    static CreateProjects = async (req, res) => {
        const project = new Project_1.default(req.body);
        //asignar un manager
        project.manager = req.user._id;
        try {
            await project.save();
            res.send('Proyecto Creado Correctamente');
        }
        catch (error) {
            console.log(error);
        }
    };
    static getAllProjects = async (req, res) => {
        try {
            const projects = await Project_1.default.find({
                $or: [
                    { manager: { $in: [req.user._id] } },
                    { team: { $in: [req.user._id] } }
                ]
            });
            res.json(projects);
        }
        catch (error) {
            console.log(error);
        }
    };
    static getProjectById = async (req, res) => {
        const { id } = req.params;
        try {
            const project = await Project_1.default.findById(id).populate('tasks');
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                return res.status(404).json({ error: error.message });
            }
            if (project.manager.toString() !== req.user._id.toString() && !project.team.includes(req.user._id)) {
                const error = new Error('Accion no Valida');
                return res.status(404).json({ error: error.message });
            }
            res.json(project);
        }
        catch (error) {
            console.log("si errore");
            console.log(error);
        }
    };
    static updateProjectById = async (req, res) => {
        try {
            req.project.clientName = req.body.clientName;
            req.project.projectName = req.body.projectName;
            req.project.description = req.body.description;
            await req.project.save();
            res.send('Protecto Actualizado ');
        }
        catch (error) {
            console.log(error);
        }
    };
    static deleteProject = async (req, res) => {
        try {
            await req.project.deleteOne();
            res.send('Proyecto Eliminado');
        }
        catch (error) {
            console.log(error);
        }
    };
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=ProjectControllers.js.map