import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

// Diretório para armazenar uploads
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Garantir que o diretório existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configurar storage do multer
const storage: StorageEngine = multer.memoryStorage();

// Filtro para aceitar apenas imagens
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens JPEG, PNG e WebP são permitidas'));
  }
};

// Criar instância do multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Função para processar e salvar imagem otimizada
export async function processAndSaveImage(
  file: Express.Multer.File,
  filename: string
): Promise<string> {
  if (!file || !file.buffer) {
    throw new Error('Arquivo não fornecido');
  }

  const filepath = path.join(UPLOAD_DIR, filename);

  // Processar e otimizar imagem com sharp
  await sharp(file.buffer)
    .resize(800, 800, {
      fit: 'cover',
      position: 'center',
    })
    .webp({ quality: 80 })
    .toFile(filepath);

  return filepath;
}

// Função para deletar arquivo
export function deleteImageFile(filename: string): void {
  if (!filename) return;

  const filepath = path.join(UPLOAD_DIR, filename);
  
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
}

// Gerar nome único para arquivo
export function generateImageFilename(menuId: number): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `menu_${menuId}_${timestamp}_${random}.webp`;
}

export const UPLOAD_DIR_PATH = UPLOAD_DIR;
