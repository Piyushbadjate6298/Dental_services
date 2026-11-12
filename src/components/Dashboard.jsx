import React from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FilePlus2,
  FileText,
  History,
  Plus,
  Send,
  Settings,
  Sparkles,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';
import { money, today } from '../utils/dental';
import {
  EmptyState,
  PageHeading,
  QuickAction,
  Stat,
  StatusBadge,
} from './Common';

export default function Dashboard({ data, setPage, setEditing }) {
  const list = data.inquiries;
  const todayCount = list.filter((x) => x.date === today()).length;
  const sent = list.filter((x) => x.status === 'Sent').length;
  const patientCount = new Set(
    list.map((x) => (x.patient || '').trim().toLowerCase()).filter(Boolean)
  ).size;
  const recent = list.slice(0, 5);
  const total = list.reduce((a, x) => a + Number(x.total || 0), 0);

  return (
    <>
      <PageHeading
        eyebrow="YOUR WORKSPACE"
        title="Good day, Admin"
        sub="Here's what's happening with your dental lab inquiries today."
        action={
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              setEditing(null);
              setPage('new');
            }}
          >
            <Plus size={18} /> Create inquiry
          </button>
        }
      />

      <div className="welcome-strip">
        <div className="welcome-icon">
          <Sparkles size={21} />
        </div>
        <div className="welcome-copy">
          <b>Your lab desk, made simpler.</b>
          <span>
            Create a patient inquiry, prepare a digital bill and share it with
            your lab on WhatsApp.
          </span>
        </div>
        <button
          type="button"
          className="welcome-cta"
          onClick={() => {
            setEditing(null);
            setPage('new');
          }}
        >
          <span>Start now</span> <ArrowRight size={15} />
        </button>
      </div>

      <div className="stat-grid">
        <Stat
          icon={ClipboardList}
          label="Total inquiries"
          value={list.length}
          note="All recorded patients"
        />
        <Stat
          icon={CalendarDays}
          label="Today's inquiries"
          value={todayCount}
          note="Created today"
        />
        <Stat
          icon={UserCheck}
          label="Total patients"
          value={patientCount}
          note="Unique patient names"
        />
        <Stat
          icon={Send}
          label="Sent to lab"
          value={sent}
          note="WhatsApp shared"
        />
        <div className="stat-card stat-wide">
          <div className="stat-top">
            <span>Total bill value</span>
            <div className="stat-icon">
              <Wallet size={18} />
            </div>
          </div>
          <strong>{money(total)}</strong>
          <small>Across all inquiries</small>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel recent-panel">
          <div className="panel-head">
            <div>
              <h3>Recent inquiries</h3>
              <p>Your latest patient records</p>
            </div>
            <button
              type="button"
              className="text-btn"
              onClick={() => setPage('history')}
            >
              View all <ArrowRight size={15} />
            </button>
          </div>

          {recent.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No inquiries yet"
              text="Your patient inquiries will appear here once you create one."
              action={
                <button
                  type="button"
                  className="primary-btn small"
                  onClick={() => {
                    setEditing(null);
                    setPage('new');
                  }}
                >
                  <Plus size={15} /> New inquiry
                </button>
              }
            />
          ) : (
            <div className="recent-list">
              {recent.map((x) => (
                <button
                  type="button"
                  className="recent-row"
                  key={x.id}
                  onClick={() => {
                    setEditing(x);
                    setPage('new');
                  }}
                >
                  <div className="patient-avatar">
                    {(x.patient || 'P').slice(0, 1).toUpperCase()}
                  </div>
                  <div className="recent-info">
                    <b>{x.patient}</b>
                    <span>
                      {x.doctor || 'No doctor selected'} · #{x.number}
                    </span>
                  </div>
                  <div className="recent-date">
                    {new Date(x.date + 'T00:00:00').toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </div>
                  <StatusBadge status={x.status} />
                  <span className="recent-chevron" aria-hidden="true">
                    <ChevronRight size={17} />
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="panel quick-panel">
          <div className="panel-head">
            <div>
              <h3>Quick actions</h3>
              <p>Common tasks at your fingertips</p>
            </div>
          </div>

          <QuickAction
            icon={FilePlus2}
            title="New patient inquiry"
            text="Fill in tooth details and instructions"
            onClick={() => {
              setEditing(null);
              setPage('new');
            }}
          />
          <QuickAction
            icon={History}
            title="View inquiry history"
            text="Find and manage previous submissions"
            onClick={() => setPage('history')}
          />
          <QuickAction
            icon={Users}
            title="Manage doctors"
            text={`${data.doctors.length} doctor${
              data.doctors.length === 1 ? '' : 's'
            } in your list`}
            onClick={() => setPage('doctors')}
          />
          <QuickAction
            icon={Settings}
            title="Lab & WhatsApp settings"
            text="Update the destination number"
            onClick={() => setPage('settings')}
          />
        </section>
      </div>

      <div className="tip-strip">
        <div className="tip-strip-icon">
          <BadgeCheck size={19} />
        </div>
        <p>
          <b>Helpful tip</b> Add your regular doctors in{' '}
          <a onClick={() => setPage('doctors')}>Doctor management</a>. Their
          names will then be available in the inquiry form.
        </p>
      </div>
    </>
  );
}
