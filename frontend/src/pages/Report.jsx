import { useState, useEffect } from 'react';
import api from '../api';
import { FileText, Printer, Users, Clock } from 'lucide-react';

export default function Report() {
  const [report, setReport] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.get('/reports/employees-on-leave').then(r => {
      const data = r.data?.departments || {};
      setReport(Object.keys(data).map(name => ({ DepartName: name, employees: data[name] })));
      setTotal(r.data?.total || 0);
    }).catch(() => {});
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 style={{margin:0,fontWeight:600}}>Employees on Leave Report</h5>
          <p className="text-muted small mb-0 mt-1">
            <Clock size={13} style={{verticalAlign:'middle',marginRight:'0.25rem'}} />
            {total} employee{total !== 1 ? 's' : ''} currently on leave
          </p>
        </div>
        <button className="btn" style={{background:'#3b82f6',color:'#fff',borderRadius:'0.5rem',fontWeight:500,fontSize:'0.9rem',padding:'0.5rem 1rem',display:'flex',alignItems:'center',gap:'0.4rem'}} onClick={() => window.print()}>
          <Printer size={16} /> Print
        </button>
      </div>

      {report.length === 0 ? (
        <div className="card-dash p-4 text-center text-muted">
          <FileText size={32} style={{marginBottom:'0.5rem',opacity:0.3}} />
          <p className="mb-0">No employees currently on leave.</p>
        </div>
      ) : (
        <>
          <div className="card-dash p-3 mb-3 d-flex align-items-center gap-2" style={{borderLeft:'4px solid #f59e0b'}}>
            <Users size={18} style={{color:'#f59e0b'}} />
            <span style={{fontWeight:600}}>Total on leave:</span>
            <span style={{fontWeight:700,fontSize:'1.2rem',color:'#f59e0b'}}>{total}</span>
            <span className="text-muted small">employee{total !== 1 ? 's' : ''} across {report.length} department{report.length !== 1 ? 's' : ''}</span>
          </div>

          {report.map((dept) => (
            <div key={dept.DepartName} className="card-dash mb-3" style={{overflow:'hidden'}}>
              <div className="px-3 py-2" style={{background:'#fff',borderBottom:'1px solid #e2e8f0',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                <Users size={16} style={{color:'#3b82f6'}} />
                <span style={{fontWeight:600}}>{dept.DepartName}</span>
                <span className="badge" style={{background:'#dbeafe',color:'#2563eb',marginLeft:'auto'}}>{dept.employees?.length || 0} on leave</span>
              </div>
              <table className="table table-dash">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dept.employees.map((emp, i) => (
                    <tr key={emp.EmpID}>
                      <td className="text-muted">{i + 1}</td>
                      <td style={{fontWeight:500}}>{emp.EmpFirstName} {emp.EmpLastName}</td>
                      <td>{emp.PosName || '-'}</td>
                      <td>{emp.EmpEmail}</td>
                      <td><span className="badge-status" style={{background:'#fef3c7',color:'#92400e'}}>{emp.EmpStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}
    </>
  );
}
