import { Router } from 'express'
import UserController from '../../controllers/UserController'

export default (routes: Router): void => {
  routes
    .post('/authenticate', UserController.authenticate)
    .post('/users', UserController.store)
}
