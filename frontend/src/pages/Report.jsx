import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Report() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/employees-on-leave').then(res => {
      setReport(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Employee Status Report - On Leave</h4>
        <button className="btn btn-secondary" onClick={() => window.print()}>Print Report</button>
      </div>

      <div className="alert alert-info">
        <strong>Total employees on leave: {report?.total || 0}</strong>
      </div>

      {report && Object.keys(report.departments).length === 0 && (
        <div className="alert alert-warning">No employees are currently on leave.</div>
      )}

      {report && Object.entries(report.departments).map(([dept, employees]) => (
        <div className="card mb-3" key={dept}>
          <div className="card-header fw-bold">{dept} ({employees.length})</div>
          <div className="card-body p-0">
            <table className="table table-striped mb-0">
              <thead>
                <tr>
                  <th>#</th><th>First Name</th><th>Last Name</th><th>Gender</th><th>Email</th><th>Phone</th><th>Position</th>
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
                    <td>{e.PosName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
