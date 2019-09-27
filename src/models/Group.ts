import { Schema, model, Document } from 'mongoose'
import { UserInterface } from './User'

interface GroupInterface extends Document {
  name: string;
  description?: string;
  createdBy: UserInterface;
  members: Schema.Types.ObjectId[];
}

const GroupSchema: Schema<GroupInterface> = new Schema({
  name: String,
  description: {
    type: String,
    allowNull: true
  },
  createdBy: Schema.Types.ObjectId,
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
})

export default model<GroupInterface>('Group', GroupSchema)
