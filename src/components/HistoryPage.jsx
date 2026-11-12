import React, { useState } from 'react';
import {
  Eye,
  Filter,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import {
  cleanPhone,
  money,
  shareInquiryOnWhatsApp,
} from '../utils/dental';
import BillModal from './BillModal';
import { EmptyState, PageHeading, StatusBadge } from './Common';

export default function HistoryPage({
  data,
  search,
  setSearch,
  filter,
  setFilter,
  onNew,
  onEdit,
  onDelete,
  notify,
}) {
  const [billItem, setBillItem] = useState(null);

  const rows = data.inquiries.filter((x) => {
    const q = search.toLowerCase();
    const match = [x.patient, x.doctor, String(x.number)].some((v) =>
      (v || '').toLowerCase().includes(q)
    );
    return match && (filter === 'All' || x.status === filter);
  });

  const resend = async (x) => {
    if (!cleanPhone(data.whatsapp)) {
      notify('Add the lab WhatsApp number in Settings first');
      return;
    }
    try {
      const mode = await shareInquiryOnWhatsApp(x, data);
      if (mode === 'fallback') {
        notify('Image downloaded. Attach it in WhatsApp.');
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        notify('Unable to share this inquiry');
      }
    }
  };

  const formatDate = (d) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <>
      <PageHeading
        eyebrow="RECORDS & FOLLOW-UPS"
        title="Inquiry history"
        sub="Search, review and manage every patient inquiry."
        action={
          <button type="button" className="primary-btn" onClick={onNew}>
            <Plus size={17} /> New inquiry
          </button>
        }
      />

      <div className="panel history-panel">
        <div className="history-tools">
          <div className="search-box">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, doctor or inquiry no."
              aria-label="Search patient, doctor or inquiry no."
            />
          </div>
          <div className="filter-box">
            <Filter size={16} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter inquiries by status"
            >
              <option>All</option>
              <option>Sent</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No matching inquiries"
            text={
              data.inquiries.length
                ? 'Try changing your search or filter.'
                : 'Your saved patient inquiries will appear here.'
            }
          />
        ) : (
          <>
            <div className="table-wrap desktop-history">
              <table>
                <thead>
                  <tr>
                    <th>INQUIRY</th>
                    <th>PATIENT / DOCTOR</th>
                    <th>DATE</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((x) => (
                    <tr key={x.id}>
                      <td>
                        <b className="record-no">#{x.number}</b>
                        <small>
                          {x.teeth?.length || 0} teeth ·{' '}
                          {(x.instructions || []).length} material(s)
                        </small>
                      </td>
                      <td>
                        <b>{x.patient}</b>
                        <small>{x.doctor}</small>
                      </td>
                      <td>{formatDate(x.date)}</td>
                      <td>
                        <b>{money(x.total)}</b>
                      </td>
                      <td>
                        <StatusBadge status={x.status} />
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            title="View bill"
                            aria-label="View bill"
                            onClick={() => setBillItem(x)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn"
                            title="Edit"
                            aria-label="Edit"
                            onClick={() => onEdit(x)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn"
                            title="Share on WhatsApp"
                            aria-label="Share on WhatsApp"
                            onClick={() => resend(x)}
                          >
                            <MessageCircle size={16} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn danger"
                            title="Delete"
                            aria-label="Delete"
                            onClick={() => onDelete(x.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobile-history-cards">
              {rows.map((x) => (
                <article className="history-card" key={x.id}>
                  <div className="history-card-top">
                    <div className="history-card-id">
                      <b className="record-no">#{x.number}</b>
                      <span>{formatDate(x.date)}</span>
                    </div>
                    <StatusBadge status={x.status} />
                  </div>

                  <div className="history-card-body">
                    <div className="history-card-main">
                      <h4>{x.patient}</h4>
                      <p>{x.doctor || 'No doctor selected'}</p>
                    </div>
                    <div className="history-card-amount">
                      <small>Amount</small>
                      <b>{money(x.total)}</b>
                    </div>
                  </div>

                  <div className="history-card-meta">
                    <span>{x.teeth?.length || 0} teeth</span>
                    <span>·</span>
                    <span>{(x.instructions || []).length} material(s)</span>
                  </div>

                  <div className="history-card-actions">
                    <button
                      type="button"
                      className="card-action-btn"
                      onClick={() => setBillItem(x)}
                    >
                      <Eye size={15} /> Bill
                    </button>
                    <button
                      type="button"
                      className="card-action-btn"
                      onClick={() => onEdit(x)}
                    >
                      <Pencil size={15} /> Edit
                    </button>
                    <button
                      type="button"
                      className="card-action-btn share"
                      onClick={() => resend(x)}
                    >
                      <MessageCircle size={15} /> WhatsApp
                    </button>
                    <button
                      type="button"
                      className="card-action-btn danger"
                      aria-label="Delete"
                      onClick={() => onDelete(x.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        <div className="table-foot">
          Showing <b>{rows.length}</b> of <b>{data.inquiries.length}</b>{' '}
          inquiries
        </div>
      </div>

      {billItem && (
        <BillModal
          item={billItem}
          data={data}
          onClose={() => setBillItem(null)}
        />
      )}
    </>
  );
}
