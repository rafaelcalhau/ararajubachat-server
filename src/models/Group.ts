import { Schema, model, Document } from 'mongoose'
import { UserInterface } from './User'

interface GroupInterface extends Document {
  name: string;
  description?: string;
  isPrivate: boolean;
  members: Schema.Types.ObjectId[];
  ownerId: UserInterface['_id'];
  password?: string;
}

const GroupSchema: Schema = new Schema({
  name: String,
  description: {
    type: String,
    allowNull: true
  },
  isPrivate: Boolean,
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  ownerId: Schema.Types.ObjectId,
  password: {
    type: String,
    allowNull: true
  }
}, {
  timestamps: true
})

export default model<GroupInterface>('Group', GroupSchema)
