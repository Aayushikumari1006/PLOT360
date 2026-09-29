import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  AlertTriangle,
  Sparkles,
  Upload,
  FileCheck,
  CheckCircle,
  XCircle,
  TrendingUp,
  Layers,
  ArrowRight,
  Sliders,
  Copy,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getAdminConflicts, resolveConflict, getAdminDuplicates } from '../../api/admin';
import { getAnalyticsOverview } from '../../api/analytics';

export default function AnalyticsAiModule() {
  const {
    activeParcel,
    selectParcel,
    setEvidenceModalOpen,
    setFieldModalOpen,
    fieldVerificationStatus,
    userRole
  } = useApp();

  const [activeSection, setActiveSection] = useState('conflicts');
  const [conflictFilter, setConflictFilter] = useState('all');

  const fallbackConflicts = [
    {
      id: 'CONF-01',
      conflict_id: 'CONF-01',
      parcel_id: 'P-1028',
      ulpin: 'IN-PB-CHD-0001028',
      field: 'Parcel Area',
      sourceA: 'Record of Rights (Jamabandi)',
      valueA: '1,416.40 m² (0.35 Acre)',
      sourceB: 'Property Tax Assessment',
      valueB: '1,530.00 m² (0.38 Acre)',
      diff: '+113.60 m² discrepancy (+8%)',
      officer: 'Revenue Officer (Tehsil North)',
      status: 'OPEN'
    },
    {
      id: 'CONF-02',
      conflict_id: 'CONF-02',
      parcel_id: 'P-1025',
      ulpin: 'IN-PB-CHD-0001025',
      field: 'Land Use Classification',
      sourceA: 'Town Planning Master Plan',
      valueA: 'Commercial / Retail',
      sourceB: 'Property Tax Registry',
      valueB: 'Residential Zone',
      diff: 'Statutory land-use mismatch',
      officer: 'Municipal Planning Officer',
      status: 'OPEN'
    },
    {
      id: 'CONF-03',
      conflict_id: 'CONF-03',
      parcel_id: 'P-1009',
      ulpin: 'IN-PB-CHD-0001009',
      field: 'Encumbrance Lien Status',
      sourceA: 'CERSAI / Bank Registry',
      valueA: 'Charge Recorded (HDFC)',
      sourceB: 'Sub-Registrar RoR',
      valueB: 'Unencumbered',
      diff: 'Missing encumbrance endorsement',
      officer: 'Sub-Registrar Officer',
      status: 'OPEN'
    }
  ];

  const [conflictsList, setConflictsList] = useState(fallbackConflicts);
  const [selectedConflict, setSelectedConflict] = useState(fallbackConflicts[0]);
  const [resolutionStatus, setResolutionStatus] = useState(null);
  const [resolutionError, setResolutionError] = useState(null);

  // Live Duplicates & Analytics State
  const [duplicatesList, setDuplicatesList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoadingData(true);

    // 1. Fetch live conflicts
    getAdminConflicts()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((c, idx) => ({
            id: c.conflict_id || `CONF-0${idx + 1}`,
            conflict_id: c.conflict_id || `CONF-0${idx + 1}`,
            backendId: c.id,
            parcel_id: c.ulpin ? c.ulpin.split('-').pop() : 'P-1028',
            ulpin: c.ulpin || 'IN-PB-CHD-0001028',
            field: c.field || 'Land Parameter',
            sourceA: c.source_a || 'Record of Rights',
            valueA: c.value_a || 'Verified Value',
            sourceB: c.source_b || 'Municipal Registry',
            valueB: c.value_b || 'Registered Value',
            diff: c.difference || c.difference_summary || 'Cross-system discrepancy',
            officer: c.assigned_officer || 'Revenue Officer',
            status: c.status || 'OPEN'
          }));
          setConflictsList(mapped);
          setSelectedConflict(mapped[0]);
        }
      })
      .catch((err) => {
        console.warn('Backend conflicts offline or unauthorized, using fallback:', err);
      });

    // 2. Fetch live duplicates
    getAdminDuplicates()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setDuplicatesList(data);
        }
      })
      .catch((err) => {
        console.warn('Backend duplicates offline, keeping fallback:', err);
      });

    // 3. Fetch analytics overview
    getAnalyticsOverview()
      .then((data) => {
        if (!isMounted) return;
        if (data && data.kpis) {
          setAnalyticsData(data);
        }
      })
      .catch((err) => {
        console.warn('Backend analytics offline, keeping fallback:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingData(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleResolve = async (newStatus, notes) => {
    setResolutionStatus(null);
    setResolutionError(null);
    try {
      const targetId = selectedConflict.conflict_id || selectedConflict.id;
      await resolveConflict(targetId, newStatus, notes);
      setSelectedConflict(prev => ({ ...prev, status: newStatus }));
      setConflictsList(prev => prev.map(c => c.id === selectedConflict.id ? { ...c, status: newStatus } : c));
      setResolutionStatus(`Conflict ${targetId} successfully updated to ${newStatus}`);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Resolution could not be saved to backend';
      setResolutionError(`Action Failed: ${msg}`);
    }
  };

  // Document Intelligence state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  const handleSimulatedUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFile(file.name);
    setExtracting(true);
    setExtractedData(null);

    setTimeout(() => {
      setExtracting(false);
      setExtractedData({
        ulpin: 'IN-PB-CHD-0001027',
        parcel: 'P-1027',
        owner: 'Ravinder Singh',
        area: '1,248.50 m²',
        deed_no: 'REG-PB-2023-891',
        date: '24 Oct 2023',
        match_status: 'MATCHED_WITH_ROR',
        confidence: '98.4%'
      });
    }, 1200);
  };

  return (
    <div className="page-scroll-area">
      {/* Header */}
      <div className="page-header-container">
        <div className="breadcrumb-row">
          <span className="breadcrumb-item">PLOT360</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item">Analytics & AI</span>
        </div>
        <div className="page-title-row">
          <BarChart3 className="page-icon" />
          <h1 className="page-title">Analytics, Decision Support & AI Hub</h1>
        </div>
        <p className="page-subtitle">
          Multi-departmental data conflict reconciliation, temporal satellite change detection, document intelligence, and predictive analytics.
        </p>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
        {[
          { id: 'conflicts', label: 'Data Conflict Center (83)' },
          { id: 'changes', label: 'Satellite Change Alerts (42)' },
          { id: 'duplicates', label: 'Duplicate Detection (15)' },
          { id: 'doc-ai', label: 'Document Intelligence (OCR)' },
          { id: 'predictive', label: 'Predictive Decision Support' }
        ].map(t => (
          <button
            key={t.id}
            className={`quick-action-btn ${activeSection === t.id ? 'active' : ''}`}
            style={{
              backgroundColor: activeSection === t.id ? 'var(--brand-accent-blue)' : 'var(--bg-card)',
              color: activeSection === t.id ? '#ffffff' : 'var(--text-secondary)'
            }}
            onClick={() => setActiveSection(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. DATA CONFLICTS */}
      {activeSection === 'conflicts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Summary Chips */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            <div
              onClick={() => setConflictFilter('area')}
              style={{
                background: conflictFilter === 'area' ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                border: `1px solid ${conflictFilter === 'area' ? 'var(--brand-accent-blue)' : 'var(--border-card)'}`,
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AREA MISMATCHES</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-error)' }}>31</div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>RoR vs Tax area deltas</div>
            </div>

            <div
              onClick={() => setConflictFilter('owner')}
              style={{
                background: conflictFilter === 'owner' ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                border: `1px solid ${conflictFilter === 'owner' ? 'var(--brand-accent-blue)' : 'var(--border-card)'}`,
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>OWNER NAME MISMATCHES</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-warning)' }}>12</div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Spelling & mutation lag</div>
            </div>

            <div
              onClick={() => setConflictFilter('duplicate')}
              style={{
                background: conflictFilter === 'duplicate' ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                border: `1px solid ${conflictFilter === 'duplicate' ? 'var(--brand-accent-blue)' : 'var(--border-card)'}`,
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DUPLICATE SURVEY NUMBERS</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-accent-cyan)' }}>15</div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Overlap in legacy records</div>
            </div>

            <div
              onClick={() => setConflictFilter('missing')}
              style={{
                background: conflictFilter === 'missing' ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                border: `1px solid ${conflictFilter === 'missing' ? 'var(--brand-accent-blue)' : 'var(--border-card)'}`,
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MISSING DEPARTMENT DATA</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>25</div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Unlinked municipal files</div>
            </div>
          </div>

          {/* Conflict Split: List on Left, Detail on Right */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>Active Conflict Queue ({conflictsList.length})</div>
                {loadingData && <span style={{ fontSize: '11px', color: 'var(--brand-accent-cyan)' }}>Syncing...</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto' }}>
                {conflictsList.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedConflict(item);
                      if (item.parcel_id) selectParcel(item.parcel_id);
                    }}
                    style={{
                      padding: '10px 12px',
                      background: selectedConflict.id === item.id ? 'var(--bg-card-hover)' : 'var(--bg-card-alt)',
                      border: `1px solid ${selectedConflict.id === item.id ? 'var(--brand-accent-blue)' : 'var(--border-subtle)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 700 }}>
                        {item.parcel_id} <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>({item.conflict_id || item.id})</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.diff}</div>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: item.status === 'RESOLVED' ? 'var(--bg-badge-green)' : 'var(--bg-badge-red)', color: item.status === 'RESOLVED' ? 'var(--status-success)' : 'var(--status-error)' }}>
                      {item.status || 'OPEN'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Source A vs Source B Comparison */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Source Comparison: {selectedConflict.parcel_id}</h4>
                <span className={`status-badge-inline ${selectedConflict.status === 'RESOLVED' ? 'green' : 'red'}`}>
                  {selectedConflict.status === 'RESOLVED' ? 'RESOLVED' : 'CONFLICT FLAGGED'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: 'var(--bg-card-alt)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SOURCE A</span>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-accent-cyan)', marginTop: '2px' }}>
                    {selectedConflict.sourceA}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {selectedConflict.valueA}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-card-alt)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SOURCE B</span>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-warning)', marginTop: '2px' }}>
                    {selectedConflict.sourceB}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {selectedConflict.valueB}
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px', borderRadius: '8px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                <strong>Difference Identified:</strong> {selectedConflict.diff}
                <div style={{ marginTop: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  Assigned Authority: <strong>{selectedConflict.officer}</strong>
                </div>
              </div>

              {resolutionStatus && (
                <div style={{ fontSize: '11px', color: 'var(--status-success)', padding: '6px 8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                  ✓ {resolutionStatus}
                </div>
              )}
              {resolutionError && (
                <div style={{ fontSize: '11px', color: 'var(--status-danger)', padding: '6px 8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                  ⚠ {resolutionError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => handleResolve('ASSIGNED', 'Assigned to field officer for physical resurvey')}
                >
                  Assign to Officer
                </button>
                <button
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => handleResolve('UNDER_REVIEW', 'Marked for inter-departmental joint review')}
                >
                  Mark Under Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SATELLITE CHANGE ALERTS */}
      {activeSection === 'changes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="ai-insights-box">
            <div className="ai-header-row">
              <span className="ai-header-title">Satellite Change Alert: {activeParcel.parcel_id}</span>
              <span className="ai-flagged-badge">POTENTIAL CHANGE DETECTED</span>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Satellite imagery change detection algorithm identified ground clearance and construction commencement on parcel <strong>{activeParcel.parcel_id}</strong> (ULPIN: {activeParcel.ulpin}) between <strong>Oct 2023</strong> and <strong>Mar 2024</strong>.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button className="btn-primary" onClick={() => setEvidenceModalOpen(true)}>
                Open Draggable Temporal Evidence Comparison
              </button>
              <button className="btn-secondary" onClick={() => setFieldModalOpen(true)}>
                Field Verification (Current: {fieldVerificationStatus})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DOCUMENT INTELLIGENCE SIMULATION */}
      {activeSection === 'doc-ai' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '14px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Upload Land Record or Deed</h3>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Simulated OCR & NLP entity extractor parses scanned deed PDF/images and cross-references extracted metadata with official cadastral databases.
            </p>

            <label
              style={{
                border: '2px dashed var(--border-card)',
                borderRadius: '10px',
                padding: '30px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--bg-card-alt)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Upload size={28} style={{ color: 'var(--brand-accent-blue)' }} />
              <div style={{ fontSize: '12.5px', fontWeight: 600 }}>Click to select sample Deed / Jamabandi Scan</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Simulates OCR extraction on client-side</div>
              <input type="file" onChange={handleSimulatedUpload} style={{ display: 'none' }} />
            </label>

            {uploadedFile && (
              <div style={{ fontSize: '12px', color: 'var(--brand-accent-cyan)' }}>
                Selected file: <strong>{uploadedFile}</strong>
              </div>
            )}
            {extracting && (
              <div style={{ fontSize: '12px', color: 'var(--status-warning)' }}>
                ⚡ Processing OCR entity extraction and polygon cross-reference...
              </div>
            )}
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Extracted Field Entities</h3>
            {extractedData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ background: 'var(--bg-card-alt)', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PARCEL ID</span>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{extractedData.parcel}</div>
                  </div>
                  <div style={{ background: 'var(--bg-card-alt)', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ULPIN</span>
                    <div style={{ fontWeight: 700, color: 'var(--brand-accent-cyan)', fontSize: '11.5px' }}>{extractedData.ulpin}</div>
                  </div>
                  <div style={{ background: 'var(--bg-card-alt)', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PRIMARY RIGHTS HOLDER</span>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{extractedData.owner}</div>
                  </div>
                  <div style={{ background: 'var(--bg-card-alt)', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>STANDARDIZED AREA</span>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{extractedData.area}</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} style={{ color: 'var(--status-success)' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--status-success)' }}>
                      Entity Match Confirmed ({extractedData.confidence} Confidence)
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Extracted deed fields match 100% with Punjab Land Records Jamabandi database.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                Upload any document to simulate AI extraction and instant cross-validation.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. DUPLICATES DETECTION */}
      {activeSection === 'duplicates' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Duplicate Parcel Candidate Queue</h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Probabilistic cross-matching based on cadastral geometry overlap, survey numbers, and ownership records.
              </p>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--brand-accent-cyan)' }}>
              {duplicatesList.length > 0 ? `${duplicatesList.length} Candidates Detected` : 'Registry Clean (0 Pending)'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(duplicatesList.length > 0
              ? duplicatesList
              : [
                  {
                    id: 1,
                    parcel_id: 'P-1027',
                    candidate_parcel_id: 'P-1027-ALT',
                    similarity_score: 0.94,
                    matched_fields: 'survey_no, area, owner_name',
                    reason: 'High spatial and title concordance between legacy Jamabandi and digitized cadastral vector.',
                    status: 'PENDING_REVIEW'
                  },
                  {
                    id: 2,
                    parcel_id: 'P-1025',
                    candidate_parcel_id: 'P-1034',
                    similarity_score: 0.78,
                    matched_fields: 'boundary_proximity, survey_khasra',
                    reason: 'Adjoining boundary overlap detected in municipal building plan overlay.',
                    status: 'UNDER_REVIEW'
                  }
                ]
            ).map((dup) => (
              <div
                key={dup.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  background: 'var(--bg-card-alt)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong>{dup.parcel_id}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>⟷</span>
                    <strong style={{ color: 'var(--brand-accent-cyan)' }}>{dup.candidate_parcel_id}</strong>
                    <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--brand-accent-cyan)', fontWeight: 700 }}>
                      {Math.round((dup.similarity_score || 0.85) * 100)}% SIMILARITY
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Matched Factors: <span style={{ color: 'var(--text-secondary)' }}>{dup.matched_fields}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {dup.reason}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', background: dup.status === 'CONFIRMED_DUPLICATE' ? 'var(--bg-badge-red)' : 'var(--bg-badge-blue)', color: dup.status === 'CONFIRMED_DUPLICATE' ? 'var(--status-error)' : 'var(--brand-accent-cyan)', fontWeight: 600 }}>
                    {dup.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PREDICTIVE DECISION SUPPORT */}
      {activeSection === 'predictive' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>
              Decision Support &amp; Executive Analytics ({analyticsData?.time_period || 'Live State'})
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Source: {analyticsData?.data_basis || 'PLOT360 Real-Time Master Registry'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ background: 'var(--bg-card-alt)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TOTAL MONITORED PARCELS</span>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-accent-blue)', marginTop: '4px' }}>
                {analyticsData?.kpis?.total_parcels || 10}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Cadastral polygons registered with ULPIN</div>
            </div>

            <div style={{ background: 'var(--bg-card-alt)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>VERIFICATION RATE</span>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--status-success)', marginTop: '4px' }}>
                {analyticsData?.kpis?.verification_rate || '98.4%'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Title &amp; spatial integrity cross-verified</div>
            </div>

            <div style={{ background: 'var(--bg-card-alt)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ACTIVE AI SATELLITE ALERTS</span>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--status-warning)', marginTop: '4px' }}>
                {analyticsData?.kpis?.active_ai_alerts || 3}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Sentinel-2 temporal divergence anomalies</div>
            </div>

            <div style={{ background: 'var(--bg-card-alt)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>OPEN CROSS-DEPT CONFLICTS</span>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--status-error)', marginTop: '4px' }}>
                {analyticsData?.kpis?.open_conflicts || 2}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Under joint administrative review</div>
            </div>

            <div style={{ background: 'var(--bg-card-alt)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ACTIVE CITIZEN WORKFLOWS</span>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--brand-accent-cyan)', marginTop: '4px' }}>
                {analyticsData?.kpis?.service_requests_active || 4}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Average turnaround: {analyticsData?.kpis?.avg_service_turnaround_days || 4.2} days</div>
            </div>

            <div style={{ background: 'var(--bg-card-alt)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DATA FRESHNESS &amp; PROVENANCE</span>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--status-success)', marginTop: '4px' }}>
                {analyticsData?.kpis?.data_freshness_score || '96.8%'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Immutable audit trail: {analyticsData?.kpis?.provenance_traceability || '100%'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
