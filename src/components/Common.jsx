import React from 'react';
import { ChevronRight } from 'lucide-react';

export function PageHeading({ eyebrow, title, sub, action }) {
  return (
    <div className="page-heading">
      <div className="page-heading-copy">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {action && <div className="page-heading-action">{action}</div>}
    </div>
  );
}

export function Stat({ icon: Icon, label, value, note }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <div className="stat-icon">
          <Icon size={18} />
        </div>
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

export function QuickAction({ icon: Icon, title, text, onClick }) {
  return (
    <button type="button" className="quick-action" onClick={onClick}>
      <span className="quick-icon">
        <Icon size={18} />
      </span>
      <span className="quick-action-copy">
        <b>{title}</b>
        <small>{text}</small>
      </span>
      <ChevronRight size={17} className="quick-arrow" />
    </button>
  );
}

export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon size={23} />
      </div>
      <b>{title}</b>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function StatusBadge({ status }) {
  return (
    <span className={`status ${status === 'Sent' ? 'sent' : 'draft'}`}>
      <i aria-hidden="true" />
      {status || 'Draft'}
    </span>
  );
}

export function SummaryRow({ label, value }) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
