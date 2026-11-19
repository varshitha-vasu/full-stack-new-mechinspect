import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LayoutDashboard, ClipboardCheck, Plus, Search, Bell, Settings, Factory, CheckCircle2, XCircle, Menu, Trash2 } from 'lucide-react';

const seed = [
  { _id:'INSP-1001', component:'Brake Disc', partNo:'BD-204', inspector:'Arun Kumar', line:'Line A', date:'2026-11-18', result:'Pass', defect:'—', remarks:'Within tolerance' },
  { _id:'INSP-1002', component:'Steering Knuckle', partNo:'SK-118', inspector:'Priya S', line:'Line B', date:'2026-11-18', result:'Fail', defect:'Dimensional error', remarks:'Hole diameter out of spec' },
  { _id:'INSP-1003', component:'Crankshaft', partNo:'CS-330', inspector:'Rahul M', line:'Line A', date:'2026-11-17', result:'Pass', defect:'—', remarks:'Surface finish accepted' },
  { _id:'INSP-1004', component:'Gear Assembly', partNo:'GA-091', inspector:'Meena R', line:'Line C', date:'2026-11-17', result:'Fail', defect:'Surface crack', remarks:'Rejected for rework' },
  { _id:'INSP-1005', component:'Oil Pump', partNo:'OP-022', inspector:'Arun Kumar', line:'Line B', date:'2026-11-16', result:'Pass', defect:'—', remarks:'Pressure test passed' }
];
const empty = { component:'', partNo:'', inspector:'', line:'Line A', date:new Date().toISOString().slice(0,10), result:'Pass', defect:'—', remarks:'' };

export default function App() {
  const [records,setRecords] = useState(seed);
  const [page,setPage] = useState('Dashboard');
  const [query,setQuery] = useState('');
  const [filter,setFilter] = useState('All');
  const [showForm,setShowForm] = useState(false);
  const [form,setForm] = useState(empty);
  const [apiStatus,setApiStatus] = useState('Demo data');
  useEffect(() => {
    Promise.all([
      fetch('/api/health').then(r=>r.ok?r.json():Promise.reject()),
      fetch('/api/inspections').then(r=>r.ok?r.json():Promise.reject())
    ]).then(([health,records])=>{
      setApiStatus(health.database==='connected'?'API connected':'Database unavailable');
      if(Array.isArray(records) && records.length) setRecords(records);
    }).catch(()=>{
      setApiStatus('Demo mode');
    });
  }, []);
  const passed = records.filter(x=>x.result==='Pass').length;
  const failed = records.length-passed;
  const rate = records.length ? Math.round(passed/records.length*100) : 0;
  const filtered = useMemo(()=>records.filter(r=>(filter==='All'||r.result===filter) && Object.values(r).join(' ').toLowerCase().includes(query.toLowerCase())),[records,filter,query]);
  const trend = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day,i)=>({day,passed:[8,12,10,15,11,14,9][i],failed:[2,1,3,2,1,2,1][i]}));
  async function addRecord(e) {
    e.preventDefault();
    const record = {...form,_id:`INSP-${Date.now().toString().slice(-6)}`};
    try {
      const response = await fetch('/api/inspections',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      if(response.ok) { const saved=await response.json(); setRecords(prev=>[saved,...prev]); }
      else setRecords(prev=>[record,...prev]);
    } catch { setRecords(prev=>[record,...prev]); }
    setForm(empty); setShowForm(false); setPage('Inspections');
  }
  async function removeRecord(id) {
    try { await fetch(`/api/inspections/${id}`,{method:'DELETE'}); } catch {}
    setRecords(prev=>prev.filter(r=>r._id!==id));
  }
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Factory size={22}/></div><div><b>AutoInspect</b><small>QUALITY CONTROL</small></div></div>
      <div className="nav-label">WORKSPACE</div>
      <button className={`nav-item ${page==='Dashboard'?'active':''}`} onClick={()=>setPage('Dashboard')}><LayoutDashboard size={18}/>Dashboard</button>
      <button className={`nav-item ${page==='Inspections'?'active':''}`} onClick={()=>setPage('Inspections')}><ClipboardCheck size={18}/>Inspections</button>
      <div className="sidebar-bottom"><div className="plant"><span className="online-dot"></span><div><b>Plant 01</b><small>{apiStatus}</small></div></div><button className="nav-item"><Settings size={18}/>Settings</button></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="mobile-brand"><Menu/> AutoInspect</div><div className="crumb">Manufacturing / <b>{page}</b></div><div className="top-actions"><span className="date-label">Thursday, 19 November 2026</span><button className="icon-btn"><Bell size={18}/></button><div className="avatar">QC</div></div></header>
      <section className="content">
        <div className="page-heading"><div><div className="eyebrow">QUALITY MANAGEMENT SYSTEM</div><h1>{page==='Dashboard'?'Inspection Overview':'Inspection Records'}</h1><p>Monitor component quality and production inspection performance.</p></div><button className="primary-btn" onClick={()=>{setForm(empty);setShowForm(true)}}><Plus size={17}/> New Inspection</button></div>
        {page==='Dashboard' ? <>
          <div className="stats-grid">
            <Stat title="Total Inspections" value={records.length.toString()} note="Recorded inspections" icon={<ClipboardCheck/>} tone="blue"/>
            <Stat title="Passed Components" value={passed.toString()} note={`${rate}% pass rate`} icon={<CheckCircle2/>} tone="green"/>
            <Stat title="Failed Components" value={failed.toString()} note="Requires attention" icon={<XCircle/>} tone="red"/>
            <Stat title="Quality Rate" value={`${rate}%`} note="Pass percentage" icon={<Factory/>} tone="purple"/>
          </div>
          <div className="dashboard-grid">
            <div className="panel chart-panel"><div className="panel-head"><div><h3>Inspection Performance</h3><p>Passed vs failed components · weekly sample</p></div><span className="tag">This week</span></div><div className="chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={trend} barGap={6}><XAxis dataKey="day" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="passed" name="Passed" fill="#18a879" radius={[5,5,0,0]}/><Bar dataKey="failed" name="Failed" fill="#ef6b68" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div><div className="legend"><span><i className="green-dot"></i> Passed</span><span><i className="red-dot"></i> Failed</span></div></div>
            <div className="panel"><div className="panel-head"><div><h3>Quality Distribution</h3><p>Current inspection results</p></div></div><div className="pie-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{name:'Passed',value:passed||0.01},{name:'Failed',value:failed||0.01}]} dataKey="value" innerRadius={62} outerRadius={88} paddingAngle={4}><Cell fill="#18a879"/><Cell fill="#ef6b68"/></Pie><Tooltip/></PieChart></ResponsiveContainer><div className="pie-center"><b>{rate}%</b><small>Pass rate</small></div></div><div className="quality-row"><span><i className="green-dot"></i> Passed</span><b>{passed}</b></div><div className="quality-row"><span><i className="red-dot"></i> Failed</span><b>{failed}</b></div></div>
          </div>
          <div className="panel table-panel"><div className="panel-head"><div><h3>Recent Inspections</h3><p>Latest component quality checks</p></div><button className="text-btn" onClick={()=>setPage('Inspections')}>View all →</button></div><InspectionTable rows={records.slice(0,5)} onDelete={removeRecord}/></div>
        </> : <div className="panel table-panel"><div className="toolbar"><div className="searchbox"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search component, part number, inspector..."/></div><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Pass</option><option>Fail</option></select></div><InspectionTable rows={filtered} onDelete={removeRecord}/><div className="table-foot">Showing {filtered.length} of {records.length} records</div></div>}
      </section>
    </main>
    {showForm&&<div className="modal-backdrop" onClick={()=>setShowForm(false)}><form className="modal" onSubmit={addRecord} onClick={e=>e.stopPropagation()}><div className="modal-head"><div><h2>New Inspection</h2><p>Enter component inspection details.</p></div><button type="button" className="close-btn" onClick={()=>setShowForm(false)}>×</button></div><div className="form-grid">
      <Field label="Component name" value={form.component} onChange={v=>setForm({...form,component:v})} required/><Field label="Part number" value={form.partNo} onChange={v=>setForm({...form,partNo:v})} required/><Field label="Inspector" value={form.inspector} onChange={v=>setForm({...form,inspector:v})} required/><label>Production line<select value={form.line} onChange={e=>setForm({...form,line:e.target.value})}><option>Line A</option><option>Line B</option><option>Line C</option></select></label><label>Inspection date<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label><label>Result<select value={form.result} onChange={e=>setForm({...form,result:e.target.value,defect:e.target.value==='Pass'?'—':form.defect})}><option>Pass</option><option>Fail</option></select></label>{form.result==='Fail'&&<Field label="Defect type" value={form.defect==='—'?'':form.defect} onChange={v=>setForm({...form,defect:v})} required/>}<label className="full">Remarks<textarea value={form.remarks} onChange={e=>setForm({...form,remarks:e.target.value})}/></label></div><div className="modal-actions"><button type="button" className="secondary-btn" onClick={()=>setShowForm(false)}>Cancel</button><button className="primary-btn" type="submit"><Plus size={16}/> Save inspection</button></div></form></div>}
  </div>;
}
function Stat({title,value,note,icon,tone}) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-title">{title}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div> }
function Field({label,value,onChange,required}) {return <label>{label}<input value={value} required={required} onChange={e=>onChange(e.target.value)} /></label>}
function InspectionTable({rows,onDelete}) {return <div className="table-scroll"><table><thead><tr><th>INSPECTION ID</th><th>COMPONENT</th><th>PART NUMBER</th><th>INSPECTOR</th><th>DATE</th><th>RESULT</th><th>DEFECT / REMARKS</th><th></th></tr></thead><tbody>{rows.length?rows.map(r=><tr key={r._id}><td className="id-cell">{r._id}</td><td><b>{r.component}</b><small>{r.line}</small></td><td>{r.partNo}</td><td>{r.inspector}</td><td>{r.date}</td><td><span className={`status ${r.result==='Pass'?'pass':'fail'}`}>{r.result}</span></td><td>{r.defect==='—'?r.remarks:r.defect}</td><td><button className="delete-btn" title="Delete record" onClick={()=>onDelete(r._id)}><Trash2 size={15}/></button></td></tr>):<tr><td colSpan="8" className="empty">No inspection records found.</td></tr>}</tbody></table></div>}
