import React from 'react';
import { BookOpen, Type, Download } from 'lucide-react';
import { exportToPng } from '../utils/exporter';

export default function TexterTypology({ data }) {
  const { chatters, userStats } = data;
  const [u1, u2] = chatters;
  const s1 = userStats[u1].msgLengthBuckets;
  const s2 = userStats[u2].msgLengthBuckets;

  const total1 = (s1.short || 0) + (s1.medium || 0) + (s1.long || 0) + (s1.novel || 0) || 1;
  const total2 = (s2.short || 0) + (s2.medium || 0) + (s2.long || 0) + (s2.novel || 0) || 1;

  const labels = [
    { key: 'short', name: 'One-Worder', color: 'var(--primary)' },
    { key: 'medium', name: 'Short (2-5)', color: 'var(--secondary)' },
    { key: 'long', name: 'Paragraph', color: 'var(--tertiary)' },
    { key: 'novel', name: 'The Novel', color: 'var(--on-surface-mute)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', background: 'var(--bg-overlay)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--on-surface)' }}>
            <BookOpen size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--on-surface)' }}>Texter Typology</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-mute)', margin: 0 }}>Message length breakdown</p>
          </div>
        </div>
        <button
          className="export-btn"
          onClick={() => exportToPng('typology-card', 'whatswrap-typology')}
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

      <div id="typology-card" className="m3-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {[u1, u2].map((u, idx) => {
            const stats = idx === 0 ? s1 : s2;
            const total = idx === 0 ? total1 : total2;
            
            return (
              <div key={u} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--on-surface)', fontFamily: 'var(--font-heading)' }}>
                  {u}
                </div>
                
                <div style={{ display: 'flex', width: '100%', height: '24px', borderRadius: '999px', overflow: 'hidden', gap: '2px' }}>
                  {labels.map(l => {
                    const count = stats[l.key] || 0;
                    const percent = (count / total) * 100;
                    if (percent === 0) return null;
                    return (
                      <div key={l.key} style={{ 
                        width: `${percent}%`, 
                        background: l.color,
                        height: '100%',
                        transition: 'width 0.5s ease'
                      }} title={`${l.name}: ${count}`} />
                    );
                  })}
                </div>
                
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {labels.map(l => {
                     const count = stats[l.key] || 0;
                     const percent = Math.round((count / total) * 100);
                     return (
                       <div key={l.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--on-surface-mute)' }}>
                         <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                         {l.name} ({percent}%)
                       </div>
                     );
                  })}
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
