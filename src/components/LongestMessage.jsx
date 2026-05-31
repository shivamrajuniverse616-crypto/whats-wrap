import React, { useState } from 'react';
import { MessageSquareText, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { exportToPng } from '../utils/exporter';

export default function LongestMessage({ data }) {
  const { chatters, userStats } = data;
  const [u1, u2] = chatters;

  const [expanded, setExpanded] = useState({
    [u1]: false,
    [u2]: false,
  });

  const toggleExpand = (user) => {
    setExpanded(prev => ({ ...prev, [user]: !prev[user] }));
  };

  const renderMessageCard = (user, colorClass, bubbleBg, textClr, isSelf) => {
    const stats = userStats[user];
    const msg = stats.longestMsgContent || '';
    const wordCount = stats.longestMsgWords || 0;
    const charCount = stats.longestMsgLength || 0;
    const isExpanded = expanded[user];

    if (!msg) return null;

    // Truncate preview
    const previewLength = 220;
    const shouldTruncate = msg.length > previewLength;
    const displayMsg = (!isExpanded && shouldTruncate) 
      ? msg.slice(0, previewLength) + '...' 
      : msg;

    return (
      <div 
        key={user}
        id={`longest-msg-${user.replace(/\s+/g, '-')}`}
        className="m3-card hover-lift"
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          background: 'var(--bg-surface)',
          border: '1px solid var(--card-border)',
        }}
      >
        {/* User Card Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{
              fontSize: '0.62rem', fontWeight: 700,
              color: 'var(--on-surface-mute)', textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}>
              Longest Message Sent By
            </span>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.2rem', fontWeight: 800,
              color: 'var(--on-surface)', marginTop: 2,
            }}>
              {user}
            </h4>
          </div>

          <button
            className="export-btn"
            onClick={() => {
              // Custom export with temporary DOM expansion
              const elementId = `longest-msg-${user.replace(/\s+/g, '-')}`;
              const element = document.getElementById(elementId);
              const contentBox = element?.querySelector('.collapsible-content');
              const buttonRow = element?.querySelector('.toggle-btn-row');
              
              let originalMaxHeight = '';
              let originalDisplay = '';
              if (contentBox) {
                originalMaxHeight = contentBox.style.maxHeight;
                contentBox.style.maxHeight = 'none';
              }
              if (buttonRow) {
                originalDisplay = buttonRow.style.display;
                buttonRow.style.display = 'none';
              }

              exportToPng(elementId, `whatswrap-longest-msg-${user.toLowerCase()}`).then(() => {
                if (contentBox) contentBox.style.maxHeight = originalMaxHeight;
                if (buttonRow) buttonRow.style.display = originalDisplay;
              });
            }}
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

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--on-surface-dim)', fontWeight: 500 }}>
          <span>📝 <strong>{wordCount}</strong> words</span>
          <span>🔤 <strong>{charCount}</strong> characters</span>
        </div>

        {/* Premium Realistic WhatsApp Style Bubble Frame */}
        <div 
          className="whatsapp-pattern-bg"
          style={{
            background: 'var(--bg-base)',
            borderRadius: 16,
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            border: '1px solid var(--card-border)',
            overflow: 'hidden',
          }}
        >
          {/* Decorative WhatsApp Doodle / Grid pattern overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            opacity: 0.04,
            backgroundImage: `radial-gradient(var(--primary) 1.5px, transparent 1.5px)`,
            backgroundSize: '16px 16px',
            pointerEvents: 'none',
          }} />

          {/* Bubble wrapper */}
          <div style={{
            display: 'flex',
            justifyContent: isSelf ? 'flex-end' : 'flex-start',
            width: '100%',
            position: 'relative',
            zIndex: 1,
          }}>
            {/* The WhatsApp bubble itself */}
            <div 
              style={{
                background: bubbleBg,
                color: textClr,
                padding: '12px 16px 8px',
                borderRadius: isSelf ? '16px 2px 16px 16px' : '2px 16px 16px 16px',
                maxWidth: '85%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(0, 78, 100, 0.06)',
                position: 'relative',
              }}
            >
              {/* Message text */}
              <div 
                className="collapsible-content"
                style={{
                  fontSize: '0.86rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'var(--font-body)',
                  maxHeight: isExpanded ? 'none' : '240px',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease',
                }}
              >
                {displayMsg}
              </div>

              {/* Timestamp */}
              <div style={{
                fontSize: '0.62rem',
                color: isSelf ? 'rgba(0, 78, 100, 0.6)' : 'var(--on-surface-mute)',
                textAlign: 'right',
                marginTop: 6,
                fontWeight: 500,
              }}>
                Longest Text · 11:11 PM
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Button Row */}
        {shouldTruncate && (
          <div className="toggle-btn-row" style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => toggleExpand(user)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'transparent', border: 'none',
                color: 'var(--primary)', fontSize: '0.78rem',
                fontWeight: 700, cursor: 'pointer',
                padding: '4px 12px',
              }}
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={14} />
                  <span>Collapse Message</span>
                </>
              ) : (
                <>
                  <ChevronDown size={14} />
                  <span>Read Full Message ({msg.length - previewLength} more chars)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="anim-fade-up">
      {/* Section Header */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-header">
          <div className="section-icon" style={{ background: 'rgba(0,168,150,0.12)' }}>
            <MessageSquareText size={15} color="var(--tertiary)" />
          </div>
          <span className="section-title">Longest Messages</span>
        </div>
        <p className="section-subtitle" style={{ paddingLeft: 38 }}>
          The ultimate scroll-inducing texts that dominated the chat
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 20,
      }}>
        {/* Card for User 1 - styled like a light green sent bubble */}
        {renderMessageCard(u1, 'emerald', 'rgba(144, 224, 239, 0.16)', 'var(--on-surface)', true)}

        {/* Card for User 2 - styled like a cool blue/white received bubble */}
        {renderMessageCard(u2, 'cyan', 'var(--bg-surface-2)', 'var(--on-surface)', false)}
      </div>
    </div>
  );
}
