import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
})

type ApiResponse<T> = {
  status: 'ok' | 'error'
  data?: T
  message?: string
}

// Generic fetcher for API requests
export async function fetcher<T>(url: string): Promise<T> {
  const response = await http.get<ApiResponse<T>>(url)
  
  if (response.data?.status !== 'ok') {
    throw new Error(response.data?.message || 'Request failed')
  }
  
  return response.data.data as T
}
