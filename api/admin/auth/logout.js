import { setCorsHeaders } from '../../utils/cors.js'

export default async function handler(req, res) {
  if (setCorsHeaders(req, res)) return

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  })
}
