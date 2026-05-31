import React from 'react';
import { Link2, ExternalLink, Download } from 'lucide-react';
import { exportToPng } from '../utils/exporter';

export default function MediaDiet({ data }) {
  const { chatters, userStats } = data;
  
  // Aggregate domains globally
  const globalDomains = {};
  chatters.forEach(u => {
    Object.entries(userStats[u].linkDomains || {}).forEach(([domain, count]) => {
      globalDomains[domain] = (globalDomains[domain] || 0) + count;
    });
  });

  const sortedDomains = Object.entries(globalDomains)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // top 5

  if (sortedDomains.length === 0) return null;

  const totalLinks = sortedDomains.reduce((sum, [_, cnt]) => sum + cnt, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', background: 'var(--secondary-glow)', borderRadius: '12px', color: 'var(--secondary)' }}>
            <Link2 size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--on-surface)' }}>The Media Diet</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-mute)', margin: 0 }}>Top websites & apps you share</p>
          </div>
        </div>
        <button
          className="export-btn"
          onClick={() => exportToPng('media-diet-card', 'whatswrap-media-diet')}
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

      <div id="media-diet-card" className="m3-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sortedDomains.map(([domain, count], index) => {
            const percentage = Math.round((count / totalLinks) * 100);
            return (
              <div key={domain} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--on-surface)', fontFamily: 'var(--font-heading)' }}>
                      {index + 1}. {domain}
                    </span>
                    <ExternalLink size={14} color="var(--on-surface-mute)" style={{ opacity: 0.5 }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary)' }}>
                    {count} links
                  </span>
                </div>
                
                <div style={{ width: '100%', height: '8px', background: 'var(--surface-sunken)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: 'var(--secondary)',
                    borderRadius: '999px',
                    opacity: 0.9 - (index * 0.15) // fades out slightly for lower ranks
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
