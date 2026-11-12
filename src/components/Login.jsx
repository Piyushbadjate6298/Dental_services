import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from 'lucide-react';

export default function Login({ onLogin }) {
  const [u, setU] = useState('admin');
  const [p, setP] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (u === 'admin' && p === 'admin') {
      onLogin();
    } else {
      setErr('Incorrect username or password.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-art">
        <div className="art-orb orb-one" />
        <div className="art-orb orb-two" />
        <div className="art-content">
          <div className="brand-mark big">
            <Stethoscope size={30} />
          </div>
          <div className="eyebrow light">DENTAL LAB MANAGEMENT</div>
          <h1>
            Better work.
            <br />
            <i>Beautiful smiles.</i>
          </h1>
          <p>Every patient inquiry, organized in one simple place.</p>
          <div className="art-pills">
            <span>
              <Check size={14} /> Digital prescriptions
            </span>
            <span>
              <Check size={14} /> WhatsApp sharing
            </span>
            <span>
              <Check size={14} /> Patient history
            </span>
          </div>
        </div>
        <div className="art-footer">SHITAL DENTAL SERVICES · LASALGAON</div>
      </div>

      <div className="login-panel">
        <div className="login-card">
          <div className="login-mobile-brand">
            <div className="brand-mark">
              <Stethoscope size={22} />
            </div>
            <div>
              <b>SHITAL</b>
              <span>DENTAL SERVICES</span>
            </div>
          </div>

          <div className="eyebrow">WELCOME BACK</div>
          <h2>
            Sign in to your
            <br />
            workspace
          </h2>
          <p className="muted">Enter your admin details to continue.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="login-username">Username</label>
            <div className="input-wrap">
              <UserRound size={17} />
              <input
                id="login-username"
                value={u}
                onChange={(e) => {
                  setU(e.target.value);
                  if (err) setErr('');
                }}
                autoComplete="username"
              />
            </div>

            <label htmlFor="login-password">Password</label>
            <div className="input-wrap">
              <ShieldCheck size={17} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={p}
                onChange={(e) => {
                  setP(e.target.value);
                  if (err) setErr('');
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pass-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {err && <div className="error">{err}</div>}

            <button className="primary-btn full" type="submit">
              Sign in <ArrowRight size={17} />
            </button>
          </form>

          <div className="demo-login">
            <b>Demo access</b>
            <span>Username: admin&nbsp; · &nbsp;Password: admin</span>
          </div>
          <p className="login-foot">Your local workspace is ready when you are.</p>
        </div>
      </div>
    </div>
  );
}
