import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function Home() {
  return (
    <div className="center card">
      <h1>IndiGo-Style Staff Travel Portal</h1>
      <p>Book flights for employees and nominees with secure company login.</p>
      <div className="row">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn ghost">Register</Link>
      </div>
    </div>
  );
}

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch (err) { setError(err.message); }
  }

  return <AuthForm title="Login" form={form} setForm={setForm} submit={submit} error={error} />;
}

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) setError(data.error || 'Registration failed');
    else navigate('/login');
  }

  return <AuthForm title="Register" form={form} setForm={setForm} submit={submit} error={error} />;
}

function AuthForm({ title, form, setForm, submit, error }) {
  return (
    <form className="card center" onSubmit={submit}>
      <h2>{title}</h2>
      {'name' in form && <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />}
      <input placeholder="Official Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error && <p className="error">{error}</p>}
      <button className="btn">{title}</button>
    </form>
  );
}

function Dashboard() {
  const { authFetch } = useAuth();
  const [airports, setAirports] = useState([]);
  const [search, setSearch] = useState({ from: 'DEL', to: 'BLR', date: '' });
  const navigate = useNavigate();

  useEffect(() => { authFetch('/api/flights/airports').then((r) => r.json()).then(setAirports); }, [authFetch]);

  const go = () => navigate(`/results?from=${search.from}&to=${search.to}&date=${search.date}`);

  return <div className="card"><h2>Search Flights</h2><div className="grid3">
      <select onChange={(e) => setSearch({ ...search, from: e.target.value })}>{airports.map((a) => <option key={a.code}>{a.code}</option>)}</select>
      <select onChange={(e) => setSearch({ ...search, to: e.target.value })}>{airports.map((a) => <option key={a.code}>{a.code}</option>)}</select>
      <input type="date" onChange={(e) => setSearch({ ...search, date: e.target.value })} />
    </div><button className="btn" onClick={go}>Find Flights</button></div>;
}

function Placeholder({ title, text }) { return <div className="card"><h2>{title}</h2><p>{text}</p></div>; }

function Results() { return <Placeholder title="Flight Results" text="Mock result flow connected to backend search API." />; }
function Payment() { return <Placeholder title="Payment" text="Simulated payment page for devops practice." />; }
function Confirmation() { return <Placeholder title="Confirmation" text="PNR confirmation after booking." />; }
function About() { return <Placeholder title="About" text="Internal staff travel portal built with React + Express + PostgreSQL." />; }

function Helpline() {
  const { authFetch } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const send = async () => {
    const res = await authFetch('/api/support', { method: 'POST', body: JSON.stringify({ subject, message }) });
    setStatus(res.ok ? 'Query submitted.' : 'Failed to submit.');
  };
  return <div className="card"><h2>Helpline</h2><input placeholder="Subject" onChange={(e)=>setSubject(e.target.value)} /><textarea placeholder="Message" onChange={(e)=>setMessage(e.target.value)} /><button className="btn" onClick={send}>Submit</button><p>{status}</p></div>;
}

function Nominees() { return <Placeholder title="Nominees" text="Add/manage nominees via API endpoint /api/nominees." />; }
function Bookings() { return <Placeholder title="Bookings" text="Booking history + downloadable ticket PDF is available in backend routes." />; }

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/results" element={<Results />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/nominees" element={<Nominees />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/helpline" element={<Helpline />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={<ProtectedRoute><AppRoutes /></ProtectedRoute>} />
    </Routes>
  );
}
