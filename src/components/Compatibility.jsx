import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { HeartPulse, Zap, Palette, Clock, Scale, Sparkles, Moon, Users, Heart, Download } from 'lucide-react';
import { exportToPng } from '../utils/exporter';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip-box">
      <div className="chart-tooltip-value" style={{ color: payload[0].fill }}>
        {payload[0].value}%
      </div>
    </div>
  );
};

export default function Compatibility({ compatibility, chatters }) {
  const { score, tag, icon, replySync, emojiStyleMatch, overlapPercent, balance } = compatibility;
  const [u1, u2] = chatters;

  const gaugeData = [{ value: score, fill: 'url(#gaugeGrad)' }];

  const categories = [
    { label: 'Reply Speed Sync', value: replySync, Icon: Zap, colorClass: 'compat-cat-amber' },
    { label: 'Emoji Style Match', value: emojiStyleMatch, Icon: Palette, colorClass: 'compat-cat-pink' },
    { label: 'Active Hours Overlap', value: overlapPercent, Icon: Clock, colorClass: 'compat-cat-blue' },
    { label: 'Conversation Balance', value: balance, Icon: Scale, colorClass: 'compat-cat-purple' },
  ];

  // Map scores to beautiful vector icons
  let DisplayIcon = Users;
  let iconColor = 'var(--primary)';
  if (score >= 90) {
    DisplayIcon = Heart;
    iconColor = 'var(--pink-accent)';
  } else if (score >= 80) {
    DisplayIcon = Moon;
    iconColor = 'var(--secondary)';
  } else if (score >= 70) {
    DisplayIcon = Zap;
    iconColor = 'var(--orange-accent)';
  } else {
    DisplayIcon = Scale;
    iconColor = 'var(--tertiary)';
  }

  return (
    <div className="anim-fade-up" id="compatibility-card">
      {/* Section header */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="section-icon" style={{ background: 'rgba(244,114,182,0.12)' }}>
              <HeartPulse size={15} color="var(--pink-accent)" />
            </div>
            <span className="section-title">Compatibility Report</span>
          </div>
          <button
            className="export-btn"
            onClick={() => exportToPng('compatibility-card', 'whatswrap-compatibility')}
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
        <p className="section-subtitle" style={{ paddingLeft: 38 }}>How well do you two vibe together?</p>
      </div>

      <div className="m3-card" style={{ padding: '32px 28px' }}>
        {/* Cert label */}
        <div style={{
          fontSize: '0.62rem', fontWeight: 700,
          color: 'var(--on-surface-mute)', textTransform: 'uppercase',
          letterSpacing: '0.14em', textAlign: 'center', marginBottom: 24,
        }}>
          Compatibility Certificate · {u1} &amp; {u2}
        </div>

        {/* Radial gauge */}
        <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 24px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%" cy="50%"
              innerRadius="70%" outerRadius="100%"
              startAngle={225} endAngle={-45}
              data={gaugeData}
              barSize={18}
            >
              <defs>
                <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00b4d8" />
                  <stop offset="50%" stopColor="#90e0ef" />
                  <stop offset="100%" stopColor="#ffb703" />
                </linearGradient>
              </defs>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                background={{ fill: 'var(--bg-surface-3)' }}
                angleAxisId={0}
              />
            </RadialBarChart>
          </ResponsiveContainer>
 
          {/* Score overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.5rem', fontWeight: 900,
              color: 'var(--on-surface)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}>
              {score}
            </span>
            <span style={{
              fontSize: '0.65rem', fontWeight: 700,
              color: 'var(--on-surface-mute)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              / 100
            </span>
          </div>
        </div>
 
        {/* Tag banner */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          background: 'var(--warning-glow)',
          border: '1px solid rgba(223, 167, 93, 0.2)',
          borderRadius: 14, padding: '12px 20px',
          marginBottom: 28, maxWidth: 450, margin: '0 auto 28px',
        }}>
          <DisplayIcon size={18} color={iconColor} style={{ flexShrink: 0 }} />
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800, fontSize: '0.9rem',
            color: 'var(--on-surface)',
          }}>
            {tag}
          </span>
        </div>

        {/* Sub-score grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          maxWidth: 600, margin: '0 auto',
        }}>
          {categories.map(({ label, value, Icon, colorClass }) => (
            <div
              key={label}
              className={`m3-card ${colorClass}`}
              style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: 'var(--bg-surface-3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={16} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--on-surface-dim)' }}>
                  {label}
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem', fontWeight: 900,
                color: 'var(--on-surface)',
                flexShrink: 0, marginLeft: 8,
              }}>
                {value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
