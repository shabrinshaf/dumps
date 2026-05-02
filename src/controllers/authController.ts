import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/db';
import { users } from '../db/schema';

export const register = async (req: Request, res: Response) => {
  // Data req.body sudah divalidasi oleh middleware sebelum masuk ke sini
  const { name, email, password } = req.body;

  try {
    // 1. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Simpan ke database
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User berhasil terdaftar' });
  } catch (error) {
    console.error(error);
    // email duplikat atau database error
    res.status(400).json({
      message: 'Email sudah digunakan atau terjadi kesalahan server',
    });
  }
};

export const getMe = (req: Request, res: Response) => {
  // pengecekan login di authMiddleware
  res.json(req.user);
};

export const logout = (req: Request, res: Response) => {
  // 1. Beritahu Passport untuk menghapus user dari object request
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Gagal logout dari Passport' });
    }

    // 2. Hancurkan data session yang tersimpan di server/database
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Gagal menghapus session' });
      }

      // 3. Hapus kartu akses (cookie) yang dipegang oleh browser user
      res.clearCookie('connect.sid');

      // 4. Kirim respon sukses
      res.status(200).json({ message: 'Berhasil logout' });
    });
  });
};
