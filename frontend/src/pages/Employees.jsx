import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (q = '') => {
    try {
      const res = await api.get('/employees', { params: q ? { search: q } : {} });
      setEmployees(res.data);
    } catch (err) {
      alert('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(search);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this employee?')) return;
    await api.delete(`/employees/${id}`);
    load(search);
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Employees</h4>
        <Link to="/employees/new" className="btn btn-primary">+ Add Employee</Link>
      </div>
      <form onSubmit={handleSearch} className="mb-3">
        <div className="input-group">
          <input className="form-control" placeholder="Search by name, email or phone..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-outline-secondary" type="submit">Search</button>
          {search && <button className="btn btn-outline-danger" type="button" onClick={() => { setSearch(''); load(); }}>Clear</button>}
        </div>
      </form>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th><th>First Name</th><th>Last Name</th><th>Gender</th><th>Email</th><th>Phone</th><th>Status</th><th>Department</th><th>Position</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(e => (
              <tr key={e.EmpID}>
                <td>{e.EmpID}</td>
                <td>{e.EmpFirstName}</td>
                <td>{e.EmpLastName}</td>
                <td>{e.EmpGender}</td>
                <td>{e.EmpEmail}</td>
                <td>{e.EmpTelephone}</td>
                <td><span className={`badge ${e.EmpStatus === 'On leave' ? 'bg-warning' : e.EmpStatus === 'Left' ? 'bg-danger' : e.EmpStatus === 'Blacklisted' ? 'bg-dark' : e.EmpStatus === 'Deceased' ? 'bg-secondary' : 'bg-success'}`}>{e.EmpStatus}</span></td>
                <td>{e.DepartName}</td>
                <td>{e.PosName}</td>
                <td>
                  <Link to={`/employees/${e.EmpID}`} className="btn btn-sm btn-warning me-1">Edit</Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(e.EmpID)}>Delete</button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && <tr><td colSpan={10} className="text-center text-muted">No employees found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
