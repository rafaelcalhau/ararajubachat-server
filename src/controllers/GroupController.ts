import { Request, Response } from 'express'
import Group from '../models/Group'

export default {
  async delete (req: Request, res: Response): Promise<Response> {
    const { id: userId, groupId } = req.params
    const deleted = await Group.deleteOne({ id: groupId, ownerId: userId })

    return res.json({ deleted })
  },
  async index (req: Request, res: Response): Promise<Response> {
    const { id: userId } = req.params
    const groups = await Group.find({ ownerId: userId })

    return res.json(groups)
  },
  async store (req: Request, res: Response): Promise<Response|void> {
    const { id: userId } = req.params

    if (userId !== req.body.ownerId) {
      res.status(400).json({
        name: 'BadRequest',
        message: 'Group[store]: The owner id seems to be invalid.'
      })
    }

    return Group
      .create(req.body)
      .then(group => res.json(group))
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'Group[store]: An error happened with your request.'
      }))
  },
  async update (req: Request, res: Response): Promise<Response> {
    const { id: userId, groupId } = req.params

    const group = await Group
      .updateOne({ id: groupId, ownerId: userId }, { ...req.body })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'User[update]: Um erro ocorreu em sua solicitação.'
      }))

    return res.json(group)
  }
}
