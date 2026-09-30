import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true, immutable: true },
  name: { type: String, trim: true, maxlength: 100, default: 'Ansh Mani' },
  degree: { type: String, trim: true, maxlength: 140, default: 'B.Tech - Computer Science Engineering' },
  university: { type: String, trim: true, maxlength: 140, default: 'Shobhit University' },
  duration: { type: String, trim: true, maxlength: 40, default: '2024-2028' },
  cgpa: { type: String, trim: true, maxlength: 20, default: '7.0' },
  email: { type: String, trim: true, lowercase: true, maxlength: 254, default: 'anshmani.pvt@gmail.com' },
  phone: { type: String, trim: true, maxlength: 32, default: '9305117821' },
  github: { type: String, trim: true, maxlength: 500, default: 'https://github.com/anshmanipvt-prog' },
  linkedin: { type: String, trim: true, maxlength: 500, default: 'https://www.linkedin.com/in/ansh-mani-3852683a0/' },
  leetcode: { type: String, trim: true, maxlength: 500, default: 'https://leetcode.com/u/anshmanipvt-prog/' },
  geeksforgeeks: { type: String, trim: true, maxlength: 500, default: 'https://www.geeksforgeeks.org/profile/anshmas4qp' },
  resumeUrl: { type: String, trim: true, maxlength: 1000, default: '' },
  headline: { type: String, trim: true, maxlength: 180, default: 'B.Tech CSE Student | Developer | Problem Solver' },
  intro: { type: String, trim: true, maxlength: 700, default: 'Computer Science Engineering student passionate about software development, web development and problem solving. I enjoy building real-world projects, learning new technologies and improving my Data Structures & Algorithms skills.' },
}, { timestamps: true, versionKey: false })

export default mongoose.model('Profile', profileSchema)