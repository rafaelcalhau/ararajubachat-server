import request from 'supertest'

import app from '../../src/app'
import User from '../../src/models/User'
import userData from '../data/user.json'

describe('Users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  it('should access public route and create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(userData)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('username')
    expect(response.body.username).toBe(userData.username)
  })

  it('should NOT list users without an authorization token', async () => {
    await User.create(userData)

    const response = await request(app)
      .get('/api/users')

    expect(response.status).toBe(401)
  })

  it('should list users using an authorization token', async () => {
    const user = await User.create(userData)
    const token = await user.generateToken()

    const response = await request(app)
      .get('/api/users')
      .set('authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body.length).toBe(1)
  })

  it('should NOT update an user without an authorization token', async () => {
    const user = await User.create(userData)

    expect(user._id).toBeTruthy()

    await request(app)
      .put(`/api/users/${user._id}`)
      .send({ lastname: 'Calhau P. dos Santos' })
      .expect(401)
  })

  it('should update an user using an authorization token', async () => {
    const user = await User.create(userData)
    const token = await user.generateToken()

    const response = await request(app)
      .put(`/api/users/${user._id}`)
      .set('authorization', `Bearer ${token}`)
      .send({ lastname: 'Santos' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('ok')
    expect(response.body.ok).toBe(1)
  })

  it('should NOT delete an user without an authorization token', async () => {
    const user = await User.create(userData)

    expect(user._id).toBeTruthy()

    await request(app)
      .delete(`/api/users/${user._id}`)
      .expect(401)
  })

  it('should delete an user using an authorization token', async () => {
    const user = await User.create(userData)
    const token = await user.generateToken()

    const response = await request(app)
      .delete(`/api/users/${user._id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body).toHaveProperty('deleted')
    expect(response.body.deleted.ok).toBe(1)
  })

  it('should NOT authenticate with invalid credentials', async () => {
    await User.create(userData)
    const credentials = {
      username: userData.username,
      password: userData.password
    }

    await request(app)
      .post('/api/authenticate')
      .send({ ...credentials, username: 'invalid' })
      .then(response => {
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('message')
      })

    await request(app)
      .post('/api/authenticate')
      .send({ ...credentials, password: 'invalid' })
      .then(response => {
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('message')
      })

    await request(app)
      .post('/api/authenticate')
      .send({ username: 'invalid', password: 'invalid' })
      .then(response => {
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('message')
      })
  })

  it('should authenticate with valid credentials', async () => {
    await User.create(userData)
    const credentials = {
      username: userData.username,
      password: userData.password
    }

    await request(app)
      .post('/api/authenticate')
      .send(credentials)
      .then(response => {
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('token')
      })
  })

  it('should authenticate user using a valid username and authorization token', async () => {
    const user = await User.create(userData)
    const data = {
      username: userData.username,
      token: await user.generateToken()
    }

    await request(app)
      .post('/api/authenticate-token')
      .send(data)
      .then(response => {
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('message')
        expect(response.body.name).toBe('Authorized')
      })
  })

  it('should be possible verify an username availability', async () => {
    await User.create(userData)
    await request(app)
      .get(`/api/users/username/${userData.username}`)
      .then(response => {
        expect(response.body).toHaveProperty('valid')
        expect(response.body.valid).toBeFalsy()
      })
    await request(app)
      .get('/api/users/username/unsedUsername')
      .then(response => {
        expect(response.body).toHaveProperty('valid')
        expect(response.body.valid).toBeTruthy()
      })
  })
})
