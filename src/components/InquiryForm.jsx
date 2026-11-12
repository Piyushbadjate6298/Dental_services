import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  FileText,
  MessageCircle,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  cleanPhone,
  instructions,
  money,
  shareInquiryOnWhatsApp,
  stages,
  today,
} from '../utils/dental';
import BillModal from './BillModal';
import { PageHeading, SummaryRow } from './Common';
import ToothPicker from './ToothPicker';

export default function InquiryForm({ data, onSave, notify, initial, onBack }) {
  const [doctor, setDoctor] = useState(initial?.doctor || '');
  const [patient, setPatient] = useState(initial?.patient || '');
  const [date, setDate] = useState(initial?.date || today());
  const [shade, setShade] = useState(initial?.shade || '');
  const [selected, setSelected] = useState(initial?.teeth || []);
  const [chosen, setChosen] = useState(initial?.instructions || []);
  const [stage, setStage] = useState(initial?.stages || []);
  const [note, setNote] = useState(initial?.note || '');
  const [items, setItems] = useState(
    initial?.items || [{ description: 'Dental work', amount: '' }]
  );
  const [showBill, setShowBill] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (initial) {
      setDoctor(initial.doctor || '');
      setPatient(initial.patient || '');
      setDate(initial.date || today());
      setShade(initial.shade || '');
      setSelected(initial.teeth || []);
      setChosen(initial.instructions || []);
      setStage(initial.stages || []);
      setNote(initial.note || '');
      setItems(initial.items || [{ description: 'Dental work', amount: '' }]);
    } else {
      setDoctor('');
      setPatient('');
      setDate(today());
      setShade('');
      setSelected([]);
      setChosen([]);
      setStage([]);
      setNote('');
      setItems([{ description: 'Dental work', amount: '' }]);
    }
  }, [initial?.id]);

  const total = items.reduce((s, x) => s + Number(x.amount || 0), 0);
  const toggle = (set, v) =>
    set((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]));

  const payload = () => ({
    id: initial?.id || crypto.randomUUID(),
    number: initial?.number || data.nextNo,
    date,
    doctor,
    patient,
    shade,
    teeth: selected,
    instructions: chosen,
    stages: stage,
    note,
    items,
    total,
    status: initial?.status || 'Draft',
    createdAt: initial?.createdAt || new Date().toISOString(),
  });

  const validate = () => {
    if (!patient.trim()) {
      notify('Please enter the patient name');
      return false;
    }
    if (!doctor.trim()) {
      notify('Please select or enter a doctor name');
      return false;
    }
    return true;
  };

  const submit = () => {
    if (!validate()) return;
    onSave(payload());
  };

  const share = async () => {
    if (!validate()) return;
    if (!cleanPhone(data.whatsapp)) {
      notify('Add the lab WhatsApp number in Settings first');
      return;
    }
    const item = payload();
    setBusy(true);
    try {
      const mode = await shareInquiryOnWhatsApp(item, data);
      if (mode === 'shared') {
        item.status = 'Sent';
        onSave(item);
      } else {
        item.status = 'Draft';
        onSave(item);
        notify('Bill image downloaded. Attach it in the WhatsApp chat and press Send.');
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        notify('Could not open sharing. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeading
        eyebrow="PATIENT WORKFLOW"
        title={initial ? 'Edit inquiry' : 'Create new inquiry'}
        sub="Enter the prescription details below. Your digital record is prepared automatically."
        action={
          <button type="button" className="outline-btn" onClick={onBack}>
            <ArrowLeft size={16} /> Back
          </button>
        }
      />

      <div className="form-layout">
        <div className="form-main">
          <section className="panel form-panel">
            <div className="form-section-title">
              <span className="section-number">01</span>
              <div>
                <h3>Patient information</h3>
                <p>Basic details for this laboratory case</p>
              </div>
            </div>

            <div className="field-grid">
              <div className="field">
                <label htmlFor="field-doctor">
                  Doctor&apos;s name <em>*</em>
                </label>
                {data.doctors.length ? (
                  <select
                    id="field-doctor"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                  >
                    <option value="">Select doctor</option>
                    {data.doctors.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="field-doctor"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    placeholder="Enter doctor's name"
                  />
                )}
                <small>
                  {data.doctors.length
                    ? 'Choose from your saved doctor list.'
                    : 'Add doctors in the Doctors section to enable quick selection.'}
                </small>
              </div>

              <div className="field">
                <label htmlFor="field-patient">
                  Patient&apos;s name <em>*</em>
                </label>
                <input
                  id="field-patient"
                  value={patient}
                  onChange={(e) => setPatient(e.target.value)}
                  placeholder="Enter patient full name"
                />
              </div>

              <div className="field">
                <label htmlFor="field-date">Inquiry date</label>
                <input
                  id="field-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="field-shade">Tooth shade</label>
                <input
                  id="field-shade"
                  value={shade}
                  onChange={(e) => setShade(e.target.value)}
                  placeholder="e.g. A2, A3, B1"
                />
              </div>
            </div>
          </section>

          <section className="panel form-panel">
            <div className="form-section-title">
              <span className="section-number">02</span>
              <div>
                <h3>Tooth selection</h3>
                <p>Select the teeth required for dental work</p>
              </div>
            </div>
            <ToothPicker selected={selected} setSelected={setSelected} />
          </section>

          <section className="panel form-panel">
            <div className="form-section-title">
              <span className="section-number">03</span>
              <div>
                <h3>Lab instructions</h3>
                <p>Select one or more materials / work types</p>
              </div>
            </div>

            <div className="choice-grid">
              {instructions.map((x) => {
                const isChecked = chosen.includes(x);
                return (
                  <label
                    className={`choice ${isChecked ? 'checked' : ''}`}
                    key={x}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(setChosen, x)}
                    />
                    <span className="fake-check" aria-hidden="true">
                      {isChecked && <Check size={13} strokeWidth={3} />}
                    </span>
                    <span className="choice-label">{x}</span>
                  </label>
                );
              })}
            </div>

            <div className="field stages-field">
              <label>Work stage</label>
              <div className="stage-options">
                {stages.map((x) => {
                  const isChecked = stage.includes(x);
                  return (
                    <label
                      className={`stage-chip ${isChecked ? 'checked' : ''}`}
                      key={x}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(setStage, x)}
                      />
                      {isChecked && <Check size={13} strokeWidth={3} />} {x}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="field note-field">
              <label htmlFor="field-note">
                Additional instructions <span>(optional)</span>
              </label>
              <textarea
                id="field-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any special instructions for the dental lab..."
                rows="3"
              />
            </div>
          </section>

          <section className="panel form-panel">
            <div className="form-section-title">
              <span className="section-number">04</span>
              <div>
                <h3>Bill details</h3>
                <p>Add work description and amount for the patient bill</p>
              </div>
            </div>

            <div className="bill-items">
              {items.map((it, i) => (
                <div className="bill-item" key={i}>
                  <div className="field">
                    <label htmlFor={`item-desc-${i}`}>Description</label>
                    <input
                      id={`item-desc-${i}`}
                      value={it.description}
                      onChange={(e) =>
                        setItems((a) =>
                          a.map((x, j) =>
                            j === i ? { ...x, description: e.target.value } : x
                          )
                        )
                      }
                      placeholder="e.g. Zirconia crown"
                    />
                  </div>
                  <div className="field amount-field">
                    <label htmlFor={`item-amt-${i}`}>Amount (₹)</label>
                    <input
                      id={`item-amt-${i}`}
                      type="number"
                      min="0"
                      inputMode="numeric"
                      value={it.amount}
                      onChange={(e) =>
                        setItems((a) =>
                          a.map((x, j) =>
                            j === i ? { ...x, amount: e.target.value } : x
                          )
                        )
                      }
                      placeholder="0"
                    />
                  </div>
                  <button
                    type="button"
                    className="icon-btn danger remove-item"
                    onClick={() =>
                      setItems((a) =>
                        a.length > 1
                          ? a.filter((_, j) => j !== i)
                          : a.map((x, j) =>
                              j === i ? { description: '', amount: '' } : x
                            )
                      )
                    }
                    title="Remove row"
                    aria-label="Remove row"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="add-line"
              onClick={() =>
                setItems((a) => [...a, { description: '', amount: '' }])
              }
            >
              <Plus size={15} /> Add bill item
            </button>

            <div className="total-line">
              <span>Bill total</span>
              <b>{money(total)}</b>
            </div>
          </section>

          <div className="form-actions">
            <button
              type="button"
              className="outline-btn"
              onClick={() => setShowBill(true)}
            >
              <Eye size={17} /> Preview digital bill
            </button>
            <button type="button" className="primary-btn" onClick={submit}>
              <CheckCircle2 size={17} /> Save inquiry
            </button>
          </div>
        </div>

        <aside className="form-aside">
          <div className="aside-card preview-card">
            <div className="preview-head">
              <div className="preview-icon">
                <FileText size={18} />
              </div>
              <span>LIVE SUMMARY</span>
            </div>
            <h3>{patient || 'Patient name'}</h3>
            <p>{doctor || 'Doctor not selected'}</p>
            <div className="summary-divider" />
            <SummaryRow
              label="Date"
              value={
                date
                  ? new Date(date + 'T00:00:00').toLocaleDateString('en-IN')
                  : '—'
              }
            />
            <SummaryRow
              label="Teeth selected"
              value={selected.length ? `${selected.length} teeth` : 'None'}
            />
            <SummaryRow
              label="Materials"
              value={chosen.length ? chosen.join(', ') : 'Not selected'}
            />
            <SummaryRow
              label="Work stage"
              value={stage.length ? stage.join(', ') : 'Not selected'}
            />
            <SummaryRow label="Shade" value={shade || '—'} />
            <div className="summary-total">
              <span>Bill total</span>
              <b>{money(total)}</b>
            </div>
          </div>

          <div className="aside-tip">
            <Sparkles size={17} className="aside-tip-icon" />
            <div>
              <b>Quick tip</b>
              <p>
                Tap the tooth numbers to select. You can select multiple teeth
                across both jaws.
              </p>
            </div>
          </div>

          <div className="aside-share-box">
            <button
              type="button"
              className="whatsapp-btn"
              onClick={share}
              disabled={busy}
            >
              <span className="whatsapp-btn-left">
                {busy ? <span className="spinner" /> : <MessageCircle size={18} />}
                <span>{busy ? 'Preparing share…' : 'Send inquiry to lab'}</span>
              </span>
              <ArrowRight size={16} />
            </button>
            <p className="share-caption">
              Creates a digital bill image and formatted message for WhatsApp.
            </p>
          </div>
        </aside>
      </div>

      {showBill && (
        <BillModal
          item={payload()}
          data={data}
          onClose={() => setShowBill(false)}
        />
      )}
    </>
  );
}
