import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { downloadBlob, makeBillBlob, money, toothNames } from '../utils/dental';

export default function BillModal({ item, data, onClose }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const download = async () => {
    setLoading(true);
    try {
      const blob = await makeBillBlob(item, data);
      downloadBlob(blob, `Shital-Dental-${item.number}.png`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Digital bill preview for inquiry #${item.number}`}
      onClick={onClose}
    >
      <div className="bill-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <b>Digital bill preview</b>
            <small>Inquiry #{item.number}</small>
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close preview"
            onClick={onClose}
          >
            <X size={19} />
          </button>
        </div>

        <div className="bill-paper">
          <div className="bill-brand">
            <div className="bill-tooth" aria-hidden="true">
              ✦
            </div>
            <div>
              <h2>{data.labName || 'Shital Dental Services'}</h2>
              <span>DENTAL LABORATORY INQUIRY</span>
            </div>
          </div>

          <p className="bill-address">
            {data.labAddress}
            <br />
            Mob. {data.labPhone}
          </p>

          <div className="bill-meta">
            <span>
              Bill / Inquiry No. <b>#{item.number}</b>
            </span>
            <span>
              Date <b>{item.date}</b>
            </span>
          </div>

          <div className="bill-patient">
            <span>
              Doctor <b>{item.doctor || '—'}</b>
            </span>
            <span>
              Patient <b>{item.patient || '—'}</b>
            </span>
          </div>

          <h4>TOOTH &amp; LAB DETAILS</h4>
          <div className="bill-detail-list">
            <p>
              <b>Upper / Lower teeth:</b>{' '}
              {toothNames(item.teeth).join(', ') || 'Not selected'}
            </p>
            <p>
              <b>Tooth shade:</b> {item.shade || '—'}
            </p>
            <p>
              <b>Instructions:</b>{' '}
              {(item.instructions || []).join(', ') || '—'}
            </p>
            <p>
              <b>Work stage:</b> {(item.stages || []).join(', ') || '—'}
            </p>
            {item.note && (
              <p>
                <b>Additional note:</b> {item.note}
              </p>
            )}
          </div>

          <div className="bill-table-wrap">
            <table className="bill-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {(item.items || []).map((x, i) => (
                  <tr key={i}>
                    <td>{x.description || '—'}</td>
                    <td>{money(x.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bill-total">
            <b>TOTAL</b>
            <strong>{money(item.total)}</strong>
          </div>

          <div className="bill-thanks">Thank you · Shital Dental Services</div>
        </div>

        <div className="modal-actions">
          <button type="button" className="outline-btn" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="primary-btn"
            onClick={download}
            disabled={loading}
          >
            <Download size={16} />
            {loading ? 'Preparing…' : 'Download bill image'}
          </button>
        </div>
      </div>
    </div>
  );
}
