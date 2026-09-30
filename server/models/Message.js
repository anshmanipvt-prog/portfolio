import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  subject: { type: String, required: true, trim: true, maxlength: 120 },
  message: { type: String, required: true, trim: true, maxlength: 4000 },
}, { timestamps: { createdAt: true, updatedAt: false }, versionKey: false })

export default mongoose.model('Message', messageSchema)