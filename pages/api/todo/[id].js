import Todo from '@/models/Todo'
import dbConnect from '@/services/db'

dbConnect()

export default async function handler(req, res) {
  const { method } = req
  const { id } = req.query
  let payLoad = req.body

  if(req.body.isStatusChanged) payLoad = { isCompleted: !req.body.prevStatus }

  switch (method) {
    case 'PUT':
      try {
        await Todo.updateOne({ _id: id }, payLoad)
        res.status(200).json({ success: true })
      } catch (error) {
        res.status(500).json({ success: false, error })
      }
      break

    case 'DELETE':
      try {
        await Todo.deleteOne({ _id: id })
        res.status(200).json({ success: true })
      } catch (error) {
        res.status(500).json({ success: false, error })
      }
      break
  }
}
