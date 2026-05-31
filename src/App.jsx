import React from 'react';
import FileUpload from './components/FileUpload';
import DashboardHeader from './components/DashboardHeader';
import MetricGrid from './components/MetricGrid';
import TimeCapsule from './components/TimeCapsule';
import UniverseAwards from './components/UniverseAwards';
import Personalities from './components/Personalities';
import LongestMessage from './components/LongestMessage';
import Compatibility from './components/Compatibility';
import ChartSection from './components/ChartSection';
import Milestones from './components/Milestones';
import SideNav from './components/SideNav';

import { parseChat } from './utils/chatParser';
import { analyzeChat } from './utils/chatAnalyzer';
import { Sparkles, MessageCircle, Heart, ShieldCheck } from 'lucide-react';

export default function App() {
  const [chatData, setChatData] = React.useState(null);

  const handleDataParsed = (rawText, fileName = 'chat.txt') => {
    try {
      const parsed = parseChat(rawText);
      if (!parsed.messages || parsed.messages.length === 0) {
        alert("We couldn't detect any valid chat messages. Please check the text file format.");
        return;
      }
      const analyzed = analyzeChat(parsed.messages, parsed.participants);
      if (!analyzed) {
        alert("Failed to analyze the chat statistics. Ensure the file contains personal dialogue.");
        return;
      }
      setChatData(analyzed);
    } catch (err) {
      console.error(err);
      alert("An error occurred while analyzing the chat data. Please ensure it's a valid WhatsApp log export.");
    }
  };

  const handleReset = () => setChatData(null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Ambient background glows */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '15%', left: '5%',
          width: '40vw', height: '40vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,180,216,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '5%',
          width: '35vw', height: '35vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,78,100,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      {!chatData ? (
        /* ── LANDING / FILE UPLOAD SCREEN ── */
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh',
          padding: '40px 24px',
          position: 'relative', zIndex: 1,
        }} className="anim-fade-up">

          {/* Hero badges (Open Source + Version) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 32,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {/* Open Source Pill */}
            <a 
              href="https://github.com/gtxPrime/whats-wrap"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-scale"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'var(--bg-overlay)',
                border: '1px solid var(--card-border)',
                borderRadius: 999,
                padding: '6px 14px',
                fontSize: '0.7rem', fontWeight: 600,
                color: 'var(--on-surface-dim)',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span>Open Source on GitHub</span>
            </a>

            {/* Premium Sparkle tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--primary-glow)',
              border: '1px solid rgba(0, 180, 216, 0.2)',
              borderRadius: 999,
              padding: '6px 16px',
            }}>
              <Sparkles size={14} color="var(--primary)" />
              <span style={{
                fontSize: '0.7rem', fontWeight: 700,
                color: 'var(--primary)',
                textTransform: 'uppercase', letterSpacing: '0.12em',
                fontFamily: 'var(--font-heading)',
              }}>
                WhatsWrap 2026
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            fontWeight: 900,
            textAlign: 'center',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: 20,
            maxWidth: 700,
          }}>
            Unwrap Your{' '}
            <span className="gradient-text grad-aurora-text">
              WhatsApp Story
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            color: 'var(--on-surface-dim)',
            fontSize: '1rem',
            maxWidth: 520,
            textAlign: 'center',
            lineHeight: 1.7,
            marginBottom: 48,
          }}>
            Transform your exported chats into a jaw-dropping annual recap —
            streaks, awards, personalities, compatibility scores &amp; beautiful charts.
            100% private, runs in your browser.
          </p>

          {/* Feature pills */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 10,
            justifyContent: 'center', marginBottom: 48,
          }}>
            {['Chat Streaks', 'Universe Awards', 'Personality Report', 'Compatibility Score', 'Interactive Charts', 'Time Capsules'].map(f => (
              <div key={f} style={{
                display: 'inline-flex', alignItems: 'center',
                gap: 6, padding: '5px 12px',
                background: 'var(--bg-overlay)',
                border: '1px solid var(--card-border)',
                borderRadius: 999,
                fontSize: '0.75rem', fontWeight: 500,
                color: 'var(--on-surface-dim)',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                {f}
              </div>
            ))}
          </div>

          {/* Upload */}
          <div style={{ width: '100%', maxWidth: 560 }}>
            <FileUpload onDataParsed={handleDataParsed} />
          </div>

          {/* Privacy notice */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginTop: 32, color: 'var(--on-surface-mute)',
            fontSize: '0.75rem', maxWidth: 440, textAlign: 'center',
          }}>
            <ShieldCheck size={15} color="var(--tertiary)" style={{ flexShrink: 0 }} />
            <span>
              <strong style={{ color: 'var(--on-surface-dim)' }}>100% Client-Side.</strong>{' '}
              Your chats never leave your device. Nothing is uploaded or stored.
            </span>
          </div>
        </div>
      ) : (
        /* ── DASHBOARD SCREEN ── */
        <div className="app-shell">
          <SideNav
            onReset={handleReset}
            chatters={chatData.chatters}
            streak={chatData.maxStreak}
          />

          <main className="app-main" style={{ position: 'relative', zIndex: 1 }}>
            <DashboardHeader
              chatters={chatData.chatters}
              onReset={handleReset}
            />

            {/* All sections rendered one below each other */}
            <div style={{ padding: '0 32px 64px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>

              <section id="overview" className="dashboard-section" style={{ paddingTop: 16 }}>
                <MetricGrid data={chatData} />
              </section>

              <div style={{ height: 56 }} />

              <section id="capsule" className="dashboard-section">
                <TimeCapsule capsules={chatData.monthlyCapsules} />
              </section>

              <div style={{ height: 56 }} />

              <section id="awards" className="dashboard-section">
                <UniverseAwards awards={chatData.awards} />
              </section>

              <div style={{ height: 56 }} />

              <section id="personalities" className="dashboard-section">
                <Personalities personalities={chatData.personalities} />
              </section>

              <div style={{ height: 56 }} />

              <section id="longest" className="dashboard-section">
                <LongestMessage data={chatData} />
              </section>

              <div style={{ height: 56 }} />

              <section id="compatibility" className="dashboard-section">
                <Compatibility compatibility={chatData.compatibility} chatters={chatData.chatters} />
              </section>

              <div style={{ height: 56 }} />

              <section id="milestones" className="dashboard-section">
                <Milestones milestones={chatData.milestones} />
                <div style={{ marginTop: 32 }}>
                  <ChartSection data={chatData} />
                </div>
              </section>
            </div>

            {/* Footer */}
            <footer style={{
              borderTop: '1px solid var(--card-border)',
              padding: '20px 32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: '0.72rem',
              color: 'var(--on-surface-mute)',
              fontWeight: 500,
              letterSpacing: '0.05em',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Heart size={11} color="#f87171" fill="#f87171" />
                <span>Made with WhatsWrap · 100% Private Client-Side</span>
              </div>
              <a 
                href="https://github.com/gtxPrime/whats-wrap"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  color: 'var(--primary)', 
                  textDecoration: 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 4 
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span>Source Code on GitHub</span>
              </a>
            </footer>
          </main>
        </div>
      )}
    </div>
  );
}
