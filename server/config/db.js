import mongoose from 'mongoose'
import Project from '../models/Project.js'
import { defaultProjects } from './defaultProjects.js'

export async function connectDatabase() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required. Copy .env.example to .env and configure MongoDB.')
  mongoose.set('sanitizeFilter', true)
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  await Project.init()
  await Project.bulkWrite(defaultProjects.map((project) => ({
    updateOne: { filter: { title: project.title }, update: { $setOnInsert: project }, upsert: true },
  })))
  console.info('Connected to MongoDB')
}