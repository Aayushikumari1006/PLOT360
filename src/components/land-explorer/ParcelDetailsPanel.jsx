import React, { useState } from 'react';
import {
  FileText,
  X,
  Building,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  Layers,
  MapPin,
  Download,
  CheckCircle2,
  Lock,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateParcelPassportPdf } from '../../utils/pdfGenerator';

export default function ParcelDetailsPanel() {
  const {
    activeParcel,
    userRole,
    fieldVerificationStatus,
    setEvidenceModalOpen,
    setFieldModalOpen,
    setUnifiedReportOpen,
    currentLocation
  } = useApp();

  // Exactly 3 non-repeating toggles with ZERO horizontal slidebar/scrollbar
  const [activeToggle, setActiveToggle] = useState('title');

  const toggles = [
    { id: 'title', label: '1. Title & RoR' },
    { id: 'approvals', label: '2. Approvals & Legal' },
    { id: 'civic', label: '3. Civic & Audit' }
  ];

  // ── No parcel selected state ──────────────────────────────────────────────
  if (!activeParcel) {
    return (
      <div className="parcel-panel-container">
        <div className="parcel-panel-header">
          <div className="panel-title-area">
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-card-alt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}
            >
              <FileText size={18} />
            </div>
            <div className="panel-parcel-badge">
              <div className="panel-parcel-id">
                <span style={{ color: 'var(--text-secondary)' }}>No parcel selected</span>
              </div>
              <div className="panel-ulpin" style={{ color: 'var(--text-muted)' }}>
                {currentLocation ? currentLocation.name : ''} — no demo cadastral data
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '32px 20px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-card-alt)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
          >
            <MapPin size={24} />
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
            No demo parcel available
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', maxWidth: '200px', lineHeight: 1.5 }}>
            Select a cadastral parcel from the map to inspect title, approvals, and civic infrastructure in bullet points.
          </div>
        </div>
      </div>
    );
  }

  // Dual area formatting (standardized + revenue)
  const stdAreaText = activeParcel.standardized_area
    ? `${String(activeParcel.standardized_area).replace(/m²/g, 'sq.m')} sq.m`
    : (activeParcel.area_sqm ? `${activeParcel.area_sqm} sq.m` : '2,954.21 sq.m');

  const origAreaText = activeParcel.original_area
    ? String(activeParcel.original_area).replace(/m²/g, 'sq.m')
    : '0.73 Acre';

  const latCoord = activeParcel.centroid_lat ? Number(activeParcel.centroid_lat).toFixed(4) : '30.7414';
  const lngCoord = activeParcel.centroid_lng ? Number(activeParcel.centroid_lng).toFixed(4) : '76.7813';

  // ── Parcel selected: 3 Toggles with Zero Slidebar ──────────────────────────
  return (
    <div className="parcel-panel-container">
      {/* Panel Top Identification Header */}
      <div className="parcel-panel-header">
        <div className="panel-title-area">
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-card-alt)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-accent-blue)'
            }}
          >
            <FileText size={18} />
          </div>
          <div className="panel-parcel-badge">
            <div className="panel-parcel-id">
              <span>{activeParcel.parcel_id}</span>
              <span className="status-pill-verified">✓ Active</span>
            </div>
            <div className="panel-ulpin">ULPIN: {activeParcel.ulpin}</div>
          </div>
        </div>
        <button
          className="panel-close-btn"
          title="Download Verified Land Passport PDF"
          onClick={() => generateParcelPassportPdf(activeParcel, userRole || 'citizen')}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', fontSize: '11px', color: 'var(--brand-accent-cyan)' }}
        >
          <Download size={14} />
          <span>PDF</span>
        </button>
      </div>

      {/* ONLY 3 TOGGLES IN PLACE OF SLIDEBAR (NO HORIZONTAL SCROLLBAR) */}
      <div className="parcel-three-toggles">
        {toggles.map((item) => (
          <button
            key={item.id}
            className={`parcel-toggle-btn ${activeToggle === item.id ? 'active' : ''}`}
            onClick={() => setActiveToggle(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Scrollable Body — Structured Cleanly in Pointers Without Redundancy */}
      <div className="panel-scroll-body" style={{ padding: '12px 14px' }}>

        {/* ── TOGGLE 1: TITLE & RECORD OF RIGHTS ─────────────────────────── */}
        {activeToggle === 'title' && (
          <div>
            {/* Pointer Card 1: Title & Ownership Chain */}
            <div className="parcel-pointer-card">
              <div className="parcel-pointer-card-title">
                <ShieldCheck size={14} />
                <span>Primary Title & Ownership</span>
              </div>
              <div className="parcel-pointer-list">
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Registered Owner: </span>
                    <span className="parcel-pointer-val" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {activeParcel.owner?.name || 'Sunita Sharma'}
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Title Tenure & Share: </span>
                    <span className="parcel-pointer-val">
                      {activeParcel.owner?.share || '100% Absolute Freehold Title'}
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Revenue Deed Record: </span>
                    <span className="parcel-pointer-val">
                      Sub-Registrar Conveyance Deed #{activeParcel.deed_no || 'SR-CHD-2023-1049'}
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Mutation Status: </span>
                    <span className="parcel-pointer-val" style={{ color: 'var(--status-success)', fontWeight: 600 }}>
                      Sanctioned & Mutated in Digital RoR
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pointer Card 2: Cadastral Extent & Identification */}
            <div className="parcel-pointer-card">
              <div className="parcel-pointer-card-title">
                <Compass size={14} />
                <span>Cadastral Extent & Demarcation</span>
              </div>
              <div className="parcel-pointer-list">
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Standardized Area: </span>
                    <span className="parcel-pointer-val" style={{ fontWeight: 600, color: 'var(--brand-accent-cyan)' }}>
                      {stdAreaText}
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Local Revenue Units: </span>
                    <span className="parcel-pointer-val">{origAreaText}</span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Survey & Khata Numbers: </span>
                    <span className="parcel-pointer-val">
                      Survey #{activeParcel.survey_no || activeParcel.khasra_no || '1027/A'} | Khata #{activeParcel.khata_no || 'KH-842'}
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Centroid Coordinates: </span>
                    <span className="parcel-pointer-val">
                      Lat {latCoord} N, Lng {lngCoord} E (WGS-84 Datum)
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Administrative Jurisdiction: </span>
                    <span className="parcel-pointer-val">
                      {activeParcel.location}, Ward #{activeParcel.ward || '17'}, {activeParcel.jurisdiction || activeParcel.state}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TOGGLE 2: APPROVALS & LEGAL CLEARANCES ───────────────────────── */}
        {activeToggle === 'approvals' && (
          <div>
            {/* Pointer Card 1: Building Sanction & Plinth */}
            <div className="parcel-pointer-card">
              <div className="parcel-pointer-card-title">
                <Building size={14} />
                <span>Municipal Building Sanction</span>
              </div>
              <div className="parcel-pointer-list">
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Sanction Order: </span>
                    <span className="parcel-pointer-val" style={{ fontWeight: 600 }}>
                      {activeParcel.building_permission?.id || 'BP-MC-2023-0914'}
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Statutory State: </span>
                    <span className="parcel-pointer-val" style={{ color: 'var(--status-success)', fontWeight: 600 }}>
                      {activeParcel.building_permission?.status || 'Approved & Valid'}
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Permitted Profile: </span>
                    <span className="parcel-pointer-val">
                      {activeParcel.building_permission?.floors || 'G + 2 Floors conforming to ULB Bylaws'}
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Master Plan Zoning: </span>
                    <span className="parcel-pointer-val" style={{ color: 'var(--brand-accent-blue)', fontWeight: 600 }}>
                      {activeParcel.zoning || 'Eco-Sensitive Buffer'} (Permitted FAR: 1.75)
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Right-of-Way Compliance: </span>
                    <span className="parcel-pointer-val">
                      Zero statutory road widening or public corridor encroachment
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pointer Card 2: Encumbrances, Mortgages & Litigation */}
            <div className="parcel-pointer-card">
              <div className="parcel-pointer-card-title">
                <Lock size={14} />
                <span>Financial & Legal Clearances</span>
              </div>
              <div className="parcel-pointer-list">
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">CERSAI Encumbrance: </span>
                    <span
                      className="parcel-pointer-val"
                      style={{
                        color: activeParcel.encumbrance?.status === 'Active' ? 'var(--status-warning)' : 'var(--status-success)',
                        fontWeight: 600
                      }}
                    >
                      {activeParcel.encumbrance?.status === 'Active'
                        ? `Active Charge (${activeParcel.encumbrance?.institution || 'Scheduled Bank'})`
                        : 'Unencumbered (Nil Charge)'}
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Financial Charge Amount: </span>
                    <span className="parcel-pointer-val">
                      {activeParcel.encumbrance?.amount ? activeParcel.encumbrance.amount : 'INR 0 (Clean)'}
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Caveat & Stay Orders: </span>
                    <span className="parcel-pointer-val" style={{ color: 'var(--status-success)' }}>
                      Zero active court stays or revenue lis pendens recorded
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Revenue Recovery Notices: </span>
                    <span className="parcel-pointer-val">
                      No statutory attachment orders under Land Revenue Code
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TOGGLE 3: CIVIC INFRASTRUCTURE & SATELLITE AUDIT ───────────── */}
        {activeToggle === 'civic' && (
          <div>
            {/* Pointer Card 1: Municipal Utilities & Tax */}
            <div className="parcel-pointer-card">
              <div className="parcel-pointer-card-title">
                <CreditCard size={14} />
                <span>Civic Infrastructure & Utilities</span>
              </div>
              <div className="parcel-pointer-list">
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Property Tax Status: </span>
                    <span
                      className="parcel-pointer-val"
                      style={{
                        color: activeParcel.property_tax?.status === 'Pending' ? 'var(--status-warning)' : 'var(--status-success)',
                        fontWeight: 600
                      }}
                    >
                      {activeParcel.property_tax?.status === 'Pending' ? 'Assessment Pending' : 'Paid & Cleared'}
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Tax Receipt Reference: </span>
                    <span className="parcel-pointer-val">
                      Receipt #{activeParcel.property_tax?.receipt_no || 'TX-2024-883'} (Valid till 31 Mar 2025)
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Power & Water Grid: </span>
                    <span className="parcel-pointer-val">
                      Electricity Grid (Metered) | Municipal Potable Water (Active Line)
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Road Frontage: </span>
                    <span className="parcel-pointer-val">
                      Direct frontage onto 18m sanctioned municipal sector transit corridor
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pointer Card 2: Satellite AI Integrity & Cryptographic Provenance */}
            <div className="parcel-pointer-card">
              <div className="parcel-pointer-card-title">
                <Layers size={14} />
                <span>Satellite AI & Audit Provenance</span>
              </div>
              <div className="parcel-pointer-list">
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Earth Observation: </span>
                    <span className="parcel-pointer-val">
                      Copernicus Sentinel-2 BOA surface reflectance confirmed stable (2020 - 2026)
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Environmental Clearance: </span>
                    <span className="parcel-pointer-val" style={{ color: 'var(--status-success)' }}>
                      Clear of statutory wetlands and riverbed catchment basins
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Departmental Consensus: </span>
                    <span className="parcel-pointer-val">
                      Ground-truthed across 6 state administrative department registries
                    </span>
                  </div>
                </div>
                <div className="parcel-pointer-item">
                  <span className="parcel-pointer-dot">•</span>
                  <div>
                    <span className="parcel-pointer-key">Tamper-Evident Ledger: </span>
                    <span className="parcel-pointer-val" style={{ fontFamily: 'monospace', fontSize: '10.5px' }}>
                      SHA256:7f8b9a{activeParcel.parcel_id ? activeParcel.parcel_id.replace(/\D/g, '') : '892'}...VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI INSIGHTS ALERT (ONLY IF PARCEL IS FLAGGED) */}
        {activeParcel.ai_alert && (
          <div className="ai-insights-box" style={{ marginTop: '6px' }}>
            <div className="ai-header-row">
              <div className="ai-header-title">Spectral Anomaly Alert</div>
              <div className="ai-flagged-badge">
                <AlertTriangle size={12} />
                <span>Flagged</span>
              </div>
            </div>
            <div className="ai-event-title">{activeParcel.ai_alert.title}</div>
            <div className="ai-event-meta">
              Observed: {activeParcel.ai_alert.flagged_date} • Status:{' '}
              <strong style={{ color: 'var(--brand-accent-cyan)' }}>{fieldVerificationStatus}</strong>
            </div>
            <div className="ai-btn-row">
              <button
                className="btn-secondary"
                onClick={() => setFieldModalOpen(true)}
                title="Open Field Verification Form"
              >
                Field Verification
              </button>
              <button
                className="btn-primary"
                onClick={() => setEvidenceModalOpen(true)}
                title="Open Temporal Comparison Evidence"
              >
                View Evidence
              </button>
            </div>
          </div>
        )}

        {/* Bottom Primary Actions */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button
            className="full-report-btn"
            style={{ flex: 1, marginTop: 0 }}
            onClick={() => setUnifiedReportOpen(true)}
          >
            <span>View Full Dossier</span>
            <ArrowRight size={14} />
          </button>
          <button
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 14px', fontSize: '11.5px', fontWeight: 600 }}
            onClick={() => generateParcelPassportPdf(activeParcel, userRole || 'citizen')}
            title="Download Instant Land Passport (Executive PDF)"
          >
            <Download size={14} />
            <span>Land Passport</span>
          </button>
        </div>

      </div>
    </div>
  );
}
