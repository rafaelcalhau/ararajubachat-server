import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User'

class UserController {
  public async authenticate (req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body
    const user = await User.findOne({ username }).select('+password')

    if (!user) {
      return res
        .status(401)
        .json({
          name: 'Unauthorized',
          message: 'Invalid username'
        })
    }

    bcrypt.compare(password, user.password, async (err, valid) => {
      if (err) {
        return res
          .status(500)
          .json({
            name: 'Exception',
            message: err
          })
      }

      if (valid) {
        return res.json({
          name: user.fullname(),
          token: await user.generateToken()
        })
      }

      return res
        .status(401)
        .json({
          name: 'Unauthorized',
          message: 'Invalid password'
        })
    })
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const deleted = await User.deleteOne({ id })

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
    const { id } = req.params
    const user = await User
      .updateOne({ id }, { ...req.body })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'User[update]: Um erro ocorreu em sua solicitação.'
      }))

    return res.json(user)
  }

  public async verifyUsername (req: Request, res: Response): Promise<Response> {
    const { username } = req.params
    const user = await User.findOne({ username })

    if (!user) {
      return res.json({ valid: true }) // it's available to use
    }

    return res.json({ valid: false }) // it's unavailable
  }
}

export default new UserController()
