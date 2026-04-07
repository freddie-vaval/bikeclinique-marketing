'use client';

import { useState } from 'react';

const PRICES = {
  frame: { steel: 650, carbon: 1400, titanium: 2800 },
  groupset: {
    'grx-400': { name: 'Shimano GRX 400', price: 450 },
    'grx-600': { name: 'Shimano GRX 600', price: 620 },
    'grx-800': { name: 'Shimano GRX 800', price: 900 },
    'grx-di2': { name: 'Shimano GRX 810 Di2 (Electronic)', price: 1350 },
    'sram-rival': { name: 'SRAM Rival', price: 700 },
    'sram-force': { name: 'SRAM Force AXS (Wireless)', price: 1100 },
    'sram-apex': { name: 'SRAM Apex', price: 480 },
  },
  wheels: {
    'alloy-hunt': { name: 'Hunt 30 Carbon Gravel (Alloy)', price: 380 },
    'alloy-fulcrum': { name: 'Fulcrum Rapid Red 900 (Alloy)', price: 420 },
    'carbon-hunt': { name: 'Hunt 30 Carbon Gravel (Carbon)', price: 550 },
    'carbon-dt': { name: 'DT Swiss Gravel 650B (Carbon)', price: 650 },
    'carbon-enve': { name: 'ENVE G23 (Carbon Premium)', price: 1200 },
  },
  build: { standard: 350, complex: 600 },
};

type FormData = {
  riding: string;
  terrain: string;
  budget: string;
  frame: string;
  groupset: string;
  wheels: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

function generateQuotePDF(form: FormData, total: number): void {
  // Simple text-based quote as a data URI (no external libraries needed)
  const quote = `BIKECLINIQUE — CUSTOM BUILD QUOTE
========================================

Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'})}

RIDER PROFILE
-------------
Name: ${form.name}
Email: ${form.email}
${form.phone ? `Phone: ${form.phone}` : ''}
Riding type: ${form.riding || 'Not specified'}
Terrain: ${form.terrain || 'Not specified'}
Budget: ${form.budget || 'Not specified'}

SPECIFICATION
-------------
Frame material: ${form.frame || 'Not selected'}
Groupset: ${form.groupset ? PRICES.groupset[form.groupset as keyof typeof PRICES.groupset]?.name : 'Not selected'}
Wheels: ${form.wheels ? PRICES.wheels[form.wheels as keyof typeof PRICES.wheels]?.name : 'Not selected'}

ESTIMATED TOTAL
---------------
Parts estimate: £${total.toLocaleString()}
Labour (fitting): £${form.groupset?.includes('di2') || form.groupset?.includes('force') ? '600' : '350'}
------------------------------------------
GUIDE TOTAL: £${(total + (form.groupset?.includes('di2') || form.groupset?.includes('force') ? 600 : 350)).toLocaleString()}

Note: This is a guide estimate only. Final 
pricing may vary based on exact specification, 
availability, and current supplier prices.

WHAT'S INCLUDED
----------------
- Frame, groupset, and wheel selection consultation
- Full build by our specialist mechanics
- Quality inspection and test ride
- 3-month follow-up adjustment

CONTACT
-------
Fred — BikeClinique Workshop
Based in Wandsworth, South London
Covering: Balham, Clapham, Tooting, Wimbledon, Streatham, and Brixton (5-mile radius)
Streatham, Brixton (5-mile radius)

www.bikeclinique.co.uk
`;

  const blob = new Blob([quote], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BikeClinique-Build-Quote-${form.name.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0,10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function BuildQuotePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
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
  const [downloaded, setDownloaded] = useState(false);

  function update(key: keyof FormData, value: string) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function estimate(): number {
    let total = 0;
    if (form.frame) total += PRICES.frame[form.frame as keyof typeof PRICES.frame] || 0;
    if (form.groupset) total += PRICES.groupset[form.groupset as keyof typeof PRICES.groupset]?.price || 0;
    if (form.wheels) total += PRICES.wheels[form.wheels as keyof typeof PRICES.wheels]?.price || 0;
    total += form.groupset?.includes('di2') || form.groupset?.includes('force') ? PRICES.build.complex : PRICES.build.standard;
    return total;
  }

  function handleDownload() {
    generateQuotePDF(form, estimate());
    setDownloaded(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    handleDownload();
  }

  const total = estimate();

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
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
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: step >= s ? '#ff6b35' : '#222'
            }} />
          ))}
        </div>

        {/* STEP 1: Riding */}
        {step === 1 && (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>What kind of riding?</h1>
            <p style={{ color: '#666', marginBottom: 32 }}>Step 1 of 4 — Takes 30 seconds</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {[
                { key: 'riding', value: 'road', label: 'Road cycling', desc: 'Fast, long distances, tarmac focus' },
                { key: 'riding', value: 'gravel', label: 'Gravel & adventure', desc: 'Mixed terrain, paths, fire roads, light trails' },
                { key: 'riding', value: 'commute', label: 'Commuting', desc: 'Urban, all-weather, practicality first' },
                { key: 'riding', value: 'mixed', label: 'Mixed everything', desc: 'Road, gravel, paths — I ride it all' },
              ].map(opt => (
                <button key={opt.value} onClick={() => { update('riding', opt.value); setStep(2); }}
                  style={{
                    background: form.riding === opt.value ? 'rgba(255,107,53,0.15)' : '#111',
                    border: `1px solid ${form.riding === opt.value ? '#ff6b35' : '#333'}`,
                    borderRadius: 12, padding: '16px 20px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%',
                  }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{opt.label}</div>
                  <div style={{ color: '#666', fontSize: 13, marginTop: 2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Budget */}
        {step === 2 && (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>What's your budget?</h1>
            <p style={{ color: '#666', marginBottom: 32 }}>Step 2 of 4 — This helps prioritise recommendations</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {[
                { value: '2000', label: '£2,000–£2,500', desc: 'Quality steel build. Gets you a proper bike.' },
                { value: '3000', label: '£2,500–£3,500', desc: 'Steel or entry carbon. Very solid build.' },
                { value: '5000', label: '£3,500–£5,000', desc: 'Carbon frame, GRX 800 or better.' },
                { value: 'unlimited', label: '£5,000+', desc: 'No budget limit. Full dream build.' },
              ].map(opt => (
                <button key={opt.value} onClick={() => { update('budget', opt.value); setStep(3); }}
                  style={{
                    background: form.budget === opt.value ? 'rgba(255,107,53,0.15)' : '#111',
                    border: `1px solid ${form.budget === opt.value ? '#ff6b35' : '#333'}`,
                    borderRadius: 12, padding: '16px 20px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%',
                  }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{opt.label}</div>
                  <div style={{ color: '#666', fontSize: 13, marginTop: 2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 14 }}>← Back</button>
          </div>
        )}

        {/* STEP 3: Specification preferences */}
        {step === 3 && (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Component preferences</h1>
            <p style={{ color: '#666', marginBottom: 32 }}>Step 3 of 4 — Select what you're interested in (or skip)</p>

            <div style={{ marginBottom: 28 }}>
              <label style={{ color: '#888', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 10 }}>Frame Material</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { value: 'steel', label: 'Steel', desc: 'Classic, repairable, comfortable', price: 'from £650' },
                  { value: 'carbon', label: 'Carbon', desc: 'Light, stiff, performance', price: 'from £1,400' },
                  { value: 'titanium', label: 'Titanium', desc: 'Lifetime, premium ride quality', price: 'from £2,800' },
                ].map(opt => (
                  <button key={opt.value} onClick={() => update('frame', form.frame === opt.value ? '' : opt.value)}
                    style={{
                      background: form.frame === opt.value ? 'rgba(255,107,53,0.15)' : '#111',
                      border: `1px solid ${form.frame === opt.value ? '#ff6b35' : '#333'}`,
                      borderRadius: 10, padding: '12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                    }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{opt.label}</div>
                    <div style={{ color: '#555', fontSize: 11, marginTop: 2 }}>{opt.desc}</div>
                    <div style={{ color: '#ff6b35', fontSize: 11, marginTop: 4 }}>{opt.price}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ color: '#888', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 10 }}>Groupset</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(PRICES.groupset).map(([key, val]) => (
                  <button key={key} onClick={() => update('groupset', form.groupset === key ? '' : key)}
                    style={{
                      background: form.groupset === key ? 'rgba(255,107,53,0.15)' : '#111',
                      border: `1px solid ${form.groupset === key ? '#ff6b35' : '#333'}`,
                      borderRadius: 10, padding: '12px 16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%',
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{val.name}</span>
                      <span style={{ color: '#ff6b35', fontWeight: 700, fontSize: 14 }}>£{val.price.toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ color: '#888', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 10 }}>Wheels</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(PRICES.wheels).map(([key, val]) => (
                  <button key={key} onClick={() => update('wheels', form.wheels === key ? '' : key)}
                    style={{
                      background: form.wheels === key ? 'rgba(255,107,53,0.15)' : '#111',
                      border: `1px solid ${form.wheels === key ? '#ff6b35' : '#333'}`,
                      borderRadius: 10, padding: '12px 16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%',
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{val.name}</span>
                      <span style={{ color: '#ff6b35', fontWeight: 700, fontSize: 14 }}>£{val.price.toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 14 }}>← Back</button>
              <button onClick={() => setStep(4)} style={{ background: '#222', border: '1px solid #333', borderRadius: 8, padding: '10px 24px', color: '#888', cursor: 'pointer', fontSize: 14 }}>Skip →</button>
            </div>
          </div>
        )}

        {/* STEP 4: Contact details */}
        {step === 4 && (
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Your details</h1>
            <p style={{ color: '#666', marginBottom: 24 }}>Step 4 of 4 — Fred will respond within 24 hours</p>

            {total > 0 && (
              <div style={{ background: '#111', border: '1px solid #333', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                <div style={{ color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>PARTS ESTIMATE</div>
                <div style={{ color: '#ff6b35', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>£{total.toLocaleString()}</div>
                <div style={{ color: '#555', fontSize: 12 }}>+ labour £{form.groupset?.includes('di2') || form.groupset?.includes('force') ? '600' : '350'}</div>
                <div style={{ color: '#888', fontSize: 13, marginTop: 12, paddingTop: 12, borderTop: '1px solid #222' }}>
                  Download a quote PDF below — Fred will send a detailed breakdown within 24 hours.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ color: '#666', fontSize: 12, display: 'block', marginBottom: 6, fontWeight: 600 }}>YOUR NAME</label>
                <input required value={form.name} onChange={e => update('name', e.target.value)}
                  style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }}
                  placeholder="Freddie" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ color: '#666', fontSize: 12, display: 'block', marginBottom: 6, fontWeight: 600 }}>EMAIL</label>
                  <input required type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }}
                    placeholder="freddie@example.com" />
                </div>
                <div>
                  <label style={{ color: '#666', fontSize: 12, display: 'block', marginBottom: 6, fontWeight: 600 }}>PHONE</label>
                  <input value={form.phone} onChange={e => update('phone', e.target.value)}
                    style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }}
                    placeholder="07xxx xxx xxx" />
                </div>
              </div>

              <div>
                <label style={{ color: '#666', fontSize: 12, display: 'block', marginBottom: 6, fontWeight: 600 }}>TELL US MORE (optional)</label>
                <textarea value={form.message} onChange={e => update('message', e.target.value)}
                  rows={3}
                  style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 16, outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                  placeholder="e.g. Based in Balham, I ride road mostly but want to explore gravel. Looking to spend around £3k."
                />
              </div>

              <button type="submit" style={{
                background: '#ff6b35', border: 'none', borderRadius: 10, padding: '16px 32px',
                color: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 8
              }}>
                Get My Quote PDF + Send to Fred →
              </button>

              {downloaded && (
                <p style={{ color: '#39FF14', fontSize: 13, textAlign: 'center' }}>✓ Quote downloaded — check your downloads folder</p>
              )}
            </form>

            <button onClick={() => setStep(3)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 14, marginTop: 16 }}>← Back</button>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #1a1a1a' }}>
          <p style={{ color: '#333', fontSize: 12, textAlign: 'center' }}>
Based in Wandsworth, South London. Covering Balham, Clapham, Tooting, Wimbledon, Streatham, Brixton (5-mile radius)
          </p>
        </div>
      </div>
    </div>
  );
}
