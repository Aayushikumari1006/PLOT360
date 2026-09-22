import React, { useState } from 'react';
import {
  FileText,
  X,
  Building,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ParcelDetailsPanel() {
  const {
    activeParcel,
    fieldVerificationStatus,
    setEvidenceModalOpen,
    setFieldModalOpen,
    setUnifiedReportOpen,
    currentLocation
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'records', label: 'Land Records' },
    { id: 'approvals', label: 'Approvals' },
    { id: 'encumbrance', label: 'Encumbrance' },
    { id: 'taxation', label: 'Taxation' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'ai', label: 'AI Insights' }
  ];

  // ── No parcel selected state ──────────────────────────────────────────────
  if (!activeParcel) {
    return (
      <div className="parcel-panel-container">
        {/* Header placeholder */}
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

        {/* Empty state message */}
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
            {currentLocation && !currentLocation.hasDemoCadastral
              ? `No demo cadastral data configured for ${currentLocation.name}. Select a parcel from the map or switch to Chandigarh, Mohali, or Panchkula for demo data.`
              : 'Select a parcel from the map to view detailed land records and governance information.'}
          </div>
        </div>
      </div>
    );
  }

  // ── Parcel selected ───────────────────────────────────────────────────────
  return (
    <div className="parcel-panel-container">
      {/* Header */}
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
              <span className="status-pill-verified">✓ Verified</span>
            </div>
            <div className="panel-ulpin">ULPIN: {activeParcel.ulpin}</div>
          </div>
        </div>
        <button
          className="panel-close-btn"
          title="Close details"
          onClick={() => alert('Parcel detail panel active')}
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="parcel-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`parcel-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scrollable Body */}
      <div className="panel-scroll-body">
        {/* Top 3 Quick Status Cards */}
        <div className="quick-status-grid">
          {/* Ownership */}
          <div className="quick-status-card">
            <div className="status-card-header">
              <span className="status-card-title">Ownership</span>
              <span className="status-badge-inline green">Approved</span>
            </div>
            <div className="status-card-val" title={activeParcel.owner?.name || 'Unknown'}>
              {activeParcel.owner?.name || 'Unknown'}
            </div>
          </div>

          {/* Building Permission */}
          <div className="quick-status-card">
            <div className="status-card-header">
              <span className="status-card-title">Building Permission</span>
              <span className="status-badge-inline green">Approved</span>
            </div>
            <div className="status-card-val" title={activeParcel.building_permission?.id || 'N/A'}>
              {activeParcel.building_permission?.id || 'N/A'}
            </div>
          </div>

          {/* Encumbrance */}
          <div className="quick-status-card">
            <div className="status-card-header">
              <span className="status-card-title">Encumbrance</span>
              <span className={`status-badge-inline ${activeParcel.encumbrance?.status === 'Active' ? 'amber' : 'green'}`}>
                {activeParcel.encumbrance?.status || 'Clear'}
              </span>
            </div>
            <div className="status-card-val">
              {activeParcel.encumbrance?.status === 'Active' ? 'NOC Required' : 'No Liabilities'}
            </div>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="info-section">
          <div className="info-section-title">Basic Information</div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-key">Parcel ID</span>
              <span className="info-val">{activeParcel.parcel_id}</span>
            </div>
            <div className="info-item">
              <span className="info-key">ULPIN</span>
              <span className="info-val" style={{ fontSize: '10.5px' }}>{activeParcel.ulpin}</span>
            </div>
            <div className="info-item">
              <span className="info-key">Location</span>
              <span className="info-val">{activeParcel.location}</span>
            </div>
            <div className="info-item">
              <span className="info-key">Area</span>
              <span className="info-val">
                {activeParcel.standardized_area} ({activeParcel.original_area})
              </span>
            </div>
            <div className="info-item">
              <span className="info-key">Land Use</span>
              <span className="info-val">{activeParcel.land_use}</span>
            </div>
            <div className="info-item">
              <span className="info-key">Zoning</span>
              <span className="info-val" style={{ color: 'var(--brand-accent-cyan)' }}>
                {activeParcel.zoning}
              </span>
            </div>
            <div className="info-item">
              <span className="info-key">Jurisdiction</span>
              <span className="info-val">{activeParcel.jurisdiction}</span>
            </div>
            <div className="info-item">
              <span className="info-key">Last Updated</span>
              <span className="info-val" style={{ fontSize: '10px', color: 'var(--status-success)' }}>
                {activeParcel.last_updated || '—'} (Source Verified)
              </span>
            </div>
          </div>
        </div>

        {/* Linked Records (2x4 Grid) */}
        <div className="info-section">
          <div className="info-section-title">Linked Records</div>
          <div className="linked-records-grid">
            <div className="record-tile" onClick={() => setUnifiedReportOpen(true)}>
              <FileText className="record-icon" />
              <div className="record-meta">
                <span className="record-name">RoR</span>
                <span className="record-status-dot">Available</span>
              </div>
            </div>
            <div className="record-tile" onClick={() => setUnifiedReportOpen(true)}>
              <ShieldCheck className="record-icon" />
              <div className="record-meta">
                <span className="record-name">Registration</span>
                <span className="record-status-dot">Available</span>
              </div>
            </div>
            <div className="record-tile" onClick={() => setUnifiedReportOpen(true)}>
              <Building className="record-icon" />
              <div className="record-meta">
                <span className="record-name">Building Permission</span>
                <span className="record-status-dot pending">Pending</span>
              </div>
            </div>
            <div className="record-tile" onClick={() => setUnifiedReportOpen(true)}>
              <CreditCard className="record-icon" />
              <div className="record-meta">
                <span className="record-name">Taxation</span>
                <span className="record-status-dot">Available</span>
              </div>
            </div>
            <div className="record-tile" onClick={() => setUnifiedReportOpen(true)}>
              <AlertTriangle className="record-icon" />
              <div className="record-meta">
                <span className="record-name">Encumbrance</span>
                <span className="record-status-dot">No Record</span>
              </div>
            </div>
            <div className="record-tile" onClick={() => setUnifiedReportOpen(true)}>
              <Building className="record-icon" />
              <div className="record-meta">
                <span className="record-name">Mortgage</span>
                <span className="record-status-dot">No Record</span>
              </div>
            </div>
            <div className="record-tile" onClick={() => setUnifiedReportOpen(true)}>
              <Layers className="record-icon" />
              <div className="record-meta">
                <span className="record-name">Utilities</span>
                <span className="record-status-dot">Available</span>
              </div>
            </div>
            <div className="record-tile" onClick={() => setUnifiedReportOpen(true)}>
              <Building className="record-icon" />
              <div className="record-meta">
                <span className="record-name">Planning</span>
                <span className="record-status-dot">Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI INSIGHTS BOX — shown only when parcel has an alert */}
        {activeParcel.ai_alert && (
          <div className="ai-insights-box">
            <div className="ai-header-row">
              <div className="ai-header-title">AI Insights</div>
              <div className="ai-flagged-badge">
                <AlertTriangle size={12} />
                <span>Flagged</span>
              </div>
            </div>

            <div className="ai-event-title">{activeParcel.ai_alert.title}</div>
            <div className="ai-event-meta">
              Flagged: {activeParcel.ai_alert.flagged_date} • Status:{' '}
              <strong style={{ color: 'var(--brand-accent-cyan)' }}>{fieldVerificationStatus}</strong>
            </div>
            <div className="ai-event-desc">
              {activeParcel.ai_alert.description}
            </div>

            {/* Before & After Thumbnail Comparison */}
            <div className="ai-comparison-thumbs">
              <div className="thumb-card" title="Historical Satellite (Oct 2023)">
                <img
                  src="/assets/demo/temporal_oct2023.jpg"
                  alt="Oct 2023 Before"
                  className="thumb-img"
                />
                <span className="thumb-label">Oct 2023</span>
              </div>
              <div className="thumb-card" title="Observed Satellite (Mar 2024)">
                <img
                  src="/assets/demo/temporal_mar2024.jpg"
                  alt="Mar 2024 After"
                  className="thumb-img"
                />
                <span className="thumb-label" style={{ backgroundColor: 'rgba(239, 68, 68, 0.85)' }}>Mar 2024</span>
              </div>
            </div>

            {/* Action Buttons */}
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

        {/* Full Report Action Button */}
        <button
          className="full-report-btn"
          onClick={() => setUnifiedReportOpen(true)}
        >
          <span>View Full Parcel Report</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
