import { Router } from 'express';
import { all, get, run, save } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const depts = all(
    `SELECT d.*, (SELECT COUNT(*) FROM Employee e WHERE e.DepartID = d.DepartID) as EmpCount 
     FROM Department d ORDER BY d.DepartName`
  );
  return res.json(depts);
});

router.post('/', (req, res) => {
  const { DepartName } = req.body;
  if (!DepartName) return res.status(400).json({ error: 'Department name is required.' });
  try {
    run('INSERT INTO Department (DepartName) VALUES (?)', [DepartName]);
    save();
    const inserted = get('SELECT MAX(DepartID) as DepartID FROM Department');
    return res.status(201).json({ DepartID: inserted.DepartID, message: 'Department created.' });
  } catch {
    return res.status(400).json({ error: 'Department name already exists.' });
  }
});

router.put('/:id', (req, res) => {
  const { DepartName } = req.body;
  if (!DepartName) return res.status(400).json({ error: 'Department name is required.' });
  try {
    run('UPDATE Department SET DepartName = ? WHERE DepartID = ?', [DepartName, req.params.id]);
    save();
    return res.json({ message: 'Department updated.' });
  } catch {
    return res.status(400).json({ error: 'Department name already exists.' });
  }
});

router.delete('/:id', (req, res) => {
  run('DELETE FROM Department WHERE DepartID = ?', [req.params.id]);
  save();
  return res.json({ message: 'Department deleted.' });
});

export default router;
