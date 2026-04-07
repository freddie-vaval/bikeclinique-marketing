'use client';

import { useState } from 'react';

const PRICES = {
  frame: { steel: 650, carbon: 1400, titanium: 2800 },
  groupset: { 'grx-400': 450, 'grx-600': 620, 'grx-800': 900, 'grx-di2': 1350, 'sram-rival': 700, 'sram-force': 1100, 'sram-apex': 480 },
  wheels: { alloy: 350, carbon: 650 },
  build: { standard: 400, complex: 650 },
};

export default function BuildQuotePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    riding: '',
    terrain: '',
    budget: '',
    frame: '',
    groupset: '',
    wheels: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function update(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function estimate(): number {
    let total = 0;
    if (form.frame) total += PRICES.frame[form.frame as keyof typeof PRICES.frame] || 0;
    if (form.groupset) total += PRICES.groupset[form.groupset as keyof typeof PRICES.groupset] || 0;
    if (form.wheels) total += PRICES.wheels[form.wheels as keyof typeof PRICES.wheels] || 0;
    total += form.groupset === 'grx-di2' || form.groupset?.includes('sram-force') ? PRICES.build.complex : PRICES.build.standard;
    return total;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: 500, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Request Received</h1>
          <p style={{ color: '#888', marginBottom: 24, lineHeight: 1.6 }}>
            We've got your custom build request. Fred will review your specification and come back to you with a detailed quote — usually within 24 hours.
          </p>
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: 16, padding: 24, textAlign: 'left' }}>
            <p style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>YOUR ESTIMATE</p>
            <p style={{ color: '#ff6b35', fontSize: 32, fontWeight: 800 }}>£{estimate().toLocaleString()}</p>
            <p style={{ color: '#555', fontSize: 13, marginTop: 8 }}>This is a guide estimate. Final quote may vary based on exact specification.</p>
          </div>
          <p style={{ color: '#444', fontSize: 13, marginTop: 24 }}>
            Check your email — we'll send confirmation there. Questions? Text Fred directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: '-apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 0' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>
            Bike<span style={{ color: '#ff6b35' }}>Clinique</span>
          </div>
          <div style={{ fontSize: 13, color: '#666' }}>Custom Build Calculator</div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: step >= s ? '#ff6b35' : '#222'
            }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Tell us about your riding</h1>
            <p style={{ color: '#666', marginBottom: 32 }}>Step 1 of 3 — Takes 30 seconds</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {[
                { key: 'riding', value: 'road', label: 'Road cycling', desc: 'Fast, long distances, tarmac focus' },
                { key: 'riding', value: 'gravel', label: 'Gravel & adventure', desc: 'Mixed terrain, paths, fire roads' },
                { key: 'riding', value: 'commute', label: 'Commuting', desc: 'Urban, all-weather, practicality' },
                { key: 'riding', value: 'mixed', label: 'Mixed everything', desc: 'I ride it all, no specific focus' },
              ].map(opt => (
                <button key={opt.value} onClick={() => { update('riding', opt.value); setTimeout(() => setStep(2), 300); }}
                  style={{
                    background: form.riding === opt.value ? 'rgba(255,107,53,0.15)' : '#111',
                    border: `1px solid ${form.riding === opt.value ? '#ff6b35' : '#333'}`,
                    borderRadius: 12, padding: '16px 20px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                  }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{opt.label}</div>
                  <div style={{ color: '#666', fontSize: 13, marginTop: 2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>What's your budget?</h1>
            <p style={{ color: '#666', marginBottom: 32 }}>Step 2 of 3 — This helps us prioritise recommendations</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {[
                { key: 'budget', value: '2000', label: '£2,000–£2,500', desc: 'Quality steel build. Gets you a proper bike.' },
                { key: 'budget', value: '3000', label: '£2,500–£3,500', desc: 'Steel or entry carbon. Very solid build.' },
                { key: 'budget', value: '5000', label: '£3,500–£5,000', desc: 'Carbon frame, GRX 800 or better.' },
                { key: 'budget', value: 'unlimited', label: '£5,000+', desc: 'No budget limit. Full dream build.' },
              ].map(opt => (
                <button key={opt.value} onClick={() => { update('budget', opt.value); setTimeout(() => setStep(3), 300); }}
                  style={{
                    background: form.budget === opt.value ? 'rgba(255,107,53,0.15)' : '#111',
                    border: `1px solid ${form.budget === opt.value ? '#ff6b35' : '#333'}`,
                    borderRadius: 12, padding: '16px 20px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                  }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{opt.label}</div>
                  <div style={{ color: '#666', fontSize: 13, marginTop: 2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>

            <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 14 }}>
              ← Back
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Your details</h1>
            <p style={{ color: '#666', marginBottom: 32 }}>Step 3 of 3 — Fred will respond within 24 hours</p>

            {form.budget && (
              <div style={{ background: '#111', border: '1px solid #333', borderRadius: 12, padding: 16, marginBottom: 24 }}>
                <div style={{ color: '#666', fontSize: 12, marginBottom: 4 }}>APPROXIMATE BUILD BUDGET</div>
                <div style={{ color: '#ff6b35', fontSize: 24, fontWeight: 800 }}>£{estimate().toLocaleString()}</div>
                <div style={{ color: '#555', fontSize: 12, marginTop: 4 }}>Guide estimate. Final quote based on exact specification.</div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ color: '#666', fontSize: 12, display: 'block', marginBottom: 6 }}>YOUR NAME</label>
                <input required value={form.name} onChange={e => update('name', e.target.value)}
                  style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }}
                  placeholder="Freddie" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ color: '#666', fontSize: 12, display: 'block', marginBottom: 6 }}>EMAIL</label>
                  <input required type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }}
                    placeholder="freddie@example.com" />
                </div>
                <div>
                  <label style={{ color: '#666', fontSize: 12, display: 'block', marginBottom: 6 }}>PHONE (optional)</label>
                  <input value={form.phone} onChange={e => update('phone', e.target.value)}
                    style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }}
                    placeholder="07xxx xxx xxx" />
                </div>
              </div>

              <div>
                <label style={{ color: '#666', fontSize: 12, display: 'block', marginBottom: 6 }}>TELL US MORE (optional)</label>
                <textarea value={form.message} onChange={e => update('message', e.target.value)}
                  rows={3}
                  style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 16, outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                  placeholder="e.g. I'm based in Balham, I ride road mostly but want to explore gravel. Looking to spend around £3k."
                />
              </div>

              <button type="submit" style={{
                background: '#ff6b35', border: 'none', borderRadius: 10, padding: '16px 32px',
                color: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 8
              }}>
                Get My Custom Build Quote →
              </button>
            </form>

            <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 14, marginTop: 16 }}>
              ← Back
            </button>
          </div>
        )}

        {/* Footer note */}
        <p style={{ color: '#333', fontSize: 12, marginTop: 40, textAlign: 'center' }}>
          No commitment. No spam. Fred reviews every request personally.
        </p>
      </div>
    </div>
  );
}
