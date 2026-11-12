import React, { useEffect, useState } from 'react';
import {
  ArrowDownToLine,
  Check,
  Download,
  History,
  MessageCircle,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import {
  cleanPhone,
  defaultData,
  downloadBlob,
} from '../utils/dental';
import { PageHeading } from './Common';

export default function SettingsPage({ data, setData, notify }) {
  const [phone, setPhone] = useState(data.whatsapp);
  const [lab, setLab] = useState(data.labName);
  const [address, setAddress] = useState(data.labAddress);
  const [labPhone, setLabPhone] = useState(data.labPhone);

  useEffect(() => {
    setPhone(data.whatsapp);
    setLab(data.labName);
    setAddress(data.labAddress);
    setLabPhone(data.labPhone);
  }, [data.whatsapp, data.labName, data.labAddress, data.labPhone]);

  const save = () => {
    const normalized = cleanPhone(phone);
    setPhone(normalized);
    setData((d) => ({
      ...d,
      whatsapp: normalized,
      labName: lab.trim() || 'Shital Dental Services',
      labAddress: address,
      labPhone,
    }));
    notify('Settings saved successfully');
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    downloadBlob(blob, 'shital-dental-backup.json');
  };

  const importData = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const v = JSON.parse(r.result);
        if (!Array.isArray(v.doctors) || !Array.isArray(v.inquiries)) {
          throw Error();
        }
        if (confirm('Replace current local data with this backup?')) {
          setData({ ...defaultData, ...v });
          notify('Backup restored');
        }
      } catch {
        notify('Invalid backup file');
      }
    };
    r.readAsText(f);
    e.target.value = '';
  };

  const previewPhone = cleanPhone(phone);

  return (
    <>
      <PageHeading
        eyebrow="CONFIGURATION"
        title="Settings"
        sub="Customize your lab details, WhatsApp destination and data backup."
      />

      <div className="settings-grid">
        <section className="panel settings-panel">
          <div className="form-section-title">
            <span className="section-number">
              <Settings size={17} />
            </span>
            <div>
              <h3>Lab information</h3>
              <p>These details appear on the digital bill image</p>
            </div>
          </div>

          <div className="field">
            <label htmlFor="settings-lab-name">Business / lab name</label>
            <input
              id="settings-lab-name"
              value={lab}
              onChange={(e) => setLab(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="settings-lab-address">Lab address</label>
            <textarea
              id="settings-lab-address"
              rows="2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="settings-lab-phone">Lab contact number</label>
            <input
              id="settings-lab-phone"
              value={labPhone}
              onChange={(e) => setLabPhone(e.target.value)}
              placeholder="Lab phone number"
            />
          </div>

          <div className="settings-divider" />

          <div className="form-section-title">
            <span className="section-number">
              <MessageCircle size={17} />
            </span>
            <div>
              <h3>WhatsApp destination</h3>
              <p>Change where patient inquiries are shared</p>
            </div>
          </div>

          <div className="field">
            <label htmlFor="settings-whatsapp">
              WhatsApp number (with country code) <em>*</em>
            </label>
            <input
              id="settings-whatsapp"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 919876543210"
            />
            <small>
              Enter digits only, including country code 91 for India. Do not add
              + or spaces.
            </small>
          </div>

          <div className="whatsapp-preview">
            <MessageCircle size={18} />
            <div>
              <b>Current destination</b>
              <span>
                {previewPhone ? `+ ${previewPhone}` : 'Not configured yet'}
              </span>
            </div>
          </div>

          <button type="button" className="primary-btn" onClick={save}>
            <Check size={17} /> Save settings
          </button>
        </section>

        <section className="panel backup-panel">
          <div className="form-section-title">
            <span className="section-number">
              <ShieldCheck size={17} />
            </span>
            <div>
              <h3>Data &amp; privacy</h3>
              <p>Keep a copy of your workspace data</p>
            </div>
          </div>

          <div className="backup-info">
            <div className="backup-icon">
              <Download size={20} />
            </div>
            <div>
              <b>Export a backup</b>
              <p>
                Download doctors, inquiries and settings as a JSON file. Store
                it somewhere safe.
              </p>
              <button
                type="button"
                className="outline-btn"
                onClick={exportData}
              >
                <ArrowDownToLine size={16} /> Download backup
              </button>
            </div>
          </div>

          <div className="backup-info">
            <div className="backup-icon">
              <History size={20} />
            </div>
            <div>
              <b>Restore a backup</b>
              <p>
                Restore a previously exported JSON file. This replaces current
                data.
              </p>
              <label className="outline-btn file-label">
                <ArrowDownToLine size={16} /> Choose backup file
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={importData}
                />
              </label>
            </div>
          </div>

          <div className="local-warning">
            <ShieldCheck size={17} className="warning-icon" />
            <p>
              <b>Local-only storage</b>
              <br />
              Your records are saved in this browser on this device. They are
              not synced to other phones or computers. Export backups
              regularly.
            </p>
          </div>

          <div className="security-note">
            <b>Demo login credentials</b>
            <span>Username: admin &nbsp;·&nbsp; Password: admin</span>
            <small>
              Change the demo credentials in the source code before using this
              app with real patient data. This frontend-only login is not secure
              authentication.
            </small>
          </div>
        </section>
      </div>
    </>
  );
}
