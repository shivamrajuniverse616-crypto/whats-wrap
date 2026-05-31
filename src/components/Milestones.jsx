import React from 'react';
import { GitCommit, MessageSquare, Image, Heart, Flame, Award, Calendar, Sparkles, Download } from 'lucide-react';
import { exportToPng } from '../utils/exporter';

const ICON_MAP = {
  chat: MessageSquare,
  photo: Image,
  love: Heart,
  streak: Flame,
  volume: Award,
  busiest: Calendar,
};

const COLOR_MAP = {
  emerald: { line: '#00a896', bg: 'rgba(0,168,150,0.05)', border: 'rgba(0,168,150,0.18)', text: '#00a896' },
  cyan:    { line: '#00b4d8', bg: 'rgba(0,180,216,0.05)', border: 'rgba(0,180,216,0.18)', text: '#00b4d8' },
  purple:  { line: '#90e0ef', bg: 'rgba(144,224,239,0.05)', border: 'rgba(144,224,239,0.18)', text: '#90e0ef' },
  gold:    { line: '#ffb703', bg: 'rgba(255,183,3,0.05)', border: 'rgba(255,183,3,0.18)', text: '#ffb703' },
  pink:    { line: '#f72585', bg: 'rgba(247,37,133,0.05)', border: 'rgba(247,37,133,0.18)', text: '#f72585' },
  sunset:  { line: '#fb8500', bg: 'rgba(251,133,0,0.05)', border: 'rgba(251,133,0,0.18)', text: '#fb8500' },
};

export default function Milestones({ milestones }) {
  return (
    <div className="anim-fade-up" id="milestones-card">
      {/* Section header */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="section-icon" style={{ background: 'rgba(52,211,153,0.12)' }}>
              <GitCommit size={15} color="var(--tertiary)" />
            </div>
            <span className="section-title">Conversation Milestones</span>
          </div>
          <button
            className="export-btn"
            onClick={() => exportToPng('milestones-card', 'whatswrap-milestones')}
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
        <p className="section-subtitle" style={{ paddingLeft: 38 }}>The memorable moments in your chat history</p>
      </div>

      {/* Modern Glowing Timeline Grid */}
      <div style={{ 
        position: 'relative', 
        paddingLeft: 32, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 28 
      }}>
        {/* Continuous glowing vertical track */}
        <div style={{
          position: 'absolute',
          left: 11,
          top: 8,
          bottom: 8,
          width: 3,
          background: 'linear-gradient(180deg, var(--primary) 0%, var(--secondary) 50%, var(--tertiary) 100%)',
          borderRadius: 99,
          opacity: 0.25,
          boxShadow: '0 0 10px var(--primary-glow)',
        }} />

        {milestones.map((ms, idx) => {
          const Icon = ICON_MAP[ms.type] || Sparkles;
          const colors = COLOR_MAP[ms.colorClass] || COLOR_MAP.purple;
          const isLast = idx === milestones.length - 1;

          return (
            <div key={ms.id} style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
              {/* Timeline Indicator Ring */}
              <div style={{
                position: 'absolute',
                left: -32,
                top: 6,
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'var(--bg-surface-2)',
                border: `3.5px solid ${colors.line}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 14px ${colors.line}40, inset 0 2px 4px rgba(0,0,0,0.06)`,
                zIndex: 2,
              }}>
                <div style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: colors.line,
                }} />
              </div>

              {/* The Timeline Card */}
              <div 
                className="m3-card hover-lift" 
                style={{
                  flex: 1, 
                  padding: '20px 24px',
                  border: `1px solid ${colors.border}`,
                  background: `linear-gradient(145deg, var(--bg-surface-2) 0%, ${colors.bg} 100%)`,
                  borderRadius: 20,
                  boxShadow: `0 8px 30px rgba(0, 0, 0, 0.02), 0 1px 3px ${colors.border}`,
                }}
              >
                {/* Card Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Badge Icon */}
                    <div style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: `linear-gradient(135deg, ${colors.line}18 0%, ${colors.line}08 100%)`,
                      border: `1px solid ${colors.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={15} color={colors.text} />
                    </div>

                    <div>
                      <div style={{
                        fontSize: '0.62rem', fontWeight: 800,
                        color: colors.text,
                        textTransform: 'uppercase', letterSpacing: '0.12em',
                      }}>
                        {ms.title}
                      </div>
                      <h4 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.05rem', fontWeight: 800,
                        color: 'var(--on-surface)',
                        marginTop: 1,
                      }}>
                        {ms.subtitle}
                      </h4>
                    </div>
                  </div>

                  {/* Clean pill date */}
                  <div style={{
                    fontSize: '0.72rem', fontWeight: 700,
                    color: 'var(--on-surface-dim)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 999,
                    padding: '4px 12px',
                  }}>
                    {ms.date}
                  </div>
                </div>

                {/* Card Description */}
                {ms.desc && (
                  <p style={{ 
                    fontSize: '0.82rem', 
                    color: 'var(--on-surface-dim)', 
                    lineHeight: 1.6,
                    paddingLeft: 42,
                    fontStyle: ms.type === 'chat' || ms.type === 'love' ? 'italic' : 'normal',
                    borderLeft: `2.5px solid ${colors.border}`,
                    marginLeft: 15,
                    marginTop: 4,
                  }}>
                    {ms.desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
