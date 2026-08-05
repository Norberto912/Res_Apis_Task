import { Router} from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectControllers'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { projectExists } from '../middleware/project'
import { taksExists, taskBelongsToProject } from '../middleware/task'


const router =Router()

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

router.get('/', ProjectController.getAllProjects

)

router.get('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.getProjectById
)

router.put('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
     body('projectName')
         .notEmpty().withMessage('El nombre del Proyecto es Obligatorio'),
    body('clientName')
         .notEmpty().withMessage('El nombre del Clinete es Obligatorio'),
    body('description')
         .notEmpty().withMessage('La descripcion del Proyecto es Obligatorio'),
    handleInputErrors,
    ProjectController.updateProjectById
)

router.delete('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProjectController.deleteProject
)


/**Routes from tasks */
router.param('projectId',projectExists)

router.post('/:projectId/tasks',     
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
         param('taskId').isMongoId().withMessage('ID no valido'),
          body('name')
         .notEmpty().withMessage('El nombre del la Tarea  es Obligatorio'),
           body('description')
         .notEmpty().withMessage('El la descripcion de la tarea  es Obligatorio'),
    handleInputErrors,   
     TaskController.uapdateTask
)

router.delete('/:projectId/tasks/:taskId',  
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



export default router