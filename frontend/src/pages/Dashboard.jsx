import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState({ employees: 0, departments: 0, positions: 0, users: 0 });
  const [statusCounts, setStatusCounts] = useState([]);
  const [deptCounts, setDeptCounts] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/employees'),
      api.get('/departments'),
      api.get('/positions'),
      api.get('/users'),
      api.get('/reports/employee-count-by-status'),
      api.get('/reports/employee-count-by-department')
    ]).then(([emp, dept, pos, users, status, deptCnt]) => {
      setStats({
        employees: emp.data.length,
        departments: dept.data.length,
        positions: pos.data.length,
        users: users.data.length
      });
      setStatusCounts(status.data);
      setDeptCounts(deptCnt.data);
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h4 className="mb-4">Dashboard</h4>
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card text-bg-primary">
            <div className="card-body">
              <h5 className="card-title">{stats.employees}</h5>
              <p className="card-text">Total Employees</p>
              <Link to="/employees" className="text-white">View details &rarr;</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-bg-success">
            <div className="card-body">
              <h5 className="card-title">{stats.departments}</h5>
              <p className="card-text">Departments</p>
              <Link to="/departments" className="text-white">View details &rarr;</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-bg-warning">
            <div className="card-body">
              <h5 className="card-title">{stats.positions}</h5>
              <p className="card-text">Positions</p>
              <Link to="/positions" className="text-white">View details &rarr;</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-bg-info">
            <div className="card-body">
              <h5 className="card-title">{stats.users}</h5>
              <p className="card-text">System Users</p>
              <Link to="/users" className="text-white">View details &rarr;</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Employees by Status</div>
            <div className="card-body">
              <table className="table table-sm mb-0">
                <thead><tr><th>Status</th><th>Count</th></tr></thead>
                <tbody>
                  {statusCounts.map(s => (
                    <tr key={s.EmpStatus}><td>{s.EmpStatus}</td><td>{s.count}</td></tr>
                  ))}
                  {statusCounts.length === 0 && <tr><td colSpan={2} className="text-muted">No data</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Employees by Department</div>
            <div className="card-body">
              <table className="table table-sm mb-0">
                <thead><tr><th>Department</th><th>Count</th></tr></thead>
                <tbody>
                  {deptCounts.map(d => (
                    <tr key={d.DepartName}><td>{d.DepartName}</td><td>{d.count}</td></tr>
                  ))}
                  {deptCounts.length === 0 && <tr><td colSpan={2} className="text-muted">No data</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
