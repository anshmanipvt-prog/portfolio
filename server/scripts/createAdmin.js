import '../config/env.js'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import User from '../models/User.js'

const terminal = readline.createInterface({ input: stdin, output: stdout })

function promptPassword() {
  if (!stdin.isTTY || typeof stdin.setRawMode !== 'function') throw new Error('Run this command in an interactive terminal to enter the admin password securely.')
  stdout.write('Admin password (12+ characters): ')
  stdin.setRawMode(true)
  stdin.resume()

  return new Promise((resolve, reject) => {
    let password = ''
    const cleanup = () => {
      stdin.setRawMode(false)
      stdin.pause()
      stdin.removeListener('data', onData)
      stdout.write('\n')
    }
    const onData = (chunk) => {
      for (const character of chunk.toString('utf8')) {
        if (character === '\u0003') {
          cleanup()
          reject(new Error('Password entry cancelled.'))
          return
        }
        if (character === '\r' || character === '\n') {
          cleanup()
          resolve(password)
          return
        }
        if (character === '\u007f' || character === '\b') {
          if (password.length) {
            password = password.slice(0, -1)
            stdout.write('\b \b')
          }
        } else if (character >= ' ') {
          password += character
          stdout.write('*')
        }
      }
    }
    stdin.on('data', onData)
  })
}

try {
  if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI in the project .env file first.')
  await mongoose.connect(process.env.MONGO_URI)
  const email = (await terminal.question('Admin email: ')).trim().toLowerCase()
  terminal.close()
  const password = await promptPassword()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.')
  if (password.length < 12) throw new Error('Admin passwords must be at least 12 characters long.')
  const passwordHash = await bcrypt.hash(password, 12)
  await User.create({ email, passwordHash, role: 'admin' })
  console.info(`Administrator account created for ${email}.`)
} catch (error) {
  console.error(`Admin setup failed: ${error.message}`)
  process.exitCode = 1
} finally {
  terminal.close()
  await mongoose.disconnect().catch(() => {})
}