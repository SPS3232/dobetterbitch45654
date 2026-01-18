import jwt from 'jsonwebtoken';

const secret = process.env.AUTH_SECRET;

export function signToken(payload) {
  if (!secret) {
    throw new Error('AUTH_SECRET is not set');
  }
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyToken(token) {
  if (!secret) {
    return null;
  }
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}
