import { Request, Response } from 'express'
import User from '../models/User'

class UserController {
  public async delete (req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.params
    const deleted = await User.deleteOne({ _id })

    return res.json({ deleted })
  }

  public async index (req: Request, res: Response): Promise<Response> {
    const users = await User.find()

    return res.json(users)
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const user = await User
      .create(req.body)
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'User[store]: Um erro ocorreu em sua solicitação.'
      }))

    return res.json(user)
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.params
    const user = await User
      .updateOne({ _id }, { ...req.body })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'User[update]: Um erro ocorreu em sua solicitação.'
      }))

    return res.json(user)
  }
}

export default new UserController()
