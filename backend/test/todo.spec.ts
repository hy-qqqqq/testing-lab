import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { serverOf } from '../src/server'
import * as TodoRepo from '../src/repo/todo'
import { Todo } from '../src/types/todo'

describe('Todo API Testing', () => {
  const server = serverOf()

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('GET /api/v1/todos', () => {
    test('Given an empty array return from findAllTodos function, then it should response an empty array', async () => {
      // arrange: stub the repo function to return an empty array
      vi.spyOn(TodoRepo, 'findAllTodos').mockImplementation(async () => [])
  
      // act: send a GET request to /api/v1/todos
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/todos'
      })
  
      // assert: response should be an empty array
      const todos = JSON.parse(response.body)['todos']
      expect(todos).toStrictEqual([])
    })

    test('Given an error from findAllTodos function, then it should return the error message', async () => {
      // arrange: stub the repo function to reject
      const err_msg = 'Async error: findAllTodos'
      vi.spyOn(TodoRepo, 'findAllTodos').mockRejectedValue(new Error(err_msg))
  
      // act: send a GET request to /api/v1/todos
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/todos'
      })
  
      // assert: response should contain error message
      expect(response.body).toContain(err_msg)
    })
  })

  describe('PUT /api/v1/todos:id', () => {
    const id = '0'
    const payload = {
      status: true
    }
    const acc_todo: Todo = {
      id: id,
      name: 'test',
      description: '',
      status: true
    }

    test('Given a todo return from updateTodoById function, then it should response the todo object', async () => {
      // arrange: stub the repo function to return
      vi.spyOn(TodoRepo, 'updateTodoById').mockImplementation(async (id, { status: newStatus }) => acc_todo)

      // act: send a PUT request to /api/v1/todos:id
      const response = await server.inject({
        method: 'PUT',
        url: '/api/v1/todos/' + id,
        payload: payload
      })

      // assert: response should be the todo object
      expect(response.statusCode).toBe(200)
      const todo = JSON.parse(response.body)['todo']
      expect(todo).toStrictEqual(acc_todo)
    })

    test('Given a null return from updateTodoById function, then it should response the not found message', async () => {
      // arrange: stub the repo function to return
      vi.spyOn(TodoRepo, 'updateTodoById').mockImplementation(async (id, { status: newStatus }) => null)

      // act: send a PUT request to /api/v1/todos:id
      const response = await server.inject({
        method: 'PUT',
        url: '/api/v1/todos/' + id,
        payload: payload
      })

      // assert: response should contain not found message
      expect(response.statusCode).toBe(404)
      const msg = JSON.parse(response.body)['msg']
      expect(msg).toContain('Not Found Todo:' + id)
    })

    test('Given an error from updateTodoById function, then it should return the error message', async () => {
      // arrange: stub the repo function to return
      const err_msg = 'Async error: updateTodoById'
      vi.spyOn(TodoRepo, 'updateTodoById').mockRejectedValue(new Error(err_msg))

      // act: send a PUT request to /api/v1/todos:id
      const response = await server.inject({
        method: 'PUT',
        url: '/api/v1/todos/' + id,
        payload: payload
      })

      // assert: response should contain error message
      expect(response.statusCode).toBe(500)
      expect(response.body).toContain(err_msg)
    })
  })
})
