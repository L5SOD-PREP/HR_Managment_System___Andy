import { Router } from 'express';
import { all, get, run, save } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const { search } = req.query;
  let sql = `SELECT e.*, d.DepartName, p.PosName 
    FROM Employee e 
    LEFT JOIN Department d ON e.DepartID = d.DepartID 
    LEFT JOIN Position p ON e.PosID = p.PosID`;
  const params = [];
  if (search) {
    sql += ` WHERE e.EmpFirstName LIKE ? OR e.EmpLastName LIKE ? OR e.EmpEmail LIKE ? OR e.EmpTelephone LIKE ?`;
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }
  sql += ' ORDER BY e.EmpID DESC';
  return res.json(all(sql, params));
});

router.get('/:id', (req, res) => {
  const emp = get(
    `SELECT e.*, d.DepartName, p.PosName 
     FROM Employee e LEFT JOIN Department d ON e.DepartID = d.DepartID 
     LEFT JOIN Position p ON e.PosID = p.PosID WHERE e.EmpID = ?`,
    [req.params.id]
  );
  if (!emp) return res.status(404).json({ error: 'Employee not found.' });
  return res.json(emp);
});

router.post('/', (req, res) => {
  const { EmpFirstName, EmpLastName, EmpGender, EmpDateOfBirth, EmpEmail, EmpTelephone, EmpAddress, EmpHireDate, EmpStatus, DepartID, PosID } = req.body;
  if (!EmpFirstName || !EmpLastName) {
    return res.status(400).json({ error: 'First and last name are required.' });
  }
  const validStatuses = ['On leave', 'Left', 'Blacklisted', 'Deceased', 'On mission'];
  const status = validStatuses.includes(EmpStatus) ? EmpStatus : 'On mission';
  run(
    `INSERT INTO Employee 
     (EmpFirstName, EmpLastName, EmpGender, EmpDateOfBirth, EmpEmail, EmpTelephone, EmpAddress, EmpHireDate, EmpStatus, DepartID, PosID) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [EmpFirstName, EmpLastName, EmpGender || null, EmpDateOfBirth || null,
     EmpEmail || null, EmpTelephone || null, EmpAddress || null,
     EmpHireDate || null, status, DepartID || null, PosID || null]
  );
  save();
  const inserted = get('SELECT MAX(EmpID) as EmpID FROM Employee');
  return res.status(201).json({ EmpID: inserted.EmpID, message: 'Employee created.' });
});

router.put('/:id', (req, res) => {
  const { EmpFirstName, EmpLastName, EmpGender, EmpDateOfBirth, EmpEmail, EmpTelephone, EmpAddress, EmpHireDate, EmpStatus, DepartID, PosID } = req.body;
  const validStatuses = ['On leave', 'Left', 'Blacklisted', 'Deceased', 'On mission'];
  const status = validStatuses.includes(EmpStatus) ? EmpStatus : 'On mission';
  run(
    `UPDATE Employee SET EmpFirstName=?, EmpLastName=?, EmpGender=?, EmpDateOfBirth=?, EmpEmail=?, 
     EmpTelephone=?, EmpAddress=?, EmpHireDate=?, EmpStatus=?, DepartID=?, PosID=? WHERE EmpID=?`,
    [EmpFirstName, EmpLastName, EmpGender, EmpDateOfBirth, EmpEmail,
     EmpTelephone, EmpAddress, EmpHireDate, status, DepartID, PosID, req.params.id]
  );
  save();
  return res.json({ message: 'Employee updated.' });
});

router.delete('/:id', (req, res) => {
  run('DELETE FROM Employee WHERE EmpID = ?', [req.params.id]);
  save();
  return res.json({ message: 'Employee deleted.' });
});

export default router;
