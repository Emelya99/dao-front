import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID
if (!projectId) {
  throw new Error('VITE_REOWN_PROJECT_ID is required')
}

export const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: window.location.origin,
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

