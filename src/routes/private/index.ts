import { Router } from 'express'
import UserController from '../../controllers/UserController'
import AuthMiddleware from '../../middlewares/auth'

export default (routes: Router): void => {
  routes
    .use(AuthMiddleware)

  routes
    .delete('/users/:id', UserController.delete)
    .get('/users', UserController.index)
    .put('/users/:id', UserController.update)
}
