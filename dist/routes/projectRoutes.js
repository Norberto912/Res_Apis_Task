"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const ProjectControllers_1 = require("../controllers/ProjectControllers");
const validation_1 = require("../middleware/validation");
const TaskController_1 = require("../controllers/TaskController");
const project_1 = require("../middleware/project");
const task_1 = require("../middleware/task");
const auth_1 = require("../middleware/auth");
const TeamController_1 = require("../controllers/TeamController");
const NoteController_1 = require("../controllers/NoteController");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/', (0, express_validator_1.body)('projectName')
    .notEmpty().withMessage('El nombre del Proyecto es Obligatorio'), (0, express_validator_1.body)('clientName')
    .notEmpty().withMessage('El nombre del Clinete es Obligatorio'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('La descripcion del Proyecto es Obligatorio'), validation_1.handleInputErrors, ProjectControllers_1.ProjectController.CreateProjects);
router.get('/', ProjectControllers_1.ProjectController.getAllProjects);
router.get('/:id', (0, express_validator_1.param)('id').isMongoId().withMessage('ID no valido'), validation_1.handleInputErrors, ProjectControllers_1.ProjectController.getProjectById);
/**Routes from tasks */
router.param('projectId', project_1.projectExists);
router.put('/:projectId', (0, express_validator_1.param)('projectId').isMongoId().withMessage('ID no valido'), (0, express_validator_1.body)('projectName')
    .notEmpty().withMessage('El nombre del Proyecto es Obligatorio'), (0, express_validator_1.body)('clientName')
    .notEmpty().withMessage('El nombre del Clinete es Obligatorio'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('La descripcion del Proyecto es Obligatorio'), validation_1.handleInputErrors, task_1.hasAuthorization, ProjectControllers_1.ProjectController.updateProjectById);
router.delete('/:projectId', (0, express_validator_1.param)('projectId').isMongoId().withMessage('ID no valido'), validation_1.handleInputErrors, task_1.hasAuthorization, ProjectControllers_1.ProjectController.deleteProject);
router.post('/:projectId/tasks', task_1.hasAuthorization, (0, express_validator_1.body)('name')
    .notEmpty().withMessage('El nombre del la Tarea  es Obligatorio'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('El la descripcion de la tarea  es Obligatorio'), validation_1.handleInputErrors, TaskController_1.TaskController.createTask);
router.get('/:projectId/tasks', TaskController_1.TaskController.getProjectTasks);
router.param('taskId', task_1.taksExists);
router.param('taskId', task_1.taskBelongsToProject);
router.get('/:projectId/tasks/:taskId', (0, express_validator_1.param)('taskId').isMongoId().withMessage('ID no valido'), validation_1.handleInputErrors, TaskController_1.TaskController.getTaskById);
router.put('/:projectId/tasks/:taskId', task_1.hasAuthorization, (0, express_validator_1.param)('taskId').isMongoId().withMessage('ID no valido'), (0, express_validator_1.body)('name')
    .notEmpty().withMessage('El nombre del la Tarea  es Obligatorio'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('El la descripcion de la tarea  es Obligatorio'), validation_1.handleInputErrors, TaskController_1.TaskController.uapdateTask);
router.delete('/:projectId/tasks/:taskId', task_1.hasAuthorization, (0, express_validator_1.param)('taskId').isMongoId().withMessage('ID no valido'), validation_1.handleInputErrors, TaskController_1.TaskController.deleteTask);
router.post('/:projectId/tasks/:taskId/status', (0, express_validator_1.param)('taskId').isMongoId().withMessage('ID no valido'), (0, express_validator_1.body)('status')
    .notEmpty().withMessage('El estado es Obligatorio'), validation_1.handleInputErrors, TaskController_1.TaskController.updateStatus);
/**Routers for Temma */
router.post('/:projectId/team/find', (0, express_validator_1.body)('email')
    .isEmail().toLowerCase().withMessage('E-mail no valido'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.findMemberByEmail);
router.get('/:projectId/team', TeamController_1.TeamMemberController.getProjecTeam);
router.post('/:projectId/team', (0, express_validator_1.body)('id')
    .isMongoId().withMessage('ID No valido'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.addMemberById);
router.delete('/:projectId/team/:userId', (0, express_validator_1.param)('userId')
    .isMongoId().withMessage('ID No valido'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.removeMemberById);
/**Routes for Notes */
router.post('/:projectId/tasks/:taskId/note', (0, express_validator_1.body)('content')
    .notEmpty().withMessage('El Contenido de la nota es obligatorio'), validation_1.handleInputErrors, NoteController_1.NoteController.createNote);
router.get('/:projectId/tasks/:taskId/note', NoteController_1.NoteController.getTasNotes);
router.delete('/:projectId/tasks/:taskId/note/:noteId', (0, express_validator_1.param)('noteId').isMongoId().withMessage('ID No Valido'), validation_1.handleInputErrors, NoteController_1.NoteController.deleteNote);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map