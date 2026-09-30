import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'

const testSecret = 'unit-test-only-secret-with-more-than-32-characters'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = testSecret
const { app } = await import('../server.js')
const server = app.listen(0)
let baseUrl

before(() => {
  const { port } = server.address()
  baseUrl = `http://127.0.0.1:${port}`
})

after(() => new Promise((resolve) => server.close(resolve)))

test('health endpoint is public', async () => {
  const response = await fetch(`${baseUrl}/api/health`)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { status: 'ok' })
})

test('admin message inbox requires a token', async () => {
  const response = await fetch(`${baseUrl}/api/contact`)
  assert.equal(response.status, 401)
})

test('non-admin token cannot manage content', async () => {
  const token = jwt.sign({ role: 'visitor' }, testSecret, { subject: 'visitor-1', algorithm: 'HS256' })
  const response = await fetch(`${baseUrl}/api/projects`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: '{}' })
  assert.equal(response.status, 403)
})

test('admin routes validate data before database writes', async () => {
  const token = jwt.sign({ role: 'admin' }, testSecret, { subject: 'admin-1', algorithm: 'HS256' })
  const response = await fetch(`${baseUrl}/api/projects`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: '{}' })
  assert.equal(response.status, 400)
  assert.equal((await response.json()).message, 'Please correct the highlighted fields.')
})

test('contact rejects invalid fields without connecting to MongoDB', async () => {
  const response = await fetch(`${baseUrl}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'A', email: 'bad', subject: '', message: 'short' }) })
  assert.equal(response.status, 400)
})

test('request body rejects Mongo operator keys', async () => {
  const response = await fetch(`${baseUrl}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Ansh', email: 'ansh@example.com', subject: 'Hello', message: 'A valid message body.', '$where': 'true' }) })
  assert.equal(response.status, 400)
  assert.equal((await response.json()).message, 'Invalid request data.')
})

test('request body rejects prototype-related keys', async () => {
  const response = await fetch(`${baseUrl}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"name":"Ansh","email":"ansh@example.com","subject":"Hello","message":"A valid message body.","__proto__":{"polluted":true}}' })
  assert.equal(response.status, 400)
  assert.equal((await response.json()).message, 'Invalid request data.')
})