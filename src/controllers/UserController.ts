import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/User'

export default {
  async authenticate (req: Request, res: Response): Promise<Response> {
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
          id: user._id,
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
  },
  async authenticateToken (req: Request, res: Response): Promise<Response> {
    const { username, token } = req.body
    const user = await User.findOne({ username }).select('id')

    if (!user) {
      return res
        .status(401)
        .json({
          name: 'Unauthorized',
          message: 'Invalid username'
        })
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET)

      if (typeof decoded === 'object' && user.id === decoded.id) {
        return res
          .status(200)
          .json({
            name: 'Authorized',
            message: 'The token was confirmed'
          })
      } else {
        return res
          .status(401)
          .json({
            name: 'Unauthorized',
            message: 'Invalid token'
          })
      }
    } catch (err) {
      return res
        .status(401)
        .json({
          name: 'Unauthorized',
          message: 'Invalid token'
        })
    }
  },
  async delete (req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const deleted = await User.deleteOne({ id })

    return res.json({ deleted })
  },
  async index (req: Request, res: Response): Promise<Response> {
    const users = await User.find()

    return res.json(users)
  },
  async store (req: Request, res: Response): Promise<Response|void> {
    return User
      .create(req.body)
      .then(async user => {
        return res.json({
          id: user._id,
          firstname: user.firstname,
          username: user.username,
          token: await user.generateToken()
        })
      })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'User[store]: Um erro ocorreu em sua solicitação.'
      }))
  },
  async update (req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const user = await User
      .updateOne({ id }, { ...req.body })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'User[update]: Um erro ocorreu em sua solicitação.'
      }))

    return res.json(user)
  },
  async verifyUsername (req: Request, res: Response): Promise<Response> {
    const { username } = req.params
    const user = await User.findOne({ username })

    if (!user) {
      return res.json({ valid: true }) // it's available to use
    }

    return res.json({ valid: false }) // it's unavailable
  }
}
