"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taksExists = taksExists;
exports.taskBelongsToProject = taskBelongsToProject;
exports.hasAuthorization = hasAuthorization;
const Task_1 = __importDefault(require("../models/Task"));
async function taksExists(req, res, next) {
    try {
        const { taskId } = req.params;
        const task = await Task_1.default.findById(taskId);
        if (!task) {
            const error = new Error('Tarea no encontrado');
            return res.status(404).json({ error: error.message });
        }
        req.task = task;
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
}
async function taskBelongsToProject(req, res, next) {
    if (req.task.project.toString() !== req.project._id.toString()) {
        const error = new Error('Accion no Valida');
        return res.status(400).json({ error: error.message });
    }
    next();
}
async function hasAuthorization(req, res, next) {
    if (req.user._id.toString() !== req.project.manager.toString()) {
        const error = new Error('Accion no Valida');
        return res.status(400).json({ error: error.message });
    }
    next();
}
//# sourceMappingURL=task.js.map