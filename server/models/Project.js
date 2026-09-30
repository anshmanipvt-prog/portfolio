import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120, unique: true },
  subtitle: { type: String, trim: true, maxlength: 180, default: '' },
  description: { type: String, required: true, trim: true, maxlength: 1500 },
  technologies: { type: [{ type: String, trim: true, maxlength: 60 }], default: [] },
  features: { type: [{ type: String, trim: true, maxlength: 180 }], default: [] },
  githubUrl: { type: String, trim: true, maxlength: 500, default: '' },
  liveUrl: { type: String, trim: true, maxlength: 500, default: '' },
  image: { type: String, trim: true, maxlength: 1000, default: '' },
  category: { type: String, required: true, trim: true, maxlength: 60 },
  featured: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false })

export default mongoose.model('Project', projectSchema)