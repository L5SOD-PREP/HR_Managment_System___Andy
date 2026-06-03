import { Router } from 'express';
import { all, get, run, save } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const positions = all(
    `SELECT p.*, (SELECT COUNT(*) FROM Employee e WHERE e.PosID = p.PosID) as EmpCount 
     FROM Position p ORDER BY p.PosName`
  );
  return res.json(positions);
});

router.post('/', (req, res) => {
  const { PosName, RequiredQualification } = req.body;
  if (!PosName) return res.status(400).json({ error: 'Position name is required.' });
  run('INSERT INTO Position (PosName, RequiredQualification) VALUES (?, ?)', [PosName, RequiredQualification || null]);
  save();
  const inserted = get('SELECT MAX(PosID) as PosID FROM Position');
  return res.status(201).json({ PosID: inserted.PosID, message: 'Position created.' });
});

router.put('/:id', (req, res) => {
  const { PosName, RequiredQualification } = req.body;
  if (!PosName) return res.status(400).json({ error: 'Position name is required.' });
  run('UPDATE Position SET PosName = ?, RequiredQualification = ? WHERE PosID = ?', [PosName, RequiredQualification || null, req.params.id]);
  save();
  return res.json({ message: 'Position updated.' });
});

router.delete('/:id', (req, res) => {
  run('DELETE FROM Position WHERE PosID = ?', [req.params.id]);
  save();
  return res.json({ message: 'Position deleted.' });
});

export default router;
