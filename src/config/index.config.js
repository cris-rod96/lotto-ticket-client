let mode = import.meta.env.MODE

const server =
  mode === 'development'
    ? import.meta.env.VITE_BACKEND_URL_DEV
    : import.meta.env.VITE_BACKEND_URL_PROD

export { server }
