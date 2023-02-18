import mongoose from 'mongoose'

const TodoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
    unique: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
})

const Todo = mongoose.models.Todo || mongoose.model('Todo', TodoSchema)

export default Todo
