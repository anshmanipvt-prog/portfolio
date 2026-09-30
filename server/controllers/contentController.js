import Achievement from '../models/Achievement.js'
import Experience from '../models/Experience.js'
import Project from '../models/Project.js'
export function contentHandlers(Model) {
  return {
    async list(req, res) {
      const items = await Model.find().sort({ featured: -1, createdAt: -1 })
      return res.json(items)
    },
    async create(req, res) {
      const item = await Model.create(req.body)
      return res.status(201).json(item)
    },
    async update(req, res) {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      if (!item) return res.status(404).json({ message: 'Item not found.' })
      return res.json(item)
    },
    async remove(req, res) {
      const item = await Model.findByIdAndDelete(req.params.id)
      if (!item) return res.status(404).json({ message: 'Item not found.' })
      return res.status(204).end()
    },
  }
}

export const projects = contentHandlers(Project)
export const experience = contentHandlers(Experience)
export const achievements = contentHandlers(Achievement)