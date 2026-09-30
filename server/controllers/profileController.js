import Profile from '../models/Profile.js'

const initialProfile = {
  name: 'Ansh Mani',
  degree: 'B.Tech – Computer Science Engineering',
  university: 'Shobhit University',
  duration: '2024–2028',
  cgpa: '7.0',
  email: 'anshmani.pvt@gmail.com',
  phone: '9305117821',
  github: 'https://github.com/anshmanipvt-prog',
  linkedin: 'https://www.linkedin.com/in/ansh-mani-3852683a0/',
  leetcode: 'https://leetcode.com/u/anshmanipvt-prog/',
  geeksforgeeks: 'https://www.geeksforgeeks.org/profile/anshmas4qp',
  headline: 'B.Tech CSE Student | Developer | Problem Solver',
  intro: 'Computer Science Engineering student passionate about software development, web development and problem solving. I enjoy building real-world projects, learning new technologies and improving my Data Structures & Algorithms skills.',
}
const editableFields = Object.keys(initialProfile)

export async function getProfile(req, res) {
  const profile = await Profile.findOneAndUpdate({ key: 'main' }, { $setOnInsert: initialProfile }, { new: true, upsert: true, setDefaultsOnInsert: true })
  return res.json(profile)
}

export async function updateProfile(req, res) {
  const changes = Object.fromEntries(editableFields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]]))
  const profile = await Profile.findOneAndUpdate({ key: 'main' }, { $set: changes }, { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true })
  return res.json(profile)
}