import { Router } from 'express'
import UserController from '../../controllers/UserController'

export default (routes: Router): void => {
  routes
    .get('/users/username/:username', UserController.verifyUsername)

  routes
    .post('/authenticate', UserController.authenticate)
    .post('/authenticate-token', UserController.authenticateToken)
    .post('/users', UserController.store)
}
