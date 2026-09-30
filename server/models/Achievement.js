import mongoose from 'mongoose'

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  date: { type: String, trim: true, maxlength: 80, default: '' },
  description: { type: String, required: true, trim: true, maxlength: 1500 },
  url: { type: String, trim: true, maxlength: 500, default: '' },
}, { timestamps: true, versionKey: false })

export default mongoose.model('Achievement', achievementSchema)