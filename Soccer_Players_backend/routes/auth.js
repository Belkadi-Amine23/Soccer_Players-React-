import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';
import crypto from 'crypto';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';

const router = express.Router();
const csrfProtection = csurf({ cookie: true });
router.use(cookieParser());

// Register
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hashedPassword });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', csrfProtection, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    user.refreshTokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
    await user.save();

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CSRF Token
router.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Refresh Token
router.post('/refresh-token', csrfProtection, async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No token provided" });

    const user = await User.findOne({ refreshToken, refreshTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(401).json({ message: "Invalid token" });

    const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    user.refreshToken = newRefreshToken;
    await user.save();

    const newAccessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Email verification
router.post('/send-verification', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    if (user.isVerified) return res.status(400).json({ message: "Already verified" });

    const token = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = token;
    user.emailVerificationExpires = Date.now() + 3600000;
    await user.save();

    // sendVerificationEmail(user.email, token); // Ajoute ta fonction d'envoi ici
    res.json({ message: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/verify-email/:token', async (req, res) => {
  try {
    const user = await User.findOne({ emailVerificationToken: req.params.token, emailVerificationExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout
router.post('/logout', csrfProtection, (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: "Logged out successfully" });
});

// Protected route example
router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

// Endpoint pour vérifier la session utilisateur
router.get('/user', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

export default router;