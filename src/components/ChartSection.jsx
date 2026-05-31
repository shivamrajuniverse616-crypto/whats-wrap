import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import { BarChart3, Clock, TrendingUp } from 'lucide-react';

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip-box">
      <div className="chart-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="chart-tooltip-value" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  );
};

/* ── Section Card ── */
function ChartCard({ title, subtitle, icon: Icon, iconColor, children }) {
  return (
    <div className="m3-card" style={{ padding: '24px' }}>
      <div style={{ marginBottom: 20 }}>
        <div className="section-header">
          <div className="section-icon" style={{ background: `${iconColor}18` }}>
            <Icon size={15} color={iconColor} />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--on-surface)' }}>
            {title}
          </span>
        </div>
        {subtitle && (
          <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-mute)', paddingLeft: 38, marginTop: 2 }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function ChartSection({ data }) {
  const { userStats, chatters, hourlyDistribution, weekdayDistribution, monthlyCapsules } = data;
  const [u1, u2] = chatters;

  /* ── Words comparison data ── */
  const wordData = [
    { name: u1, words: userStats[u1].wordsCount, msgs: userStats[u1].messagesCount },
    { name: u2, words: userStats[u2].wordsCount, msgs: userStats[u2].messagesCount },
  ];

  /* ── Avg message length data ── */
  const len1 = Math.round(userStats[u1].charsCount / (userStats[u1].messagesCount || 1));
  const len2 = Math.round(userStats[u2].charsCount / (userStats[u2].messagesCount || 1));
  const lenData = [
    { name: u1, chars: len1 },
    { name: u2, chars: len2 },
  ];

  /* ── Monthly trend from capsules ── */
  const monthlyData = (monthlyCapsules || []).map(c => ({
    month: c.monthName?.slice(0, 3) ?? c.key,
    messages: c.totalMessages ?? 0,
  }));

  /* ── Hourly bar data ── */
  const hourlyData = Array.from({ length: 24 }, (_, h) => ({
    hour: h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`,
    activity: hourlyDistribution[h] || 0,
  }));

  /* ── Heatmap ── */
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getCellWeight = (dayIdx, hourIdx) => {
    const hw = hourlyDistribution[hourIdx] || 0;
    const dw = weekdayDistribution[dayIdx] || 0;
    return (hw * dw) / 100;
  };

  let maxWeight = 0;
  for (let d = 0; d < 7; d++)
    for (let h = 0; h < 24; h++) {
      const w = getCellWeight(d, h);
      if (w > maxWeight) maxWeight = w;
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
    <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Section header */}
      <div>
        <div className="section-header">
          <div className="section-icon" style={{ background: 'rgba(56,189,248,0.12)' }}>
            <BarChart3 size={15} color="var(--secondary)" />
          </div>
          <span className="section-title">Charts &amp; Analytics</span>
        </div>
        <p className="section-subtitle" style={{ paddingLeft: 38 }}>Visual breakdown of your chat patterns</p>
      </div>

      {/* Row 1: Words + Avg Length */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16,
      }}>
        {/* Words by User */}
        <ChartCard title="Words Sent" subtitle="Total words per person" icon={BarChart3} iconColor="var(--tertiary)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={wordData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--on-surface-dim)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--on-surface-mute)' }} axisLine={false} tickLine={false} width={50}
                tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="words" name="Words" radius={[6, 6, 0, 0]}
                fill="url(#emeraldGrad)" />
              <defs>
                <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00b4d8" />
                  <stop offset="100%" stopColor="#0077b6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Avg Message Length */}
        <ChartCard title="Avg. Message Length" subtitle="Characters per message" icon={BarChart3} iconColor="var(--pink-accent)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={lenData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--on-surface-dim)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--on-surface-mute)' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="chars" name="Chars" radius={[6, 6, 0, 0]} fill="url(#pinkGrad)" />
              <defs>
                <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f72585" />
                  <stop offset="100%" stopColor="#b5179e" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Monthly Trend */}
      {monthlyData.length > 0 && (
        <ChartCard title="Monthly Trend" subtitle="Messages exchanged per month" icon={TrendingUp} iconColor="var(--primary)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--on-surface-dim)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--on-surface-mute)' }} axisLine={false} tickLine={false} width={50}
                tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="messages" name="Messages"
                stroke="var(--primary)" strokeWidth={2.5}
                dot={{ fill: 'var(--primary)', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: 'var(--primary)', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Hourly Activity Bar */}
      <ChartCard title="Hourly Activity" subtitle="When you text the most throughout the day" icon={Clock} iconColor="var(--secondary)">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={hourlyData} barCategoryGap="15%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'var(--on-surface-mute)' }} axisLine={false} tickLine={false}
              interval={2} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="activity" name="Activity %" radius={[4, 4, 0, 0]} fill="url(#skyGrad)" />
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#90e0ef" />
                <stop offset="100%" stopColor="#00b4d8" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Heatmap */}
      <ChartCard title="Chat Heatmap" subtitle="Message density by day & hour — darker = more active" icon={Clock} iconColor="var(--primary)">
        <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
          <div style={{ minWidth: 600 }}>
            {/* Hour labels */}
            <div className="heatmap-grid" style={{ marginBottom: 4 }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--on-surface-mute)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                DAY
              </div>
              {hours.map(h => (
                <div key={h} style={{
                  fontSize: '0.6rem', color: 'var(--on-surface-mute)',
                  textAlign: 'center', fontWeight: 600,
                }}>
                  {h === 0 ? '12a' : h === 12 ? '12p' : h % 12}
                </div>
              ))}
            </div>

            {weekDays.map((day, dIdx) => (
              <div key={day} className="heatmap-grid" style={{ marginBottom: 3 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--on-surface-dim)', fontWeight: 600 }}>
                  {day}
                </div>
                {hours.map(hIdx => {
                  const w = getCellWeight(dIdx, hIdx);
                  return (
                    <div
                      key={hIdx}
                      className={`heatmap-cell ${heatClass(w)}`}
                      title={`${day} @ ${hIdx}:00`}
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
          gap: 8, marginTop: 12,
          fontSize: '0.65rem', fontWeight: 600,
          color: 'var(--on-surface-mute)', textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          <span>Less</span>
          {['hc-0', 'hc-1', 'hc-2', 'hc-3', 'hc-4'].map(c => (
            <div key={c} className={`heatmap-cell ${c}`} style={{ width: 14, height: 14, borderRadius: 3, flexShrink: 0 }} />
          ))}
          <span>More</span>
        </div>
      </ChartCard>
    </div>
  );
}
