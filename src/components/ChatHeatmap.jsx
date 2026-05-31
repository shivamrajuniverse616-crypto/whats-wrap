import React from 'react';
import { Clock, Download } from 'lucide-react';
import { exportToPng } from '../utils/exporter';

export default function ChatHeatmap({ data }) {
  const { hourlyDistribution, weekdayDistribution } = data;
  if (!hourlyDistribution || !weekdayDistribution) return null;

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getCellWeight = (dayIdx, hourIdx) => {
    const hw = hourlyDistribution[hourIdx] || 0;
    const dw = weekdayDistribution[dayIdx] || 0;
    return (hw * dw) / 100;
  };

  let maxWeight = 0;
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      const w = getCellWeight(d, h);
      if (w > maxWeight) maxWeight = w;
    }
  }
  if (maxWeight === 0) maxWeight = 1;

  const heatClass = (w) => {
    const r = w / maxWeight;
    if (r === 0) return 'hc-0';
    if (r < 0.25) return 'hc-1';
    if (r < 0.5) return 'hc-2';
    if (r < 0.75) return 'hc-3';
    return 'hc-4';
  };

  return (
    <div className="anim-fade-up" id="heatmap-card">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="section-icon" style={{ background: 'var(--primary-glow)' }}>
              <Clock size={15} color="var(--primary)" />
            </div>
            <span className="section-title">Chat Heatmap</span>
          </div>
          <button
            className="export-btn"
            onClick={() => exportToPng('heatmap-card', 'whatswrap-heatmap')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--card-border)',
              borderRadius: 8, padding: '6px 12px',
              fontSize: '0.72rem', fontWeight: 600, color: 'var(--on-surface-dim)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <Download size={12} />
            <span>Export PNG</span>
          </button>
        </div>
        <p className="section-subtitle" style={{ paddingLeft: 38 }}>
          Message density by day &amp; hour. Darker = more active
        </p>
      </div>

      {/* Grid container */}
      <div className="m3-card" style={{ padding: '32px' }}>
        <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
          <div style={{ minWidth: 600 }}>
            {/* Hour labels */}
            <div className="heatmap-grid" style={{ marginBottom: 8, alignItems: 'center' }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--on-surface-mute)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                DAY
              </div>
              {hours.map(h => (
                <div key={h} style={{
                  fontSize: '0.65rem', color: 'var(--on-surface-mute)',
                  textAlign: 'center', fontWeight: 600,
                }}>
                  {h === 0 ? '12a' : h === 12 ? '12p' : h % 12}
                </div>
              ))}
            </div>

            {/* Days with hourly cells */}
            {weekDays.map((day, dIdx) => (
              <div key={day} className="heatmap-grid" style={{ marginBottom: 4, alignItems: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-dim)', fontWeight: 600 }}>
                  {day}
                </div>
                {hours.map(hIdx => {
                  const w = getCellWeight(dIdx, hIdx);
                  return (
                    <div
                      key={hIdx}
                      className={`heatmap-cell ${heatClass(w)}`}
                      title={`${day} @ ${hIdx === 0 ? '12 AM' : hIdx === 12 ? '12 PM' : hIdx < 12 ? `${hIdx} AM` : `${hIdx - 12} PM`}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          gap: 8, marginTop: 20,
          fontSize: '0.68rem', fontWeight: 600,
          color: 'var(--on-surface-mute)', textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          <span>Less</span>
          {['hc-0', 'hc-1', 'hc-2', 'hc-3', 'hc-4'].map(c => (
            <div key={c} className={`heatmap-cell ${c}`} style={{ width: 14, height: 14, borderRadius: 3, flexShrink: 0 }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
