import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

let isGoogleConfigured = false;

export function initPassport() {
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            const avatar = profile.photos?.[0]?.value;

            // Try find by googleId first, then by email
            let user = await prisma.user.findUnique({
              where: { googleId: profile.id },
            });

            if (!user && email) {
              user = await prisma.user.findUnique({ where: { email } });
            }

            if (!user) {
              // Create new user (no password — OAuth user)
              user = await prisma.user.create({
                data: {
                  name: profile.displayName || 'User',
                  email,
                  googleId: profile.id,
                  avatar,
                },
              });
            } else if (!user.googleId) {
              // Link googleId to existing email-registered user
              user = await prisma.user.update({
                where: { id: user.id },
                data: { googleId: profile.id, avatar: user.avatar || avatar },
              });
            }

            return done(null, user);
          } catch (err) {
            return done(err, null);
          }
        }
      )
    );
    isGoogleConfigured = true;
  } else {
    console.log('[Passport] Google OAuth credentials not found. Skipping GoogleStrategy initialization.');
  }
}

export function isGoogleOAuthReady() {
  return isGoogleConfigured;
}

// Generate JWT for OAuth user and redirect to frontend
export function googleCallback(req, res) {
  const user = req.user;
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/app`);
}
