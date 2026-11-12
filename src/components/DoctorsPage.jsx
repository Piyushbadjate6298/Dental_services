import React, { useState } from 'react';
import {
  BadgeCheck,
  Check,
  Pencil,
  Plus,
  Trash2,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { EmptyState, PageHeading } from './Common';

export default function DoctorsPage({ data, setData, notify }) {
  const [name, setName] = useState('');
  const [edit, setEdit] = useState('');
  const [editVal, setEditVal] = useState('');

  const add = () => {
    const n = name.trim();
    if (!n) return;
    if (data.doctors.some((x) => x.toLowerCase() === n.toLowerCase())) {
      notify('This doctor is already in your list');
      return;
    }
    setData((d) => ({
      ...d,
      doctors: [...d.doctors, n].sort((a, b) => a.localeCompare(b)),
    }));
    setName('');
    notify('Doctor added to your list');
  };

  const startEdit = (d) => {
    setEdit(d);
    setEditVal(d);
  };

  const saveEdit = (oldName) => {
    const n = editVal.trim();
    if (!n) return;
    setData((d) => ({
      ...d,
      doctors: d.doctors
        .map((x) => (x === oldName ? n : x))
        .sort((a, b) => a.localeCompare(b)),
    }));
    setEdit('');
    setEditVal('');
    notify('Doctor name updated');
  };

  const remove = (n) => {
    if (
      confirm(
        `Remove ${n} from the doctor list? Existing inquiries will remain unchanged.`
      )
    ) {
      setData((d) => ({ ...d, doctors: d.doctors.filter((x) => x !== n) }));
      notify('Doctor removed');
    }
  };

  return (
    <>
      <PageHeading
        eyebrow="MASTER DATA"
        title="Doctor management"
        sub="Maintain your regular doctors. Changes here appear in the inquiry form."
      />

      <div className="doctor-layout">
        <section className="panel doctor-add">
          <div className="panel-head">
            <div>
              <h3>Add a doctor</h3>
              <p>Build your own reusable doctor directory</p>
            </div>
            <div className="stat-icon">
              <UserRound size={18} />
            </div>
          </div>

          <label htmlFor="add-doctor-input">Doctor&apos;s full name</label>
          <div className="add-doctor-row">
            <input
              id="add-doctor-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && add()}
              placeholder="e.g. Dr. Amit Sharma"
            />
            <button type="button" className="primary-btn" onClick={add}>
              <Plus size={17} /> Add doctor
            </button>
          </div>

          <div className="tip-inline">
            <BadgeCheck size={16} />
            <span>
              Add all your 26 regular doctors here. You can edit or remove names
              anytime.
            </span>
          </div>
        </section>

        <section className="panel doctor-list">
          <div className="panel-head">
            <div>
              <h3>Saved doctors</h3>
              <p>
                {data.doctors.length} doctor
                {data.doctors.length === 1 ? '' : 's'} available in inquiry form
              </p>
            </div>
            <span className="count-pill">{data.doctors.length}</span>
          </div>

          {data.doctors.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Your doctor list is empty"
              text="Add the doctors you work with. They will appear in the new inquiry dropdown."
            />
          ) : (
            <div className="doctor-rows">
              {data.doctors.map((d, i) => (
                <div className="doctor-row" key={d}>
                  <div className="doctor-avatar">
                    {d.slice(0, 1).toUpperCase()}
                  </div>
                  {edit === d ? (
                    <input
                      className="edit-doctor"
                      autoFocus
                      value={editVal}
                      onChange={(e) => setEditVal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(d)}
                    />
                  ) : (
                    <div className="doctor-name">
                      <b>{d}</b>
                      <small>Doctor {String(i + 1).padStart(2, '0')}</small>
                    </div>
                  )}
                  <div className="row-actions">
                    {edit === d ? (
                      <>
                        <button
                          type="button"
                          className="icon-btn good"
                          aria-label="Save doctor name"
                          onClick={() => saveEdit(d)}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn"
                          aria-label="Cancel edit"
                          onClick={() => setEdit('')}
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="icon-btn"
                          aria-label={`Edit ${d}`}
                          onClick={() => startEdit(d)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn danger"
                          aria-label={`Remove ${d}`}
                          onClick={() => remove(d)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
