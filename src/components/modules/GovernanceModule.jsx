import React, { useState } from 'react';
import {
  Landmark,
  FileText,
  ShieldCheck,
  Building,
  AlertTriangle,
  History,
  CheckCircle,
  ExternalLink,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function GovernanceModule() {
  const { activeParcel, setUnifiedReportOpen } = useApp();
  const [subTab, setSubTab] = useState('ror');

  return (
    <div className="page-scroll-area">
      {/* Header */}
      <div className="page-header-container">
        <div className="breadcrumb-row">
          <span className="breadcrumb-item">PLOT360</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item">Governance & Records</span>
          <span className="breadcrumb-sep">/</span>
          <span style={{ color: 'var(--brand-accent-blue)', fontWeight: 600 }}>{activeParcel.parcel_id}</span>
        </div>
        <div className="page-title-row">
          <Landmark className="page-icon" />
          <h1 className="page-title">Governance & Land Records</h1>
        </div>
        <p className="page-subtitle">
          Official land registries, deed verification, Record of Rights (Jamabandi), and encumbrance tracking across jurisdictions.
        </p>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
        {[
          { id: 'ror', label: 'Record of Rights (RoR)' },
          { id: 'registration', label: 'Deed Registration' },
          { id: 'ownership', label: 'Chain of Title / History' },
          { id: 'encumbrance', label: 'Encumbrance & Mortgages' },
          { id: 'disputes', label: 'Tribunal & Disputes' }
        ].map(t => (
          <button
            key={t.id}
            className={`quick-action-btn ${subTab === t.id ? 'active' : ''}`}
            style={{
              backgroundColor: subTab === t.id ? 'var(--brand-accent-blue)' : 'var(--bg-card)',
              color: subTab === t.id ? '#ffffff' : 'var(--text-secondary)'
            }}
            onClick={() => setSubTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {subTab === 'ror' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '14px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Record of Rights: Jamabandi Record</h3>
              <span className="status-pill-verified">✓ Punjab Revenue Dept. Verified</span>
            </div>
            <div className="info-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="info-item">
                <span className="info-key">Khata / Khewat No.</span>
                <span className="info-val">{activeParcel.khata_no || 'KH-842 / KW-112'}</span>
              </div>
              <div className="info-item">
                <span className="info-key">Khasra / Survey No.</span>
                <span className="info-val">{activeParcel.survey_no || '1027/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-key">Recorded Area</span>
                <span className="info-val">{activeParcel.standardized_area} ({activeParcel.original_area})</span>
              </div>
              <div className="info-item">
                <span className="info-key">Land Classification</span>
                <span className="info-val">{activeParcel.land_use} (Non-agricultural)</span>
              </div>
              <div className="info-item">
                <span className="info-key">Rights-holder / Owner</span>
                <span className="info-val">{activeParcel.owner.name}</span>
              </div>
              <div className="info-item">
                <span className="info-key">Cultivator / Possession</span>
                <span className="info-val">Self-Occupied / Khudkasht</span>
              </div>
            </div>

            <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-card-alt)', borderRadius: '8px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              <strong>Revenue Officer Remarks:</strong> Mutation #MUT-2023-881 sanctioned following registered sale deed #REG-PB-2023-891. All land cess and local revenue taxes are settled.
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700 }}>Data Provenance & Trust</h4>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Verification proof for parcel records:
            </div>
            <div style={{ background: 'var(--bg-card-alt)', padding: '10px', borderRadius: '8px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><strong>Source Department:</strong> Dept. of Land Resources & Revenue, Punjab</div>
              <div><strong>Record ID:</strong> ROR-PB-CHD-2023-1027</div>
              <div><strong>Digital Signature:</strong> SHA-256 Verified (0x9a8f...31bc)</div>
              <div><strong>Last Updated:</strong> {activeParcel.last_updated}</div>
              <div><strong>Status:</strong> <span style={{ color: 'var(--status-success)', fontWeight: 700 }}>SOURCE VERIFIED & AVAILABLE</span></div>
            </div>
            <button className="full-report-btn" onClick={() => setUnifiedReportOpen(true)}>
              Open Full Parcel Dossier
            </button>
          </div>
        </div>
      )}

      {subTab === 'registration' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Registered Conveyance Deeds for {activeParcel.parcel_id}</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-card-alt)', borderRadius: '10px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--status-success)', fontWeight: 700 }}>1. Application Submitted</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>12 Oct 2023</div>
            </div>
            <div style={{ height: '2px', flex: 1, backgroundColor: 'var(--status-success)', margin: '0 10px' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--status-success)', fontWeight: 700 }}>2. Stamp Duty Paid</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>₹ 3,45,000 Verified</div>
            </div>
            <div style={{ height: '2px', flex: 1, backgroundColor: 'var(--status-success)', margin: '0 10px' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--status-success)', fontWeight: 700 }}>3. Sub-Registrar Executed</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>24 Oct 2023</div>
            </div>
            <div style={{ height: '2px', flex: 1, backgroundColor: 'var(--status-success)', margin: '0 10px' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--status-success)', fontWeight: 700 }}>4. Title Transferred</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Deed #REG-PB-2023-891</div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'encumbrance' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '18px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Liabilities & Encumbrance Register</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '8px' }}>Charge ID</th>
                <th style={{ padding: '8px' }}>Lender / Entity</th>
                <th style={{ padding: '8px' }}>Type</th>
                <th style={{ padding: '8px' }}>Amount</th>
                <th style={{ padding: '8px' }}>Registered Date</th>
                <th style={{ padding: '8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px 8px', fontWeight: 600 }}>CHG-2023-902</td>
                <td style={{ padding: '10px 8px' }}>HDFC Bank Ltd. (Sector 17 Branch)</td>
                <td style={{ padding: '10px 8px' }}>Equitable Mortgage</td>
                <td style={{ padding: '10px 8px' }}>₹ 45,00,000</td>
                <td style={{ padding: '10px 8px' }}>15 Nov 2023</td>
                <td style={{ padding: '10px 8px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-badge-amber)', color: 'var(--status-warning)', fontWeight: 600 }}>
                    ACTIVE (NOC Required)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {subTab !== 'ror' && subTab !== 'registration' && subTab !== 'encumbrance' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '30px', textAlign: 'center' }}>
          <CheckCircle size={32} style={{ color: 'var(--status-success)', margin: '0 auto 10px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>No Active Disputes or Adverse Claims</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Official search in Sub-Divisional Magistrate Tribunal and Civil Court records returned 0 pending claims for ULPIN {activeParcel.ulpin}.
          </p>
        </div>
      )}
    </div>
  );
}
