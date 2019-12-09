import { Router } from 'express'
import GroupController from '../../controllers/GroupController'
import UserController from '../../controllers/UserController'
import AuthMiddleware from '../../middlewares/auth'

export default (routes: Router): void => {
  routes
    .use(AuthMiddleware)

  // Users
  routes
    .delete('/users/:id', UserController.delete)
    .get('/users', UserController.index)
    .put('/users/:id', UserController.update)

  // Groups
  routes
    .get('/groups', GroupController.all)
    .delete('/users/:id/groups/:groupId', GroupController.delete)
    .get('/users/:id/groups', GroupController.index)
    .post('/users/:id/groups', GroupController.store)
    .put('/users/:id/groups/:groupId', GroupController.store)
}
