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
  Gauge,
  ArrowRight,
  ExternalLink,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateParcelPdf } from '../../utils/pdfGenerator';

export default function PresentationModeModal() {
  const {
    activeParcel,
    selectParcel,
    activeModule,
    setActiveModule,
    setEvidenceModalOpen,
    setFieldModalOpen,
    setUnifiedReportOpen,
    currentRole,
    currentLanguage,
    currentJurisdiction,
    currentLocation,
    changeLocation,
    isTourOpen,
    setIsTourOpen,
    tourStep,
    setTourStep,
    tourStage,
    setTourStage,
    tourActiveTab,
    setTourActiveTab,
    t
  } = useApp();

  const [stepIndex, setStepIndex] = useState((tourStep || 1) - 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);

  // 20-Step Dynamic Live Tour Sequence with 3 Crisp Bullet Points & App Driving Targets
  const presentationSteps = [
    {
      step: 1,
      title: '1. Land Governance Problem: Siloed Databases',
      category: 'PROBLEM & CONTEXT',
      targetModule: 'explorer',
      targetParcel: 'P-1027',
      bullets: [
        '📌 Fragmented Land Administration: Historically records are trapped across 6+ unconnected departments (Revenue, Registration, Planning, Municipal, Banks, Survey).',
        '🔍 Cost of Data Silos: Results in property title disputes, unauthorized constructions, encroached buffers, and municipal revenue leakage.',
        '🚀 PLOT360 Unified Solution: Single source of truth unifying cadastral polygons, ownership deeds, and statutory permissions.'
      ],
      actionLabel: 'Explore Unified Cadastral Map',
      actionType: 'navigate'
    },
    {
      step: 2,
      title: '2. Common Identifier: 14-Digit ULPIN Standard',
      category: 'NATIONAL STANDARD',
      targetModule: 'explorer',
      targetParcel: 'P-1027',
      bullets: [
        '📌 The "Aadhaar of Land": 14-digit alphanumeric geospatial hash (e.g. IN-PB-CHD-0001027) generated from polygon vertex centroids.',
        '🔍 Eliminates Legacy Ambiguity: Replaces disjointed village Khasra and Khata numbers with a unique national coordinate key.',
        '🚀 Deterministic Cross-Indexing: Every state department indexes their records using this authoritative identifier.'
      ],
      actionLabel: 'Highlight Authoritative ULPIN',
      actionType: 'navigate'
    },
    {
      step: 3,
      title: '3. Multi-Plot GIS Cadastral Basemap',
      category: 'GIS & SPATIAL',
      targetModule: 'explorer',
      targetParcel: 'P-1027',
      bullets: [
        '📌 High-Res Google Maps Integration: Georeferenced vector cadastral polygons rendered directly over satellite basemaps.',
        '🔍 Spatial Indexing: Real-time parcel selection, bounding box query, and dual-unit area conversion (metric & local).',
        '🚀 Interactive Zoning Visualization: Color-coded zoning overlays (Commercial, Residential, Agricultural, Eco-Buffers).'
      ],
      actionLabel: 'Examine Live Map Geometry',
      actionType: 'navigate'
    },
    {
      step: 4,
      title: '4. Record of Rights (Jamabandi / Bhoomi RoR)',
      category: 'REVENUE DEPARTMENT',
      targetModule: 'intelligence',
      targetParcel: 'P-1027',
      targetStage: 2,
      bullets: [
        '📌 Live Land Records Department Link: Direct digital connection to state Jamabandi RoR registers.',
        '🔍 Co-Sharer Transparency: Absolute Freehold ownership with 100% legal title registered to Ravinder Singh.',
        '🚀 Mutation Ledger Audit: Real-time synchronization of inheritance and transfer mutation orders.'
      ],
      actionLabel: 'Inspect RoR Jamabandi Ledger',
      actionType: 'navigate'
    },
    {
      step: 5,
      title: '5. Ownership & Registered Deeds',
      category: 'SUB-REGISTRAR REGISTRATION',
      targetModule: 'intelligence',
      targetParcel: 'P-1027',
      targetStage: 2,
      bullets: [
        '📌 Sub-Registrar Office Integration: Instant retrieval of registered sale deeds, conveyances, and stamp duty receipts.',
        '🔍 Historical Chain of Title: Chronological provenance tracing registered property transfers across decades.',
        '🚀 Anti-Fraud Protection: Prevents fraudulent double-mortgaging and unauthorized power-of-attorney sales.'
      ],
      actionLabel: 'Audit Registered Title Deeds',
      actionType: 'navigate'
    },
    {
      step: 6,
      title: '6. Master Plan 2031 & Zoning Compliance',
      category: 'TOWN PLANNING',
      targetModule: 'intelligence',
      targetParcel: 'P-1027',
      targetStage: 3,
      bullets: [
        '📌 Town & Country Planning Validation: Permissible land use confirmed against statutory Master Plan 2031.',
        '🔍 Floor Area Ratio (FAR) Enforcement: Permitted FAR 1.75 strictly monitored against municipal limits.',
        '🚀 Right-of-Way Protection: Confirmed zero encroachment on designated municipal transit and utility corridors.'
      ],
      actionLabel: 'Verify Permissible Land Use',
      actionType: 'navigate'
    },
    {
      step: 7,
      title: '7. Municipal Building Sanction & Plinth',
      category: 'MUNICIPAL CORPORATION (ULB)',
      targetModule: 'intelligence',
      targetParcel: 'P-1027',
      targetStage: 3,
      bullets: [
        '📌 Urban Local Body Building Sanction: Sanction Order #PJB/BP/2023/114 approved for Ground + 2 floors.',
        '🔍 Plinth Area Verification: Sanctioned architectural parameters cross-referenced against satellite footprint.',
        '🚀 Completion Status: Active valid building permit with structural stability certifications.'
      ],
      actionLabel: 'Review Building Sanction Specs',
      actionType: 'navigate'
    },
    {
      step: 8,
      title: '8. Consolidated Cadastral Dossier & Flowchart',
      category: 'UNIFIED DOSSIER',
      targetModule: 'intelligence',
      targetParcel: 'P-1027',
      targetStage: 4,
      actionType: 'dossier',
      bullets: [
        '📌 Interactive Lifecycle Flowchart: Visual 5-stage pipeline from acquisition and RoR to satellite AI verification.',
        '🔍 Multi-Departmental Integration: Aggregates Revenue, Sub-Registrar, Town Planning, Municipal, and CERSAI data.',
        '🚀 Presentation-Grade Intelligence: Concise bullet points and metric indicators eliminate repetitive clutter.'
      ],
      actionLabel: 'Launch Interactive Flowchart Dossier'
    },
    {
      step: 9,
      title: '9. Property Tax Assessment & Municipal Valuation',
      category: 'REVENUE & TAXATION',
      targetModule: 'intelligence',
      targetParcel: 'P-1027',
      targetStage: 5,
      bullets: [
        '📌 Municipal Tax Ledger: GIS-linked property tax assessment (Receipt #PT-CHD-2024-8902).',
        '🔍 Revenue Recovery: ₹18,400 paid and cleared up to date with zero municipal attachment notices.',
        '🚀 Eliminates Leakage: Matches physical cadastral footprint to municipal tax rolls, recovering lost revenue.'
      ],
      actionLabel: 'Review Property Tax Ledger',
      actionType: 'navigate'
    },
    {
      step: 10,
      title: '10. Utilities & Infrastructure Connectivity',
      category: 'CIVIC UTILITIES',
      targetModule: 'intelligence',
      targetParcel: 'P-1027',
      targetStage: 5,
      bullets: [
        '📌 Tri-Utility Integration: Active Electricity meter (#99210), municipal water connection, and sewerage.',
        '🔍 Service Feasibility Check: Validates legitimate infrastructure access prior to commercial transactions.',
        '🚀 Easement Mapping: Visualizes underground utility conduits and power transmission easements.'
      ],
      actionLabel: 'Verify Civic Utility Grid',
      actionType: 'navigate'
    },
    {
      step: 11,
      title: '11. Environmental & Green Belt Restrictions',
      category: 'ECO-SENSITIVE BUFFERS',
      targetModule: 'intelligence',
      targetParcel: 'P-1027',
      targetStage: 3,
      bullets: [
        '📌 Spatial Buffer Intersection: Automated GIS cross-check against wetlands, forests, and floodplains.',
        '🔍 Buffer Clearance: Verified 100% clear of Sukhna Lake wetland and Shivalik eco-sensitive buffers.',
        '🚀 Statutory Enforcement: Blocks unpermitted high-density construction in protected conservation belts.'
      ],
      actionLabel: 'Check Ecological Buffer Status',
      actionType: 'navigate'
    },
    {
      step: 12,
      title: '12. Temporal Satellite Earth Observation',
      category: 'COPERNICUS SENTINEL-2',
      targetModule: 'explorer',
      targetParcel: 'P-1027',
      actionType: 'evidence',
      bullets: [
        '📌 Copernicus Sentinel-2 BOA Reflectance: Multi-temporal 10m multispectral satellite differencing (2020 vs 2026).',
        '🔍 Unpermitted Change Detection: Spectral anomaly flags candidate plinth construction during study window.',
        '🚀 Draggable Split View: Interactive visual before-and-after slider provides verifiable physical proof.'
      ],
      actionLabel: 'Launch Sentinel-2 Satellite Slider'
    },
    {
      step: 13,
      title: '13. Explainable AI & Human-in-the-Loop Review',
      category: 'RESPONSIBLE AI',
      targetModule: 'explorer',
      targetParcel: 'P-1027',
      actionType: 'field',
      bullets: [
        '📌 Ethical AI Guardrails: AI flags candidate changes but never executes punitive decisions automatically.',
        '🔍 Mobile Field Verification: Automatically queues tasks for revenue inspectors to upload geo-tagged site photos.',
        '🚀 Verified State Transitions: Only certified officer inspections resolve AI change alerts on the state ledger.'
      ],
      actionLabel: 'Inspect Field Verification Workflow'
    },
    {
      step: 14,
      title: '14. Automated Cross-Departmental Conflict Engine',
      category: 'DATA RECONCILIATION',
      targetModule: 'workflows',
      targetParcel: 'P-1028',
      targetTab: 'conflicts',
      bullets: [
        '📌 Cross-Registry Consistency Engine: Continuously scans Revenue, Tax, Planning, and Cadastre records.',
        '🔍 Discrepancy Detection: P-1028 flags area mismatch between RoR (1,416 m²) and Municipal Tax (1,530 m²).',
        '🚀 Resolution Workflows: Inter-departmental portal allows joint demarcations to resolve historic mismatches.'
      ],
      actionLabel: 'Analyze Cross-Department Conflicts',
      actionType: 'navigate'
    },
    {
      step: 15,
      title: '15. Single-Window Citizen Land Services',
      category: 'CITIZEN EMPOWERMENT',
      targetModule: 'workflows',
      targetParcel: 'P-1027',
      targetTab: 'citizen',
      bullets: [
        '📌 Transparent Digital Portal: Citizens apply for land demarcation, Non-Encumbrance Certificates, and mutation.',
        '🔍 Statutory SLA Countdown: 15-day service-level agreement tracking with real-time milestone notifications.',
        '🚀 Zero Office Visits: Fully contactless digital land governance accessible from mobile and desktop.'
      ],
      actionLabel: 'Explore Citizen Services Portal',
      actionType: 'navigate'
    },
    {
      step: 16,
      title: '16. Inter-Departmental Workflow & Case Tracking',
      category: 'OFFICER CASE LIFECYCLE',
      targetModule: 'workflows',
      targetParcel: 'P-1027',
      targetTab: 'workflows',
      bullets: [
        '📌 Unified State Machine: Coordinates applications across Revenue Officers, Town Planners, and Sub-Registrars.',
        '🔍 Escalation Protocols: Automated escalation to District Collector if SLA deadlines are exceeded.',
        '🚀 Digital Audit Integration: Every approval or query is cryptographically signed and logged.'
      ],
      actionLabel: 'View Active Case Workflows',
      actionType: 'navigate'
    },
    {
      step: 17,
      title: '17. Geospatial Analytics & Executive BI',
      category: 'EXECUTIVE INTELLIGENCE',
      targetModule: 'analytics',
      targetParcel: 'P-1027',
      targetTab: 'decision',
      bullets: [
        '📌 Macro Geospatial Insights: Macro-level analytics spanning all 25 study locations in 18 Indian states.',
        '🔍 Performance Benchmarks: 99.2% ULPIN adoption, 91.4% tax recovery, and 400+ mapped parcels.',
        '🚀 Frontier Growth Modeling: Identifies urban expansion corridors and infrastructure investment priorities.'
      ],
      actionLabel: 'Inspect Geospatial Analytics Hub',
      actionType: 'navigate'
    },
    {
      step: 18,
      title: '18. Immutable Audit Trail & Provenance Ledger',
      category: 'AUDIT & COMPLIANCE',
      targetModule: 'admin',
      targetParcel: 'P-1027',
      targetTab: 'admin',
      bullets: [
        '📌 SHA-256 Tamper-Evidence: Every mutation, record update, and inspection is cryptographically logged.',
        '🔍 CAG & State Auditor Portal: Dedicated compliance auditor role enables statutory multi-agency oversight.',
        '🚀 Zero Ledger Alteration: Guarantees past records cannot be manipulated retroactively.'
      ],
      actionLabel: 'Inspect Immutable Audit Trail',
      actionType: 'navigate'
    },
    {
      step: 19,
      title: '19. Official Land Passport (PDF Dossier)',
      category: 'EXECUTIVE ARTIFACT',
      targetModule: 'explorer',
      targetParcel: 'P-1027',
      actionType: 'pdf',
      bullets: [
        '📌 Catchy Executive Brief: High-impact single-page Land Passport with 4 metric cards and 5 crisp bullet points.',
        '🔍 Institutional KYC: Used by mortgage banks for rapid credit underwriting and buyers for title due diligence.',
        '🚀 Vector QR Seal: Includes 2D matrix cryptographic seal linking directly to online verification.'
      ],
      actionLabel: 'Download Executive Land Passport (PDF)'
    },
    {
      step: 20,
      title: '20. National Land Stack Vision (SIH 2024)',
      category: 'PRODUCTION READINESS',
      targetModule: 'explorer',
      targetParcel: 'P-1027',
      bullets: [
        '📌 From Boundaries to Insights: Complete architectural blueprint unifying India\'s land administration.',
        '🔍 Scalable Microservices: FastAPI backend + GIS spatial engine ready for national state deployment.',
        '🚀 Verified Conformance: 142/142 tests passing across security, spatial indexing, RBAC, and analytics.'
      ],
      actionLabel: 'Complete Tour & Return to Workspace',
      actionType: 'finish'
    }
  ];

  const currentStepData = presentationSteps[stepIndex] || presentationSteps[0];

  // Drive the application underneath dynamically as presentation proceeds
  useEffect(() => {
    const s = presentationSteps[stepIndex];
    if (!s) return;

    if (s.targetModule) {
      setActiveModule(s.targetModule);
    }
    if (s.targetParcel) {
      selectParcel(s.targetParcel);
    }
    if (s.targetStage && setTourStage) {
      setTourStage(s.targetStage);
    }
    if (s.targetTab && setTourActiveTab) {
      setTourActiveTab(s.targetTab);
    }

    // Auto-trigger corresponding modals for interactive showcase steps
    if (s.actionType === 'dossier') {
      setUnifiedReportOpen(true);
      setEvidenceModalOpen(false);
      setFieldModalOpen(false);
    } else if (s.actionType === 'evidence') {
      setEvidenceModalOpen(true);
      setUnifiedReportOpen(false);
      setFieldModalOpen(false);
    } else if (s.actionType === 'field') {
      setFieldModalOpen(true);
      setUnifiedReportOpen(false);
      setEvidenceModalOpen(false);
    } else {
      setUnifiedReportOpen(false);
      setEvidenceModalOpen(false);
      setFieldModalOpen(false);
    }
  }, [stepIndex]);

  // Auto-Tour Timer
  useEffect(() => {
    let timer = null;
    let interval = null;

    if (isPlaying) {
      setTimerProgress(0);
      const stepDuration = 6000; // 6 seconds per step
      const tick = 100;
      let elapsed = 0;

      interval = setInterval(() => {
        elapsed += tick;
        setTimerProgress(Math.min(100, (elapsed / stepDuration) * 100));
      }, tick);

      timer = setTimeout(() => {
        setStepIndex((prev) => {
          if (prev >= presentationSteps.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, stepDuration);
    } else {
      setTimerProgress(0);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, stepIndex]);

  const handleNext = () => {
    setStepIndex((prev) => Math.min(presentationSteps.length - 1, prev + 1));
  };

  const handlePrev = () => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleExecuteAction = () => {
    const s = currentStepData;
    if (s.actionType === 'dossier') {
      setUnifiedReportOpen(true);
    } else if (s.actionType === 'evidence') {
      setEvidenceModalOpen(true);
    } else if (s.actionType === 'field') {
      setFieldModalOpen(true);
    } else if (s.actionType === 'pdf') {
      generateParcelPdf(activeParcel, currentRole);
    } else if (s.actionType === 'finish') {
      setIsTourOpen(false);
      setActiveModule('explorer');
    } else if (s.targetModule) {
      setActiveModule(s.targetModule);
    }
  };

  return (
    <div className="live-tour-hud-container">
      {/* 1. Header Row */}
      <div className="live-tour-hud-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="live-tour-pulse-icon">
            <Tv size={15} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="live-tour-hud-badge">LIVE APP TOUR</span>
              <span className="live-tour-step-counter">
                STEP {stepIndex + 1} OF {presentationSteps.length}
              </span>
            </div>
            <span style={{ fontSize: '10.5px', color: 'var(--brand-accent-cyan)', fontWeight: 600 }}>
              {currentStepData.category}
            </span>
          </div>
        </div>

        {/* Step Selector Dropdown & Exit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            className="live-tour-step-select"
            value={stepIndex}
            onChange={(e) => setStepIndex(Number(e.target.value))}
          >
            {presentationSteps.map((s, idx) => (
              <option key={s.step} value={idx}>
                {s.step}. {s.title.replace(/^[0-9]+\.\s*/, '')}
              </option>
            ))}
          </select>

          <button
            className={`live-tour-play-btn ${isPlaying ? 'active' : ''}`}
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause Auto-Tour' : 'Start Auto-Tour (6s per feature)'}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Pause' : 'Auto Tour'}</span>
          </button>

          <button
            className="icon-btn"
            onClick={() => setIsTourOpen(false)}
            title="Exit Live Tour"
            style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--status-error)' }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Timer Progress Bar (Only during auto-tour) */}
      <div className="live-tour-progress-track">
        <div
          className="live-tour-progress-fill"
          style={{ width: isPlaying ? `${timerProgress}%` : `${((stepIndex + 1) / 20) * 100}%` }}
        />
      </div>

      {/* 2. Feature Title & Catchy 3-Bullet-Point Summary Card */}
      <div className="live-tour-card-body">
        <h3 className="live-tour-feature-title">{currentStepData.title}</h3>

        <div className="live-tour-bullets-container">
          {currentStepData.bullets.map((b, i) => (
            <div key={i} className="live-tour-bullet-row">
              <span className="live-tour-bullet-text">{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Footer Action Controls */}
      <div className="live-tour-hud-footer">
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '11.5px', gap: '4px' }}
            onClick={handlePrev}
            disabled={stepIndex === 0}
          >
            <SkipBack size={13} />
            <span>Prev</span>
          </button>
          <button
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '11.5px', gap: '4px' }}
            onClick={handleNext}
            disabled={stepIndex === presentationSteps.length - 1}
          >
            <span>Next</span>
            <SkipForward size={13} />
          </button>
        </div>

        {/* Live System Action Button */}
        <button
          className="btn-primary"
          style={{
            padding: '6px 16px',
            fontSize: '11.5px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            boxShadow: '0 0 14px rgba(56, 189, 248, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onClick={handleExecuteAction}
        >
          {currentStepData.actionType === 'pdf' ? <Download size={13} /> : <ExternalLink size={13} />}
          <span>{currentStepData.actionLabel}</span>
        </button>
      </div>
    </div>
  );
}
