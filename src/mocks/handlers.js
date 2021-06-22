import { rest } from 'msw'

export const handlers = [
  rest.post('/entry', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
          message: 'entry created',
      })
    )
  }),

  rest.get('/entry', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([])
    )
  })
]
