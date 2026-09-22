import React, { useState } from 'react';
import {
  Compass,
  Map,
  Building,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PlanningModule() {
  const { activeParcel } = useApp();
  const [crossCheckRunning, setCrossCheckRunning] = useState(false);
  const [crossCheckComplete, setCrossCheckComplete] = useState(true);

  const runCrossCheck = () => {
    setCrossCheckRunning(true);
    setCrossCheckComplete(false);
    setTimeout(() => {
      setCrossCheckRunning(false);
      setCrossCheckComplete(true);
    }, 800);
  };

  return (
    <div className="page-scroll-area">
      {/* Header */}
      <div className="page-header-container">
        <div className="breadcrumb-row">
          <span className="breadcrumb-item">PLOT360</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item">Planning & Development</span>
          <span className="breadcrumb-sep">/</span>
          <span style={{ color: 'var(--brand-accent-blue)', fontWeight: 600 }}>{activeParcel.parcel_id}</span>
        </div>
        <div className="page-title-row">
          <Compass className="page-icon" />
          <h1 className="page-title">Planning & Spatial Development</h1>
        </div>
        <p className="page-subtitle">
          Master plan zoning compliance, permissible building parameters, FAR restrictions, and municipal permission tracking.
        </p>
      </div>

      {/* Interactive Planning Cross-Check Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(37, 99, 235, 0.08) 100%)',
          border: '1px solid var(--border-card)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-accent-cyan)' }}>
              Interactive Planning Cross-Check Engine
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              Automated multi-departmental validation pipeline for {activeParcel.parcel_id} ({activeParcel.ulpin})
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={runCrossCheck}
            disabled={crossCheckRunning}
            style={{ fontSize: '11.5px', padding: '6px 14px' }}
          >
            {crossCheckRunning ? 'Analyzing Constraints...' : 'Re-Run Cross-Check'}
          </button>
        </div>

        {/* Step Flow Visualization */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          <div style={{ background: 'var(--bg-card-alt)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>1. PARCEL IDENTITY</span>
            <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '2px' }}>{activeParcel.parcel_id}</div>
            <div style={{ fontSize: '10.5px', color: 'var(--status-success)', marginTop: '2px' }}>✓ Geo-referenced</div>
          </div>

          <div style={{ background: 'var(--bg-card-alt)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>2. LAND USE</span>
            <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '2px' }}>{activeParcel.land_use}</div>
            <div style={{ fontSize: '10.5px', color: 'var(--status-success)', marginTop: '2px' }}>✓ Conforming</div>
          </div>

          <div style={{ background: 'var(--bg-card-alt)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>3. ZONING CLASS</span>
            <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '2px' }}>{activeParcel.zoning}</div>
            <div style={{ fontSize: '10.5px', color: 'var(--status-success)', marginTop: '2px' }}>✓ R-2 Bye-laws</div>
          </div>

          <div style={{ background: 'var(--bg-card-alt)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>4. BUILDING PERMISSION</span>
            <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '2px' }}>{activeParcel.building_permission?.status || 'Approved'}</div>
            <div style={{ fontSize: '10.5px', color: 'var(--status-success)', marginTop: '2px' }}>✓ Max G+2 Floors</div>
          </div>

          <div style={{ background: 'var(--bg-card-alt)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>5. RESTRICTIONS</span>
            <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '2px' }}>Clear of Buffers</div>
            <div style={{ fontSize: '10.5px', color: 'var(--status-success)', marginTop: '2px' }}>✓ Outside Flood Zone</div>
          </div>
        </div>
      </div>

      {/* Zoning Norms & Building Permissions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
            Zoning Specifications: Residential R-2 (Chandigarh Master Plan 2031)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '8px 0', color: 'var(--text-muted)' }}>Permissible Uses</td>
                <td style={{ padding: '8px 0', fontWeight: 600 }}>Detached/Semi-detached Residential Dwelling</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '8px 0', color: 'var(--text-muted)' }}>Maximum Permissible FAR</td>
                <td style={{ padding: '8px 0', fontWeight: 600 }}>1.50 (Standard) + 0.25 (Purchasable)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '8px 0', color: 'var(--text-muted)' }}>Maximum Height</td>
                <td style={{ padding: '8px 0', fontWeight: 600 }}>11.0 meters (Ground + 2 Upper Floors)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '8px 0', color: 'var(--text-muted)' }}>Mandatory Front Setback</td>
                <td style={{ padding: '8px 0', fontWeight: 600 }}>4.50 meters</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', color: 'var(--text-muted)' }}>Rear Setback</td>
                <td style={{ padding: '8px 0', fontWeight: 600 }}>3.00 meters</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Building Sanctions on File</h3>
          <div style={{ background: 'var(--bg-card-alt)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--brand-accent-blue)' }}>PJB/BP/2023/114</span>
              <span className="status-badge-inline green">APPROVED</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Sanction Date: 14 Nov 2023 • Validity: 13 Nov 2026
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Approved Ground Floor + First Floor + Second Floor residential unit with solar rooftop integration.
            </div>
          </div>

          <div style={{ padding: '10px', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            <strong>Town Planning Note:</strong> Ongoing construction must comply with sanctioned setbacks. Satellite alert Mar 2024 is currently undergoing field verification.
          </div>
        </div>
      </div>
    </div>
  );
}
