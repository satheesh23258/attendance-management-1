import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export const generateOtp = (length = 6) => {
  const digits = '0123456789'
  let otp = ''
  for (let i = 0; i < length; i++) otp += digits[Math.floor(Math.random() * digits.length)]
  return otp
}

export const hashOtp = async (otp) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(otp, salt)
}

export const verifyOtpHash = async (otp, hash) => {
  return bcrypt.compare(otp, hash)
}

export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex')
}
