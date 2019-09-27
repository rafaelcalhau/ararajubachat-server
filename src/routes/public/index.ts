import { Router } from 'express'
import UserController from '../../controllers/UserController'

export default (routes: Router): void => {
  routes
    .post('/users', UserController.store)
}
