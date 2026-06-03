import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');

  const load = async () => {
    const res = await api.get('/departments');
    setDepartments(res.data);
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setName(''); setEditId(null); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (editId) {
        await api.put(`/departments/${editId}`, { DepartName: name });
      } else {
        await api.post('/departments', { DepartName: name });
      }
      reset();
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Error');
    }
  };

  const handleEdit = (d) => { setName(d.DepartName); setEditId(d.DepartID); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!confirm('Delete this department?')) return;
    await api.delete(`/departments/${id}`);
    load();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Departments</h4>
        <button className="btn btn-primary" onClick={() => { reset(); setShowForm(!showForm); }}>
          {showForm ? 'Cancel' : '+ Add Department'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="input-group">
            <input className="form-control" placeholder="Department name" value={name} onChange={e => setName(e.target.value)} required />
            <button className="btn btn-success" type="submit">{editId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      )}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-dark"><tr><th>#</th><th>Name</th><th>Employees</th><th>Actions</th></tr></thead>
          <tbody>
            {departments.map(d => (
              <tr key={d.DepartID}>
                <td>{d.DepartID}</td><td>{d.DepartName}</td><td>{d.EmpCount}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(d)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(d.DepartID)}>Delete</button>
                </td>
              </tr>
            ))}
            {departments.length === 0 && <tr><td colSpan={4} className="text-center text-muted">No departments</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
