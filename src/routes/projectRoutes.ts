import { Router} from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectControllers'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { projectExists } from '../middleware/project'
import { hasAuthorization, taksExists, taskBelongsToProject } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamMemberController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'


const router =Router()
router.use(authenticate)

router.post('/',    
    body('projectName')
         .notEmpty().withMessage('El nombre del Proyecto es Obligatorio'),
    body('clientName')
         .notEmpty().withMessage('El nombre del Clinete es Obligatorio'),
    body('description')
         .notEmpty().withMessage('La descripcion del Proyecto es Obligatorio'),
         handleInputErrors,
    ProjectController.CreateProjects
)

router.get('/',ProjectController.getAllProjects)

router.get('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.getProjectById
)
/**Routes from tasks */
router.param('projectId',projectExists)

router.put('/:projectId',
    param('projectId').isMongoId().withMessage('ID no valido'),
     body('projectName')
         .notEmpty().withMessage('El nombre del Proyecto es Obligatorio'),
    body('clientName')
         .notEmpty().withMessage('El nombre del Clinete es Obligatorio'),
    body('description')
         .notEmpty().withMessage('La descripcion del Proyecto es Obligatorio'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProjectById
)

router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject
)

router.post('/:projectId/tasks', 
     hasAuthorization,    
     body('name')
         .notEmpty().withMessage('El nombre del la Tarea  es Obligatorio'),
     body('description')
         .notEmpty().withMessage('El la descripcion de la tarea  es Obligatorio'),     
         handleInputErrors,
     TaskController.createTask
)

router.get('/:projectId/tasks',    
     TaskController.getProjectTasks
)

router.param('taskId',taksExists)
router.param('taskId',taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',  
         param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,   
     TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
         hasAuthorization,  
         param('taskId').isMongoId().withMessage('ID no valido'),
          body('name')
         .notEmpty().withMessage('El nombre del la Tarea  es Obligatorio'),
           body('description')
         .notEmpty().withMessage('El la descripcion de la tarea  es Obligatorio'),
    handleInputErrors,   
     TaskController.uapdateTask
)

router.delete('/:projectId/tasks/:taskId',  
          hasAuthorization,
         param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,   
     TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
      param('taskId').isMongoId().withMessage('ID no valido'),
      body('status')
      .notEmpty().withMessage('El estado es Obligatorio'),
      handleInputErrors,
      TaskController.updateStatus
)

/**Routers for Temma */

router.post('/:projectId/team/find',
     body('email')
     .isEmail().toLowerCase().withMessage('E-mail no valido'),
     handleInputErrors,
     TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
    TeamMemberController.getProjecTeam
)

router.post('/:projectId/team',
     body('id')
     .isMongoId().withMessage('ID No valido'),
     handleInputErrors,
     TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
     param('userId')
     .isMongoId().withMessage('ID No valido'),
     handleInputErrors,
     TeamMemberController.removeMemberById
)

/**Routes for Notes */

router.post('/:projectId/tasks/:taskId/note',
     body('content')
     .notEmpty().withMessage('El Contenido de la nota es obligatorio'),
     handleInputErrors,
     NoteController.createNote
)
router.get('/:projectId/tasks/:taskId/note',
   NoteController.getTasNotes
)

router.delete('/:projectId/tasks/:taskId/note/:noteId',
     param('noteId').isMongoId().withMessage('ID No Valido'),
     handleInputErrors,
     NoteController.deleteNote
)



export default router