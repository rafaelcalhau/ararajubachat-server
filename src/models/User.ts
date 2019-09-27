import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export declare interface UserInterface extends Document {
  firstname: string;
  fullname?: Function;
  lastname?: string;
  username: string;
  password?: string;
  generateToken: Function;
}

const UserSchema: Schema<UserInterface> = new Schema({
  avatar: String,
  firstname: {
    type: String,
    allowNull: false
  },
  lastname: {
    type: String,
    allowNull: false
  },
  username: {
    type: String,
    allowNull: false,
    unique: true
  },
  password: {
    type: String,
    allowNull: false,
    select: false
  }
}, {
  timestamps: true
})

UserSchema.methods.fullname = function (): string {
  return `${this.firstname} ${this.lastname}`
}

UserSchema.methods.generateToken = function (): string {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET)
}

UserSchema.pre<UserInterface>('save', async function (next): Promise<void> {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 8)
  }

  return next()
})

export default model<UserInterface>('User', UserSchema)
