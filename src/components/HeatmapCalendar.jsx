import React from 'react';
import { Calendar, Download } from 'lucide-react';
import { exportToPng } from '../utils/exporter';

export default function HeatmapCalendar({ data }) {
  const { dayMessageCounts } = data;
  if (!dayMessageCounts) return null;

  // Find max count to scale colors
  let maxCount = 0;
  Object.values(dayMessageCounts).forEach(count => {
    if (count > maxCount) maxCount = count;
  });

  const getIntensityColor = (count) => {
    if (!count || count === 0) return 'var(--bg-surface-2)';
    const ratio = count / maxCount;
    if (ratio < 0.1) return 'rgba(16, 185, 129, 0.2)';
    if (ratio < 0.25) return 'rgba(16, 185, 129, 0.4)';
    if (ratio < 0.5) return 'rgba(16, 185, 129, 0.6)';
    if (ratio < 0.75) return 'rgba(16, 185, 129, 0.8)';
    return 'rgba(16, 185, 129, 1)';
  };

  // Build grid data for a year or all days
  const dates = Object.keys(dayMessageCounts).sort();
  if (dates.length === 0) return null;

  const firstDate = new Date(dates[0]);
  const lastDate = new Date(dates[dates.length - 1]);
  
  // We'll show up to the last 365 days from the last date
  const startDisplayDate = new Date(lastDate);
  startDisplayDate.setDate(lastDate.getDate() - 364);
  const actualStart = firstDate > startDisplayDate ? firstDate : startDisplayDate;

  const gridBoxes = [];
  let d = new Date(actualStart);
  
  // Adjust to start on a Sunday to align weeks
  const dayOfWeek = d.getDay();
  for (let i = 0; i < dayOfWeek; i++) {
    gridBoxes.push({ dateStr: 'pad', count: -1 });
  }

  while (d <= lastDate) {
    const dStr = d.toISOString().split('T')[0];
    const count = dayMessageCounts[dStr] || 0;
    gridBoxes.push({ dateStr: dStr, count });
    d.setDate(d.getDate() + 1);
  }

  // Calculate weeks
  const totalWeeks = Math.ceil(gridBoxes.length / 7);

  return (
    <div className="anim-fade-up" id="heatmap-card">
      <div style={{ marginBottom: 20 }}>
        <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="section-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              <Calendar size={15} color="#10b981" />
            </div>
            <span className="section-title">Activity Heatmap</span>
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
          Your daily message intensity over time
        </p>
      </div>

      <div className="m3-card" style={{ padding: '32px', overflowX: 'auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${totalWeeks}, 12px)`, 
          gridTemplateRows: 'repeat(7, 12px)',
          gap: 4,
          width: 'max-content',
          margin: '0 auto'
        }}>
          {gridBoxes.map((box, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: box.count === -1 ? 'transparent' : getIntensityColor(box.count),
                opacity: box.count === -1 ? 0 : 1
              }}
              title={box.count > -1 ? `${box.dateStr}: ${box.count} messages` : ''}
            />
          ))}
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 8, 
          marginTop: 24,
          fontSize: '0.75rem',
          color: 'var(--on-surface-mute)'
        }}>
          <span>Less</span>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--bg-surface-2)' }} />
          <div style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(16, 185, 129, 0.2)' }} />
          <div style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(16, 185, 129, 0.6)' }} />
          <div style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(16, 185, 129, 1)' }} />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
