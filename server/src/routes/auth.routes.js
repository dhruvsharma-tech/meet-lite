import { Router } from 'express';
import { body } from 'express-validator';
import passport from 'passport';
import { register, login, logout, getMe } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { googleCallback, isGoogleOAuthReady } from '../config/passport.js';

const router = Router();

// ─── Validation rules ─────────────────────────────────────────────────────────

const registerRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

// ─── Routes ───────────────────────────────────────────────────────────────────

// Email / password auth
router.post('/register', registerRules, register);
router.post('/login', loginRules, login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);

// Google OAuth
router.get('/google', (req, res, next) => {
  if (!isGoogleOAuthReady()) {
    return res.status(503).json({ error: 'Google OAuth is not configured on this server.' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

router.get(
  '/google/callback',
  (req, res, next) => {
    if (!isGoogleOAuthReady()) {
      return res.status(503).json({ error: 'Google OAuth is not configured on this server.' });
    }
    passport.authenticate('google', { session: false, failureRedirect: '/login' })(req, res, next);
  },
  googleCallback
);

export default router;
