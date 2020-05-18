const { REACT_APP_API_URL } = process.env

const config = { REACT_APP_API_URL }

Object.entries(config).forEach(([key, value]) => {
  if (!value && value !== false) {
    throw new Error(`process.env.${key} required`)
  }
})

exports.REACT_APP_API_URL = REACT_APP_API_URL
