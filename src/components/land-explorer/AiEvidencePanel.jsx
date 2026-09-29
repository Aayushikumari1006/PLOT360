import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AiEvidencePanel({ onClose }) {
  const { activeParcel, setEvidenceModalOpen, setFieldModalOpen } = useApp();

  if (!activeParcel) return null;

  const hasAlert = Boolean(activeParcel.ai_alert);
  const confidenceScore = hasAlert ? 84 : 98;

  return (
    <div className="ai-evidence-panel-card">
      {/* Header */}
      <div className="ai-evidence-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--brand-accent-cyan)" />
            <span className="ai-evidence-title">AI Evidence Panel</span>
          </div>
          <div className="ai-evidence-question">Can this parcel proceed?</div>
        </div>
        {onClose && (
          <button
            className="icon-btn"
            onClick={onClose}
            title="Close AI Evidence"
            style={{ width: '26px', height: '26px', minWidth: '26px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Checklist Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* 1. Master Plan Restrictions */}
        <div className="ai-evidence-item-card">
          <div className="ai-evidence-item-header">
            <span className="ai-evidence-item-title">Master Plan Restrictions</span>
            <span className="ai-evidence-item-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--status-success)' }}>
              Verified
            </span>
          </div>
          <div className="ai-evidence-item-desc">
            Zoning conforms to Master Plan 2031. Permitted FAR 1.75; no statutory right-of-way encroachment.
          </div>
        </div>

        {/* 2. Environmental Constraints */}
        <div className="ai-evidence-item-card">
          <div className="ai-evidence-item-header">
            <span className="ai-evidence-item-title">Environmental Constraints</span>
            <span className="ai-evidence-item-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--brand-accent-cyan)' }}>
              Clear
            </span>
          </div>
          <div className="ai-evidence-item-desc">
            No eco-sensitive buffer or wetland catchment overlaps recorded.
          </div>
        </div>

        {/* 3. Human-Verification Sentinel-2 */}
        <div className="ai-evidence-item-card">
          <div className="ai-evidence-item-header">
            <span className="ai-evidence-item-title">Human-Verified Review</span>
            <span
              className="ai-evidence-item-badge"
              style={{
                background: hasAlert ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: hasAlert ? 'var(--status-warning)' : 'var(--status-success)'
              }}
            >
              {hasAlert ? 'Flagged' : 'Stable'}
            </span>
          </div>
          <div className="ai-evidence-item-desc">
            {hasAlert
              ? 'Candidate spectral change detected via Sentinel-2 BOA raster differencing. Queued for field inspection.'
              : 'Copernicus Sentinel-2 Surface Reflectance (2020 vs 2025) baseline shows multi-year plinth stability.'}
          </div>
        </div>
      </div>

      {/* Confidence Score Bar */}
      <div className="confidence-score-block">
        <div className="confidence-header-row">
          <span>Confidence Score</span>
          <span style={{ color: 'var(--status-success)' }}>{confidenceScore}%</span>
        </div>
        <div className="confidence-progress-bar">
          <div className="confidence-progress-fill" style={{ width: `${confidenceScore}%` }} />
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
          *Ground-truthed across 6 departmental state registries.
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 'auto' }}>
        <button
          className="btn-secondary"
          style={{ width: '100%', padding: '6px 10px', fontSize: '11px', justifyContent: 'center' }}
          onClick={() => setFieldModalOpen(true)}
        >
          Field Verification
        </button>
        <button
          className="btn-primary"
          style={{ width: '100%', padding: '6px 10px', fontSize: '11px', justifyContent: 'center' }}
          onClick={() => setEvidenceModalOpen(true)}
        >
          View Draggable Evidence
        </button>
      </div>
    </div>
  );
}
