import { Request, Response, NextFunction } from 'express'
import { promisify } from 'util'

import jwt from 'jsonwebtoken'

interface AuthMiddleware extends Request {
    userId?: string | number;
}

interface JWTVerifyResponse {
    id?: string | number;
}

export default async (req: AuthMiddleware, res: Response, next: NextFunction): Promise<Response | void> => {
  const { authorization } = req.headers

  if (!authorization) {
    return res
      .status(401)
      .json({
        message: 'Unauthorized request.',
        howToFix: 'Send the authorization token into the header of your request.'
      })
  }

  if (authorization.indexOf('Bearer') !== 0) {
    return res
      .status(401)
      .json({
        message: 'Malformatted token.',
        howToFix: 'Provide a valid authorization token.'
      })
  }

  const [, token] = authorization.split(' ')

  try {
    const decoded: JWTVerifyResponse = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    req.userId = decoded.id
  } catch (err) {
    console.log('midlewares.auth', err)
    return res
      .status(401)
      .json({
        message: 'Invalid token.',
        howToFix: 'Provide a valid authorization token.'
      })
  }

  return next()
}
