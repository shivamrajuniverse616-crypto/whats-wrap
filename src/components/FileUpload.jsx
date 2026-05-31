import React, { useState, useRef } from 'react';
import { Upload, FileText, FolderArchive, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import JSZip from 'jszip';

export default function FileUpload({ onDataParsed }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileDetails, setFileDetails] = useState(null);

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const processFile = async (file) => {
    setLoading(true);
    setError('');
    setFileDetails({ name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + ' MB' });

    try {
      let rawText = '';

      if (file.name.endsWith('.zip')) {
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(file);
        const txtFileKey = Object.keys(loadedZip.files).find(
          k => k.endsWith('.txt') && !k.includes('__MACOSX')
        );
        if (!txtFileKey) throw new Error('No .txt chat file found inside the ZIP. Please export without media.');
        rawText = await loadedZip.files[txtFileKey].async('text');
      } else if (file.name.endsWith('.txt')) {
        rawText = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target.result);
          reader.onerror = () => reject(new Error('Failed to read the .txt file.'));
          reader.readAsText(file);
        });
      } else {
        throw new Error('Unsupported format. Please upload a WhatsApp .txt or .zip export.');
      }

      if (!rawText?.trim()) throw new Error('The chat file appears to be empty.');

      setTimeout(() => {
        onDataParsed(rawText, file.name);
        setLoading(false);
      }, 1200);
    } catch (err) {
      setError(err.message || 'An error occurred while parsing the file.');
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`upload-zone${isDragActive ? ' drag-active' : ''}`}
        style={{ padding: '48px 32px', cursor: 'pointer' }}
      >
        {/* Decorative orb */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.zip"
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        {loading ? (
          /* Loading state */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', width: 64, height: 64 }}>
              <div style={{
                width: 64, height: 64,
                border: '3px solid var(--bg-surface-3)',
                borderTop: '3px solid var(--primary)',
                borderRadius: '50%',
              }} className="anim-spin" />
              <Sparkles size={20} color="var(--primary)" style={{
                position: 'absolute', inset: 0, margin: 'auto',
              }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem', fontWeight: 700,
                color: 'var(--on-surface)', marginBottom: 6,
              }}>
                Analyzing your chemistry...
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--on-surface-mute)' }}>
                {fileDetails?.name} ({fileDetails?.size})
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--primary)', marginTop: 8 }}>
                Building streaks, awards & personalities...
              </div>
            </div>
          </div>
        ) : (
          /* Default state */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, position: 'relative' }}>
            {/* Upload icon circle */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--bg-surface-3)',
              border: '1px solid var(--card-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s',
            }}>
              <Upload size={28} color={isDragActive ? 'var(--primary)' : 'var(--on-surface-mute)'} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem', fontWeight: 800,
                color: 'var(--on-surface)',
                marginBottom: 8, letterSpacing: '-0.02em',
              }}>
                {isDragActive ? 'Drop it right here!' : 'Upload Your Chat Export'}
              </h3>
              <p style={{
                color: 'var(--on-surface-mute)', fontSize: '0.82rem',
                lineHeight: 1.6, maxWidth: 380,
              }}>
                Drag &amp; drop your WhatsApp{' '}
                <strong style={{ color: 'var(--on-surface-dim)' }}>.txt</strong> or{' '}
                <strong style={{ color: 'var(--on-surface-dim)' }}>.zip</strong> export here,
                or click to browse your files.
              </p>
            </div>

            {/* Format badges */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { Icon: FileText, color: '#38bdf8', label: '.txt export' },
                { Icon: FolderArchive, color: '#fbbf24', label: '.zip export' },
              ].map(({ Icon, color, label }) => (
                <div key={label} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px',
                  background: 'var(--bg-surface-3)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 999,
                  fontSize: '0.75rem', fontWeight: 600,
                  color: 'var(--on-surface-dim)',
                }}>
                  <Icon size={13} color={color} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: 16,
          padding: '14px 16px',
          background: 'rgba(248,113,113,0.07)',
          border: '1px solid rgba(248,113,113,0.2)',
          borderRadius: 12,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }} className="anim-fade-up">
          <AlertCircle size={16} color="var(--error)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--error)', marginBottom: 2 }}>
              Parsing Failed
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--on-surface-dim)' }}>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* How to export guide */}
      <div style={{
        marginTop: 20, padding: '14px 16px',
        background: 'var(--bg-overlay)',
        border: '1px solid var(--card-border)',
        borderRadius: 12,
      }}>
        <div style={{
          fontSize: '0.62rem', fontWeight: 700,
          color: 'var(--on-surface-mute)', textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: 8,
        }}>
          How to export from WhatsApp
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            'Open the chat → tap ⋮ menu (Android) or contact name (iOS)',
            'Select "Export Chat" → choose "Without Media"',
            'Share the .txt or .zip file to this page',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'var(--primary-glow)',
                border: '1px solid rgba(167,139,250,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.6rem', fontWeight: 800, color: 'var(--primary)',
                flexShrink: 0, marginTop: 1,
              }}>
                {i + 1}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-dim)', lineHeight: 1.5 }}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
