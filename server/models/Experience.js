import mongoose from 'mongoose'

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true, maxlength: 120 },
  position: { type: String, required: true, trim: true, maxlength: 120 },
  duration: { type: String, required: true, trim: true, maxlength: 80 },
  location: { type: String, trim: true, maxlength: 120, default: '' },
  description: { type: String, required: true, trim: true, maxlength: 1500 },
  technologies: { type: [{ type: String, trim: true, maxlength: 60 }], default: [] },
  certificateUrl: { type: String, trim: true, maxlength: 500, default: '' },
}, { timestamps: true, versionKey: false })

export default mongoose.model('Experience', experienceSchema)