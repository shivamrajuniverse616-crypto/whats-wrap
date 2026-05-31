import React from 'react';
import { MessageCircle, Type, Flame, Zap, Calendar, BarChart3, Download } from 'lucide-react';
import { exportToPng } from '../utils/exporter';

const STATS = (data) => {
  const { totalMessages, totalWords, maxStreak, avgMessagesPerDay, busiestDay, chatters, userStats } = data;
  const [u1, u2] = chatters;
  return [
    {
      label: 'Total Messages',
      value: totalMessages.toLocaleString(),
      sub: 'Messages exchanged',
      Icon: MessageCircle,
      gradient: 'var(--grad-primary)',
      glow: 'rgba(167,139,250,0.2)',
      textClass: 'gradient-text grad-primary-text',
    },
    {
      label: 'Lifetime Words',
      value: totalWords.toLocaleString(),
      sub: 'Words in your story',
      Icon: Type,
      gradient: 'var(--grad-secondary)',
      glow: 'rgba(56,189,248,0.18)',
      textClass: 'gradient-text grad-secondary-text',
    },
    {
      label: 'Longest Streak',
      value: `${maxStreak}d`,
      sub: 'Consecutive active days',
      Icon: Flame,
      gradient: 'var(--grad-sunset)',
      glow: 'rgba(251,146,60,0.2)',
      textClass: 'gradient-text grad-sunset-text',
    },
    {
      label: 'Daily Average',
      value: avgMessagesPerDay,
      sub: 'Messages per day',
      Icon: Zap,
      gradient: 'var(--grad-emerald)',
      glow: 'rgba(52,211,153,0.18)',
      textClass: 'gradient-text grad-emerald-text',
    },
    {
      label: 'Busiest Day',
      value: busiestDay.count.toLocaleString(),
      sub: busiestDay.date,
      Icon: Calendar,
      gradient: 'var(--grad-gold)',
      glow: 'rgba(251,191,36,0.18)',
      textClass: 'gradient-text grad-gold-text',
    },
  ];
};

export default function MetricGrid({ data }) {
  const { chatters, userStats, totalMessages } = data;
  const [u1, u2] = chatters;
  const stats = STATS(data);

  const totalM1 = userStats[u1].messagesCount;
  const totalM2 = userStats[u2].messagesCount;
  const share1 = Math.round((totalM1 / (totalMessages || 1)) * 100);
  const share2 = 100 - share1;

  return (
    <div className="anim-fade-up" id="overview-card">
      {/* Section header */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="section-icon" style={{ background: 'var(--primary-glow)' }}>
              <BarChart3 size={15} color="var(--primary)" />
            </div>
            <span className="section-title">Overview</span>
          </div>
          <button
            className="export-btn"
            onClick={() => exportToPng('overview-card', 'whatswrap-overview')}
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
        <p className="section-subtitle" style={{ paddingLeft: 38 }}>Your chat statistics at a glance</p>
      </div>

      {/* Stats grid */}
      <style>{`
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (min-width: 600px) {
          .overview-grid {
            grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
            gap: 14px;
          }
        }
      `}</style>
      <div className="overview-grid stagger">
        {stats.map(({ label, value, sub, Icon, gradient, glow, textClass }, idx) => (
          <div
            key={idx}
            className="m3-card hover-lift"
            style={{ padding: '20px 20px 18px' }}
          >
            {/* Icon */}
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
              boxShadow: `0 4px 16px ${glow}`,
            }}>
              <Icon size={18} color="#fff" />
            </div>

            {/* Label */}
            <div style={{
              fontSize: '0.65rem', fontWeight: 700,
              color: 'var(--on-surface-mute)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: 4,
            }}>
              {label}
            </div>

            {/* Value */}
            <div className={`${textClass} font-heading`} style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              marginBottom: 6,
            }}>
              {value}
            </div>

            {/* Sub */}
            <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-mute)', fontWeight: 400 }}>
              {sub}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Volume Share */}
      <div className="m3-card" style={{ padding: '24px 24px 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12, marginBottom: 16,
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--on-surface)', marginBottom: 2 }}>
              Chat Volume Share
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-mute)' }}>
              Total message distribution
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--on-surface-dim)' }}>
                {u1} ({share1}%)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--tertiary)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--on-surface-dim)' }}>
                {u2} ({share2}%)
              </span>
            </div>
          </div>
        </div>

        {/* Gradient bar */}
        <div style={{
          width: '100%', height: 10,
          background: 'var(--bg-surface-3)',
          borderRadius: 999, overflow: 'hidden',
          display: 'flex',
        }}>
          <div style={{
            width: `${share1}%`, height: '100%',
            background: 'var(--grad-primary)',
            borderRadius: '999px 0 0 999px',
            transition: 'width 1s var(--ease-out)',
            boxShadow: '0 0 12px rgba(167,139,250,0.4)',
          }} />
          <div style={{
            width: `${share2}%`, height: '100%',
            background: 'var(--grad-emerald)',
            borderRadius: '0 999px 999px 0',
            transition: 'width 1s var(--ease-out)',
            boxShadow: '0 0 12px rgba(52,211,153,0.3)',
          }} />
        </div>

        {/* Detail row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 16,
          marginTop: 20,
          paddingTop: 20,
          borderTop: '1px solid var(--card-border)',
        }}>
          {[
            { label: `${u1} Sent`, val: `${userStats[u1].messagesCount.toLocaleString()} msg` },
            { label: `${u2} Sent`, val: `${userStats[u2].messagesCount.toLocaleString()} msg` },
            { label: `${u1} Words`, val: userStats[u1].wordsCount.toLocaleString() },
            { label: `${u2} Words`, val: userStats[u2].wordsCount.toLocaleString() },
          ].map(({ label, val }) => (
            <div key={label}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--on-surface-mute)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--on-surface)', fontFamily: 'var(--font-heading)' }}>
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
