import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError, NotFoundError } from '../../../core/errors/AppError';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('❌ Erro:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
      isOperational: err.isOperational,
    });
    return;
  }

  // Erro não esperado
  res.status(500).json({
    message: 'Erro interno do servidor',
    statusCode: 500,
  });
}