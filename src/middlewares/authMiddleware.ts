import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    return next(); // Sudah login, silakan lewat!
  }
  res.status(401).json({ message: 'Kamu harus login terlebih dahulu' });
};
