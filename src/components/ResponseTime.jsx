import React from 'react';
import { Clock, Hourglass, Zap, Download } from 'lucide-react';
import { exportToPng } from '../utils/exporter';

export default function ResponseTime({ data }) {
  const { chatters, userStats } = data;
  const [u1, u2] = chatters;
  const s1 = userStats[u1];
  const s2 = userStats[u2];

  const avg1 = s1.responseTimesCount > 0 ? (s1.totalResponseTime / s1.responseTimesCount / 60) : 0;
  const avg2 = s2.responseTimesCount > 0 ? (s2.totalResponseTime / s2.responseTimesCount / 60) : 0;

  const formatTime = (mins) => {
    if (mins === 0) return 'N/A';
    if (mins < 1) return '< 1 min';
    if (mins < 60) return `${Math.round(mins)} mins`;
    const hrs = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return `${hrs}h ${m}m`;
  };

  const fastest = avg1 < avg2 && avg1 > 0 ? u1 : (avg2 < avg1 && avg2 > 0 ? u2 : null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', background: 'var(--primary-glow)', borderRadius: '12px', color: 'var(--primary)' }}>
            <Hourglass size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--on-surface)' }}>The Waiting Game</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-mute)', margin: 0 }}>Average time to reply to each other</p>
          </div>
        </div>
        <button
          className="export-btn"
          onClick={() => exportToPng('response-card', 'whatswrap-response-time')}
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

      <div id="response-card" className="m3-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {[u1, u2].map((u, i) => {
            const avg = i === 0 ? avg1 : avg2;
            const isFastest = u === fastest;
            return (
              <div key={u} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '16px',
                background: isFastest ? 'var(--primary-glow)' : 'var(--bg-overlay)',
                border: `1px solid ${isFastest ? 'var(--primary)' : 'var(--card-border)'}`,
                borderRadius: '16px',
                transition: 'transform 0.2s',
              }} className="hover-lift">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: isFastest ? 'var(--primary)' : 'var(--surface-sunken)',
                    color: isFastest ? '#fff' : 'var(--on-surface-mute)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {isFastest ? <Zap size={18} /> : <Clock size={18} />}
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--on-surface)' }}>{u}</div>
                    <div style={{ fontSize: '0.75rem', color: isFastest ? 'var(--primary)' : 'var(--on-surface-mute)', fontWeight: 500 }}>
                      {isFastest ? 'Speed Demon ⚡' : 'Takes their time ☕'}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--on-surface)', fontFamily: 'var(--font-heading)' }}>
                    {formatTime(avg)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--on-surface-mute)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                    Avg Response
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
