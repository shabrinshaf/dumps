import express from 'express';
import session from 'express-session';
import passport from 'passport';
import './config/passport'; // Load konfigurasi passport
import authRoutes from './routes/authRoute';

const app = express();

app.use(express.json());
app.use(
  session({
    secret: 'rahasia-negara',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// Gunakan Routes
app.use('/api/auth', authRoutes);

// eslint-disable-next-line no-console
app.listen(3000, () => console.log('Server jalan di port 3000'));
