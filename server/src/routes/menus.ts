import express from 'express';
import { getDatabase } from '../db/database';
import { upload, processAndSaveImage, deleteImageFile, generateImageFilename } from '../middleware/upload';

const router = express.Router();

// Listar todos os cardápios
router.get('/', async (req, res) => {
  try {
    const db = await getDatabase();
    const menus = await db.all('SELECT * FROM menus');
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar cardápios' });
  }
});

// Obter logo de um cardápio
router.get('/:id/logo', async (req, res) => {
  try {
    const db = await getDatabase();
    const id = Number(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const menu = await db.get('SELECT logo_filename FROM menus WHERE id = ?', id);
    
    if (!menu || !menu.logo_filename) {
      return res.status(404).json({ error: 'Logo não encontrado' });
    }

    // Servir a imagem com cache headers
    res.set('Cache-Control', 'public, max-age=86400');
    res.set('Content-Type', 'image/webp');
    res.sendFile(menu.logo_filename, { root: __dirname + '/../../uploads' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao recuperar logo' });
  }
});

// Criar um novo cardápio com upload de imagem
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const db = await getDatabase();
    const { name, description, active } = req.body;

    // Validar campos obrigatórios
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nome do cardápio é obrigatório' });
    }

    // Inserir cardápio no banco
    const result = await db.run(
      'INSERT INTO menus (name, description, active) VALUES (?, ?, ?)',
      name.trim(),
      description?.trim() || null,
      active === 'true' ? 1 : 0
    );

    const menuId = result.lastID;
    let logoFilename = null;

    // Se arquivo foi enviado, processar e salvar
    if (req.file && menuId) {
      logoFilename = generateImageFilename(menuId);
      await processAndSaveImage(req.file, logoFilename);
      
      // Atualizar cardápio com nome do arquivo
      await db.run(
        'UPDATE menus SET logo_filename = ? WHERE id = ?',
        logoFilename,
        menuId
      );
    }

    // Retornar cardápio criado
    const menu = await db.get('SELECT * FROM menus WHERE id = ?', menuId);
    res.status(201).json(menu);
  } catch (error) {
    console.error('Erro ao criar cardápio:', error);
    res.status(500).json({ error: 'Erro ao criar cardápio' });
  }
});

// Atualizar um cardápio
router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    const db = await getDatabase();
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const { name, description, active } = req.body;

    // Obter cardápio atual
    const currentMenu = await db.get('SELECT * FROM menus WHERE id = ?', id);
    
    if (!currentMenu) {
      return res.status(404).json({ error: 'Cardápio não encontrado' });
    }

    let logoFilename = currentMenu.logo_filename;

    // Se novo arquivo foi enviado, processar e deletar o antigo
    if (req.file) {
      // Deletar imagem antiga
      if (currentMenu.logo_filename) {
        deleteImageFile(currentMenu.logo_filename);
      }

      // Gerar e salvar novo arquivo
      logoFilename = generateImageFilename(id);
      await processAndSaveImage(req.file, logoFilename);
    }

    // Atualizar cardápio
    await db.run(
      'UPDATE menus SET name = ?, description = ?, active = ?, logo_filename = ? WHERE id = ?',
      name || currentMenu.name,
      description !== undefined ? (description?.trim() || null) : currentMenu.description,
      active !== undefined ? (active === 'true' ? 1 : 0) : currentMenu.active,
      logoFilename,
      id
    );

    const updatedMenu = await db.get('SELECT * FROM menus WHERE id = ?', id);
    res.status(200).json(updatedMenu);
  } catch (error) {
    console.error('Erro ao atualizar cardápio:', error);
    res.status(500).json({ error: 'Erro ao atualizar cardápio' });
  }
});

// Deletar um cardápio
router.delete('/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // Obter cardápio para deletar imagem
    const menu = await db.get('SELECT logo_filename FROM menus WHERE id = ?', id);
    
    if (menu && menu.logo_filename) {
      deleteImageFile(menu.logo_filename);
    }

    await db.run('DELETE FROM menus WHERE id = ?', id);
    res.status(200).json({ message: 'Cardápio deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar cardápio:', error);
    res.status(500).json({ error: 'Erro ao deletar cardápio' });
  }
});

export default router;