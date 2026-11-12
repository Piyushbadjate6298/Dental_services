import React from 'react';
import { Check } from 'lucide-react';
import { teeth } from '../utils/dental';

const RIGHT_INDICES = [0, 1, 2, 3, 4, 5, 6, 7];
const LEFT_INDICES = [8, 9, 10, 11, 12, 13, 14, 15];

function ToothGrid({ jaw, jawLabel, indices, side, selected, onToggle }) {
  const isRight = side === 'R';
  return (
    <div className="tooth-quadrant" data-side={side}>
      <div className="quadrant-head">
        <span className="quadrant-badge">{side === 'R' ? "Patient's right" : "Patient's left"}</span>
        <span className="quadrant-code">{jaw}{side}</span>
      </div>
      <div className="teeth-grid" role="group" aria-label={`${jawLabel} ${isRight ? "Patient's right" : "Patient's left"}`}>
        {indices.map((i) => {
          const num = teeth[i];
          const key = `${jaw}-${i}`;
          const active = selected.includes(key);
          return (
            <button
              type="button"
              key={key}
              className={`tooth-btn ${active ? 'active' : ''}`}
              aria-pressed={active}
              aria-label={`${jawLabel} ${isRight ? 'Right' : 'Left'} tooth ${num}`}
              onClick={() => onToggle(jaw, i)}
            >
              <span className="tooth-top">
                <i className="tooth-side">{side}</i>
                {active && (
                  <span className="tooth-check" aria-hidden="true">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </span>
              <strong className="tooth-num">{num}</strong>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function JawSection({ jaw, title, subtitle, selected, onToggle }) {
  const jawCount = selected.filter((k) => k.startsWith(`${jaw}-`)).length;

  return (
    <div className="jaw-card">
      <div className="jaw-header">
        <div>
          <div className="jaw-label">{title}</div>
          {subtitle && <span className="jaw-direction">{subtitle}</span>}
        </div>
        <span className={`jaw-count ${jawCount > 0 ? 'has-items' : ''}`}>
          {jawCount} selected
        </span>
      </div>

      <div className="jaw-quadrants">
        <ToothGrid
          jaw={jaw}
          jawLabel={title}
          indices={RIGHT_INDICES}
          side="R"
          selected={selected}
          onToggle={onToggle}
        />

        <div className="jaw-midline" aria-hidden="true">
          <span className="midline-line" />
          <span className="midline-pill">MIDLINE</span>
          <span className="midline-line" />
        </div>

        <ToothGrid
          jaw={jaw}
          jawLabel={title}
          indices={LEFT_INDICES}
          side="L"
          selected={selected}
          onToggle={onToggle}
        />
      </div>
    </div>
  );
}

export default function ToothPicker({ selected, setSelected }) {
  const toggle = (jaw, index) => {
    const key = `${jaw}-${index}`;
    setSelected((s) => (s.includes(key) ? s.filter((x) => x !== key) : [...s, key]));
  };

  return (
    <div className="tooth-picker">
      <div className="tooth-picker-bar">
        <span className="tooth-total-badge">
          <b>{selected.length}</b> tooth/teeth selected
        </span>
        {selected.length > 0 && (
          <button
            type="button"
            className="clear-teeth-btn"
            onClick={() => setSelected([])}
          >
            Clear selection
          </button>
        )}
      </div>

      <JawSection
        jaw="U"
        title="UPPER JAW"
        subtitle="Patient's right ←   → Patient's left"
        selected={selected}
        onToggle={toggle}
      />

      <div className="arch-divider" aria-hidden="true">
        <span />
        <small>OCCLUSAL PLANE</small>
        <span />
      </div>

      <JawSection
        jaw="L"
        title="LOWER JAW"
        selected={selected}
        onToggle={toggle}
      />

      <div className="tooth-legend">
        <span>
          <i className="legend-dot" /> Selected
        </span>
        <span>Tap a tooth number to select / deselect</span>
      </div>
    </div>
  );
}
