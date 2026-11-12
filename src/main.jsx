import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FilePlus2,
  History,
  Home,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import DoctorsPage from './components/DoctorsPage';
import HistoryPage from './components/HistoryPage';
import InquiryForm from './components/InquiryForm';
import Login from './components/Login';
import SettingsPage from './components/SettingsPage';
import { STORE, readData } from './utils/dental';
import './styles.css';

function App() {
  const [data, setData] = useState(readData);
  const [logged, setLogged] = useState(false);
  const [page, setPage] = useState('dashboard');
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem(STORE, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const notify = (m) => setToast(m);

  const navigate = (nextPage) => {
    setPage(nextPage);
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const saveInquiry = (item) => {
    setData((d) => ({
      ...d,
      inquiries: [item, ...d.inquiries],
      nextNo: Math.max(d.nextNo, item.number + 1),
    }));
    navigate('history');
    notify('Inquiry saved successfully');
  };

  const updateInquiry = (item) => {
    setData((d) => ({
      ...d,
      inquiries: d.inquiries.map((x) => (x.id === item.id ? item : x)),
    }));
    setEditing(null);
    navigate('history');
    notify('Inquiry updated');
  };

  const removeInquiry = (id) => {
    if (confirm('Delete this inquiry permanently?')) {
      setData((d) => ({
        ...d,
        inquiries: d.inquiries.filter((x) => x.id !== id),
      }));
      notify('Inquiry deleted');
    }
  };

  if (!logged) {
    return <Login onLogin={() => setLogged(true)} />;
  }

  const nav = [
    ['dashboard', 'Overview', Home],
    ['new', 'New inquiry', FilePlus2],
    ['history', 'Inquiry history', History],
    ['doctors', 'Doctors', Users],
    ['settings', 'Settings', Settings],
  ];

  const activeLabel =
    page === 'new' && editing
      ? 'Edit inquiry'
      : nav.find((x) => x[0] === page)?.[1] || 'New inquiry';

  return (
    <div className="app-shell">
      <aside
        className={`sidebar ${mobileNav ? 'open' : ''}`}
        aria-label="Workspace navigation"
      >
        <div className="brand">
          <div className="brand-mark">
            <Stethoscope size={22} />
          </div>
          <div>
            <b>SHITAL</b>
            <span>DENTAL SERVICES</span>
          </div>
          <button
            type="button"
            className="close-nav"
            aria-label="Close navigation menu"
            onClick={() => setMobileNav(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="side-label">WORKSPACE</div>
        <nav>
          {nav.map(([id, label, Icon]) => (
            <button
              type="button"
              key={id}
              className={`nav-item ${page === id ? 'active' : ''}`}
              onClick={() => {
                setEditing(null);
                navigate(id);
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
              {id === 'history' && data.inquiries.length > 0 && (
                <small>{data.inquiries.length}</small>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="secure-note">
            <ShieldCheck size={17} />
            <div>
              <b>Private workspace</b>
              <span>Saved on this device</span>
            </div>
          </div>
          <button
            type="button"
            className="nav-item logout"
            onClick={() => setLogged(false)}
          >
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {mobileNav && (
        <div
          className="scrim"
          aria-hidden="true"
          onClick={() => setMobileNav(false)}
        />
      )}

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu icon-btn"
              aria-label="Open navigation menu"
              onClick={() => setMobileNav(true)}
            >
              <Menu size={20} />
            </button>
            <div className="crumb">
              <span className="crumb-root">Workspace</span>
              <ChevronRight size={14} className="crumb-sep" />
              <b>{activeLabel}</b>
            </div>
          </div>

          <div className="top-actions">
            <span className="today-label">
              <CalendarDays size={15} />
              <span>
                {new Date().toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </span>
            <div className="avatar" title="Shital Dental Admin">
              SA
            </div>
          </div>
        </header>

        <div className="content page-enter" key={`${page}-${editing?.id || 'base'}`}>
          {page === 'dashboard' && (
            <Dashboard
              data={data}
              setPage={navigate}
              setEditing={setEditing}
            />
          )}
          {page === 'new' && (
            <InquiryForm
              data={data}
              onSave={editing ? updateInquiry : saveInquiry}
              notify={notify}
              initial={editing}
              onBack={() => {
                setEditing(null);
                navigate('dashboard');
              }}
            />
          )}
          {page === 'history' && (
            <HistoryPage
              data={data}
              search={search}
              setSearch={setSearch}
              filter={filter}
              setFilter={setFilter}
              onNew={() => {
                setEditing(null);
                navigate('new');
              }}
              onEdit={(x) => {
                setEditing(x);
                navigate('new');
              }}
              onDelete={removeInquiry}
              notify={notify}
            />
          )}
          {page === 'doctors' && (
            <DoctorsPage data={data} setData={setData} notify={notify} />
          )}
          {page === 'settings' && (
            <SettingsPage data={data} setData={setData} notify={notify} />
          )}
        </div>

        <footer>
          © {new Date().getFullYear()} Shital Dental Services <span>•</span>{' '}
          Digital Lab Desk
        </footer>
      </main>

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
