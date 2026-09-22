import React, { useState, useEffect, useRef } from 'react';
import {
  Tv,
  X,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  LogOut,
  CheckCircle,
  Shield,
  Layers,
  MapPin,
  Building,
  FileText,
  AlertTriangle,
  Sparkles,
  Share2,
  Activity,
  Globe,
  Gauge
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PresentationModeModal() {
  const {
    activeParcel,
    selectParcel,
    setActiveModule,
    setEvidenceModalOpen,
    setFieldModalOpen,
    setUnifiedReportOpen,
    currentRole,
    currentLanguage,
    currentJurisdiction,
    currentLocation,
    changeLocation,
    t
  } = useApp();

  // Demonstration parcel choices across demo catalog
  const demoParcelsList = [
    { id: 'P-1027', name: 'P-1027: Chandigarh AI Sentinel-2 Change Alert & Approved Building', ulpin: 'IN-PB-CHD-0001027', loc: 'Chandigarh' },
    { id: 'P-1028', name: 'P-1028: Chandigarh Area Discrepancy Conflict (RoR 1,416m² vs Tax 1,530m²)', ulpin: 'IN-PB-CHD-0001028', loc: 'Chandigarh' },
    { id: 'P-1025', name: 'P-1025: Chandigarh Commercial Complex (Amrik Builders)', ulpin: 'IN-PB-CHD-0001025', loc: 'Chandigarh' },
    { id: 'P-1009', name: 'P-1009: Chandigarh Institutional Zone (Govt Medical College)', ulpin: 'IN-PB-CHD-0001009', loc: 'Chandigarh' },
    { id: 'P-3001', name: 'P-3001: Bengaluru Outer Ring Road IT Tech Corridor', ulpin: 'IN-KA-BLR-0003001', loc: 'Bengaluru' },
    { id: 'P-7001', name: 'P-7001: Lucknow Gomti Nagar Commercial Hub', ulpin: 'IN-UP-LKO-0007001', loc: 'Lucknow' }
  ];

  // 20-Step Cinematic Guided Demo Sequence aligned with SIH Problem & Architecture
  const presentationSteps = [
    {
      step: 1,
      title: '1. Land Governance Problem: Siloed Databases',
      desc: 'In India, land administration historically suffers from fragmented records across 6+ departments: Revenue (RoR Jamabandi), Registration (Deeds), Survey & Cadastre, Town Planning (Zoning/Master Plans), Municipal Corporation (Property Tax), and Banks (Mortgages). Silos cause title disputes, unauthorized constructions, and revenue leakages.',
      actionLabel: 'Initialize PLOT360 Unified Land Stack',
      category: 'PROBLEM'
    },
    {
      step: 2,
      title: '2. Common Identifier: 14-Digit ULPIN Standard',
      desc: 'PLOT360 establishes the 14-digit Unique Land Parcel Identification Number (e.g. IN-PB-CHD-0001027) as the single authoritative anchor (the "Aadhaar of Land") linking all departmental records deterministically.',
      actionLabel: 'Bind Parcel to ULPIN Registry',
      category: 'IDENTIFIER'
    },
    {
      step: 3,
      title: '3. Multi-Plot GIS Cadastral Basemap',
      desc: 'High-resolution Google Maps basemaps integrated with georeferenced vector cadastral polygons and centroid coordinates. Every parcel in the jurisdiction is interactively selectable with bounding box filtering.',
      actionLabel: 'Examine Georeferenced Cadastral Vector',
      category: 'GIS'
    },
    {
      step: 4,
      title: '4. Governance & RoR (Jamabandi Record of Rights)',
      desc: 'Live linkage to state Land Records Department showing tenure type (Freehold/Leasehold), joint ownership shares, cultivation status, and latest mutation transaction timestamp.',
      actionLabel: 'Verify Record of Rights',
      category: 'REVENUE'
    },
    {
      step: 5,
      title: '5. Ownership & Registered Deeds',
      desc: 'Sub-Registrar Department integration retrieving registered conveyance deeds, registered sale agreements, stamp duty receipts, and digital transfer histories.',
      actionLabel: 'Audit Registered Title Deeds',
      category: 'REGISTRATION'
    },
    {
      step: 6,
      title: '6. Master Plan, Land Use & Zoning',
      desc: 'Town and Country Planning integration validating permissible land use categories (Residential / Commercial / Agricultural / Mixed-Use), master plan alignment, and Floor Area Ratio (FAR) ceilings.',
      actionLabel: 'Verify Permissible Land Use & Zoning',
      category: 'PLANNING'
    },
    {
      step: 7,
      title: '7. Building Sanction & Built-up Compliance',
      desc: 'Municipal Urban Local Body (ULB) building sanction ledger cross-referencing approved plinth area, permitted floors, building sanction order number, and construction completion certificates.',
      actionLabel: 'Cross-Check Building Sanction Plan',
      category: 'BUILDING'
    },
    {
      step: 8,
      title: '8. Liabilities, Mortgages & Encumbrances',
      desc: 'Banking & CERSAI integration detecting equitable mortgages, financial liens, hypothecation records, and civil court stay orders. In citizen role, confidential financial figures are masked under RBAC.',
      actionLabel: 'Inspect Financial Liens & Encumbrances',
      category: 'LIABILITIES'
    },
    {
      step: 9,
      title: '9. Property Tax Assessment & Municipal Valuation',
      desc: 'Municipal Corporation property tax ledger showing annual rateable value, GIS-based built-up assessment vs assessed area, payment status, and municipal property identifier.',
      actionLabel: 'Review Property Tax Assessment Ledger',
      category: 'TAXATION'
    },
    {
      step: 10,
      title: '10. Utilities & Infrastructure Connectivity',
      desc: 'Multi-utility integration with Jal Board (Water/Sewerage), State Power DISCOM, and telecom infrastructure easements, identifying legitimate municipal service meters.',
      actionLabel: 'Verify Utility Meter Connections',
      category: 'UTILITIES'
    },
    {
      step: 11,
      title: '11. Environmental & Green Belt Restrictions',
      desc: 'Spatial intersection analysis against statutory ecological protection zones, forest buffers, water body catchment zones, and heritage conservation corridors.',
      actionLabel: 'Check Statutory Buffer Restrictions',
      category: 'RESTRICTIONS'
    },
    {
      step: 12,
      title: '12. Temporal Satellite Change Evidence',
      desc: 'Genuine Copernicus Sentinel-2 Bottom-of-Atmosphere (BOA) surface reflectance differencing (2020 vs 2025) across 6 spectral bands. Draggable split slider reveals actual spatial ground development.',
      actionLabel: 'Launch Sentinel-2 Draggable Slider',
      category: 'SATELLITE'
    },
    {
      step: 13,
      title: '13. Explainable AI & Human-in-the-Loop Review',
      desc: 'Siamese U-Net spatial feature extraction highlights candidate building anomalies. Crucially, AI never declares illegality; it queues evidence for field verification officers with geo-tagged photographic inspection.',
      actionLabel: 'Queue for Field Verification Officer',
      category: 'AI_REVIEW'
    },
    {
      step: 14,
      title: '14. Automated Cross-Departmental Conflict Engine',
      desc: 'Continuous consistency checking across 6 departmental databases flags discrepancies (e.g. RoR land area vs Tax registered area, or building construction on agricultural zoning).',
      actionLabel: 'Analyze Cross-Department Conflicts',
      category: 'CONFLICTS'
    },
    {
      step: 15,
      title: '15. Single-Window Citizen Land Services',
      desc: 'Citizen self-service portal for online mutation requests, Non-Encumbrance Certificate (NEC) issuance, building sanction e-filing, and property tax payment with transparent SLA tracking.',
      actionLabel: 'Explore Citizen Digital Portal',
      category: 'CITIZEN'
    },
    {
      step: 16,
      title: '16. Inter-Departmental Workflow & Case Tracking',
      desc: 'Unified state-machine lifecycle tracking service requests across Revenue, Town Planning, and Registration with SLA escalation, digital signature milestones, and role assignments.',
      actionLabel: 'View Active Departmental Workflows',
      category: 'WORKFLOW'
    },
    {
      step: 17,
      title: '17. Geospatial Analytics & Predictive Decision Support',
      desc: 'Executive dashboard visualizing urban expansion frontiers, tax assessment shortfall heatmaps, agricultural land conversion trends, and compliance risk index by ward/tehsil.',
      actionLabel: 'Inspect Geospatial Analytics Hub',
      category: 'ANALYTICS'
    },
    {
      step: 18,
      title: '18. Interoperability Hub & Legacy API Adapters',
      desc: 'RESTful microservice connectors with OpenAPI 3.1 specifications and cryptographic audit trails, enabling legacy state databases to connect without database overhaul.',
      actionLabel: 'Inspect Interoperability Hub',
      category: 'INTEGRATION'
    },
    {
      step: 19,
      title: '19. Multi-State Jurisdiction Architecture',
      desc: 'Federated multi-jurisdiction engine dynamically switching state terminology (e.g., Jamabandi in Punjab/Haryana vs 7/12 Extract in Maharashtra vs Khata in Karnataka) across 15 national study locations.',
      actionLabel: 'Demonstrate Multi-Jurisdiction Engine',
      category: 'JURISDICTIONS'
    },
    {
      step: 20,
      title: '20. Scalability & Nationwide Deployment Readiness',
      desc: 'Cloud-native, containerized architecture supporting nationwide ULPIN scale (140+ million land parcels), zero synthetic imagery, strict server-side RBAC, and full quad-lingual accessibility.',
      actionLabel: 'Conclude Tour & Return to Explorer',
      category: 'SCALE'
    }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 1.5x, 2x
  const timerRef = useRef(null);

  const currentStep = presentationSteps[currentStepIndex];

  // Role permissions check for presentation stages
  const getRoleStepStatus = (stepCategory) => {
    if (currentRole === 'citizen') {
      if (['LIABILITIES', 'CONFLICTS', 'WORKFLOW'].includes(stepCategory)) {
        return { label: 'Citizen View (Protected)', alert: 'Internal officer inspection notes and confidential mortgage amounts are masked under RBAC.' };
      }
    }
    return { label: `Authorized (${currentRole})`, alert: null };
  };

  // Perform step action dynamically
  const executeStepAction = (stepIdx) => {
    const step = presentationSteps[stepIdx];
    if (!step) return;

    if (stepIdx === 1) {
      // 2. ULPIN
      selectParcel(activeParcel?.parcel_id || 'P-1027');
    } else if (stepIdx === 2) {
      // 3. GIS
      setActiveModule('explorer');
    } else if (stepIdx === 3 || stepIdx === 4 || stepIdx === 5 || stepIdx === 6 || stepIdx === 7 || stepIdx === 8 || stepIdx === 9 || stepIdx === 10) {
      // Data inspection steps
      setActiveModule('explorer');
    } else if (stepIdx === 11) {
      // 12. Satellite Evidence
      if (activeParcel?.parcel_id === 'P-1027') {
        setEvidenceModalOpen(true);
      }
    } else if (stepIdx === 12) {
      // 13. AI Field review
      setEvidenceModalOpen(false);
      setFieldModalOpen(true);
    } else if (stepIdx === 13) {
      // 14. Conflicts
      setFieldModalOpen(false);
      if (currentRole !== 'citizen') {
        setActiveModule('analytics');
      } else {
        setActiveModule('explorer');
      }
    } else if (stepIdx === 14) {
      // 15. Citizen Services
      setActiveModule('citizen');
    } else if (stepIdx === 15) {
      // 16. Workflow
      setActiveModule('records');
    } else if (stepIdx === 16) {
      // 17. Analytics
      setActiveModule('analytics');
    } else if (stepIdx === 17) {
      // 18. Integrations
      setActiveModule('integrations');
    } else if (stepIdx === 18) {
      // 19. Multi-jurisdiction
      setActiveModule('explorer');
    } else if (stepIdx === 19) {
      // 20. Conclusion
      setActiveModule('explorer');
    }
  };

  // Step advancement
  const handleNext = () => {
    if (currentStepIndex < presentationSteps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      executeStepAction(nextIdx);
    } else {
      setIsPlaying(false);
      handleExit();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      executeStepAction(prevIdx);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    executeStepAction(0);
  };

  const handleExit = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setEvidenceModalOpen(false);
    setFieldModalOpen(false);
    setUnifiedReportOpen(false);
    setActiveModule('explorer');
  };

  // Automated playback timer
  useEffect(() => {
    if (isPlaying) {
      const baseDelay = 4500; // 4.5 seconds at 1x
      const delay = Math.round(baseDelay / playbackSpeed);

      timerRef.current = setTimeout(() => {
        if (currentStepIndex < presentationSteps.length - 1) {
          const nextIdx = currentStepIndex + 1;
          setCurrentStepIndex(nextIdx);
          executeStepAction(nextIdx);
        } else {
          setIsPlaying(false);
        }
      }, delay);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, playbackSpeed]);

  const roleInfo = getRoleStepStatus(currentStep.category);

  return (
    <div className="page-scroll-area">
      {/* 1. Header & Context */}
      <div className="page-header-container">
        <div className="breadcrumb-row">
          <span className="breadcrumb-item">PLOT360</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item">{t('nav.presentation', 'Presentation Mode')}</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item" style={{ color: 'var(--brand-accent-cyan)' }}>
            {isPlaying ? 'Live Auto-Playback' : 'Interactive Guided Tour'}
          </span>
        </div>
        <div className="page-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Tv className="page-icon" />
            <h1 className="page-title">
              {t('presentation.title', 'PLOT360 Cinematic Demonstration & Guided Tour')}
            </h1>
          </div>
          {/* Exit Button */}
          <button
            className="btn-secondary"
            onClick={handleExit}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '12px' }}
          >
            <LogOut size={14} />
            <span>{t('presentation.exit', 'Exit Presentation Mode')}</span>
          </button>
        </div>
        <p className="page-subtitle">
          {t('presentation.subtitle', 'A real-time, API-backed guided demonstration executing authentic PLOT360 workflows, parcel ULPIN queries, satellite temporal differencing, and strict role-based data governance.')}
        </p>
      </div>

      {/* 2. Top Cinema Control Bar (Play, Pause, Next, Prev, Restart, Speed) */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: '12px',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isPlaying ? (
            <button
              className="btn-secondary"
              onClick={() => setIsPlaying(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <Pause size={15} />
              <span>Pause</span>
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={() => setIsPlaying(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px' }}
            >
              <Play size={15} />
              <span>{currentStepIndex === 0 ? 'Play Tour' : 'Resume Play'}</span>
            </button>
          )}

          <button
            className="btn-secondary"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            style={{ padding: '7px 10px' }}
            title="Previous Step"
          >
            <SkipBack size={15} />
          </button>

          <button
            className="btn-secondary"
            onClick={handleNext}
            disabled={currentStepIndex === presentationSteps.length - 1}
            style={{ padding: '7px 10px' }}
            title="Next Step"
          >
            <SkipForward size={15} />
          </button>

          <button
            className="btn-secondary"
            onClick={handleRestart}
            style={{ padding: '7px 10px' }}
            title="Restart from Step 1"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Speed Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>SPEED:</span>
          {[1, 1.5, 2].map((s) => (
            <button
              key={s}
              onClick={() => setPlaybackSpeed(s)}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                borderRadius: '6px',
                border: playbackSpeed === s ? '1px solid var(--brand-accent-blue)' : '1px solid var(--border-subtle)',
                background: playbackSpeed === s ? 'rgba(37, 99, 235, 0.2)' : 'var(--bg-card-alt)',
                color: playbackSpeed === s ? 'var(--brand-accent-cyan)' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Step Indicator & Active Role Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-card-alt)', border: '1px solid var(--border-subtle)', fontSize: '11.5px' }}>
            <Shield size={13} style={{ color: 'var(--brand-accent-cyan)' }} />
            <span style={{ color: 'var(--text-muted)' }}>Role:</span>
            <strong style={{ color: 'var(--text-primary)' }}>{currentRole}</strong>
          </div>
          <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--brand-accent-cyan)' }}>
            STEP {currentStep.step} / {presentationSteps.length}
          </div>
        </div>
      </div>

      {/* 3. Progress Bar */}
      <div style={{ width: '100%', height: '4px', background: 'var(--bg-card-alt)', borderRadius: '2px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${((currentStepIndex + 1) / presentationSteps.length) * 100}%`,
            background: 'linear-gradient(90deg, var(--brand-accent-blue), var(--brand-accent-cyan))',
            transition: 'width 0.4s ease'
          }}
        />
      </div>

      {/* 4. Active Step Showcase Card */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {currentStep.category} ARCHITECTURE STAGE
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              {currentStep.title}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.1)',
                color: 'var(--brand-accent-cyan)',
                border: '1px solid rgba(56, 189, 248, 0.25)'
              }}
            >
              {roleInfo.label}
            </span>
          </div>
        </div>

        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '900px' }}>
          {currentStep.desc}
        </p>

        {roleInfo.alert && (
          <div style={{ background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={16} style={{ color: '#eab308', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{roleInfo.alert}</span>
          </div>
        )}

        {/* Step Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '4px' }}>
          <button
            className="btn-secondary"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
          >
            <SkipBack size={14} />
            <span>Previous Stage</span>
          </button>

          <button
            className="btn-primary"
            onClick={() => {
              executeStepAction(currentStepIndex);
              handleNext();
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 20px', fontSize: '13px' }}
          >
            <span>{currentStep.actionLabel}</span>
            <SkipForward size={14} />
          </button>
        </div>
      </div>

      {/* 5. Demonstration Target Parcel Selector */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: '12px',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Demonstration Target Parcel (Select to Study Across Live Pipeline)
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Active: <strong>{activeParcel?.parcel_id || 'None'}</strong> ({activeParcel?.ulpin || 'No ULPIN'})
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
          {demoParcelsList.map((p, idx) => {
            const isSelected = activeParcel?.parcel_id === p.id;
            return (
              <div
                key={idx}
                onClick={() => selectParcel(p.id)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1.5px solid ${isSelected ? 'var(--brand-accent-blue)' : 'var(--border-subtle)'}`,
                  background: isSelected ? 'rgba(37, 99, 235, 0.12)' : 'var(--bg-card-alt)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'border 0.2s, background 0.2s'
                }}
              >
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    ULPIN: {p.ulpin} • {p.loc}
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle size={18} style={{ color: 'var(--brand-accent-cyan)', flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
