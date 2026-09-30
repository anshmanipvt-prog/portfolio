import Message from '../models/Message.js'

export async function createMessage(req, res) {
  const message = await Message.create({
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
  })
  return res.status(201).json({ message: 'Message sent successfully.', id: message.id })
}

export async function listMessages(req, res) {
  const messages = await Message.find().sort({ createdAt: -1 }).limit(500)
  return res.json(messages)
}

export async function deleteMessage(req, res) {
  const message = await Message.findByIdAndDelete(req.params.id)
  if (!message) return res.status(404).json({ message: 'Message not found.' })
  return res.status(204).end()
}