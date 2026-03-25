import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="shell">
      <aside className="sidebar">
        <h2>✈ Staff Travel</h2>
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/results">Flight Results</NavLink>
          <NavLink to="/bookings">Bookings</NavLink>
          <NavLink to="/nominees">Nominees</NavLink>
          <NavLink to="/payment">Payment</NavLink>
          <NavLink to="/confirmation">Confirmation</NavLink>
          <NavLink to="/helpline">Helpline</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <div className="user-card">
          <p>{user?.name}</p>
          <small>{user?.email}</small>
          <button onClick={logout}>Logout</button>
          <Link to="/">Go Home</Link>
        </div>
      </aside>
      <main>{children}</main>
    </div>
  );
}
