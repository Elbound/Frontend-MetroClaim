import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/error')({
  validateSearch: (search) => ({
    status: Number(search?.status) || 500,
    msg: String(search?.msg || 'An error occurred'),
  }),
})

