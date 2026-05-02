import { Router } from 'express';
import passport from 'passport';
import { register, logout, getMe } from '../controllers/authController';
import { validate } from '../middlewares/validationMiddleware';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { registerSchema } from '../schemas/authSchema';

const router = Router();

// --- AUTH MANUAL (DENGAN VALIDASI) ---

// Pakai middleware validate sebelum masuk ke controller register
router.post('/register', validate(registerSchema), register);

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Login Berhasil', user: req.user });
});

// --- AUTH GOOGLE ---

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-failed',
    session: true,
  }),
  (req, res) => {
    // Arahkan ke dashboard frontend
    res.redirect('http://localhost:3000/dashboard');
  },
);

// --- AUTH GITHUB ---

// Jalur buat user ngeklik "Login with GitHub"
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
);

// Jalur balik dari GitHub ke server kita
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Berhasil! Lempar ke dashboard frontend
    res.redirect('http://localhost:3000/dashboard');
  },
);

// --- PROFILE & LOGOUT (DENGAN PROTEKSI) ---

// Gunakan isAuthenticated agar hanya user yang sudah login bisa akses /me
router.get('/me', isAuthenticated, getMe);

router.get('/logout', (req, res, next) => {
  // Fungsi logout bawaan dari Passport
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    // Hapus session di server
    req.session.destroy((err) => {
      if (err) return next(err);

      // Hapus cookie di browser
      res.clearCookie('connect.sid'); // Nama default cookie express-session

      res.status(200).json({ message: 'Berhasil logout' });
    });
  });
});

// Rute test untuk memastikan router ini aktif
router.get('/test-aja', (req, res) => {
  res.send('Rute Auth Aktif!');
});

export default router;
