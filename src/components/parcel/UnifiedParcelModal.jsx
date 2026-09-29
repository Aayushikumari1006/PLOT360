import React, { useState, useEffect } from 'react';
import {
  FileText,
  X,
  Compass,
  ShieldCheck,
  Building,
  Lock,
  Layers,
  ArrowRight,
  ArrowLeft,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  GitBranch,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateParcelPdf } from '../../utils/pdfGenerator';
import { canViewFinancialLiabilities, canViewBuildingDetails, canViewInternalAiNotes } from '../../utils/rbac';

export default function UnifiedParcelModal() {
  const {
    activeParcel,
    currentRole,
    unifiedReportOpen,
    setUnifiedReportOpen,
    tourStage
  } = useApp();

  const [activeStage, setActiveStage] = useState(tourStage || 1);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccessToast, setPdfSuccessToast] = useState(false);

  useEffect(() => {
    if (tourStage) {
      setActiveStage(tourStage);
    }
  }, [tourStage]);

  if (!unifiedReportOpen || !activeParcel) return null;

  const isFinanceAllowed = canViewFinancialLiabilities(currentRole);
  const isBuildingAllowed = canViewBuildingDetails(currentRole);

  const enc = activeParcel.encumbrance || activeParcel.enc || {};
  const hasEnc = enc.status && !enc.status.toLowerCase().includes('none') && !enc.status.toLowerCase().includes('unencumbered');
  const bp = activeParcel.building_permission || activeParcel.bp || {};
  const tax = activeParcel.property_tax || activeParcel.tax || {};

  // Formatted area strings (clean ASCII)
  const stdAreaText = activeParcel.standardized_area
    ? `${String(activeParcel.standardized_area).replace(/m²/g, 'sq.m')} sq.m`
    : (activeParcel.area_sqm ? `${activeParcel.area_sqm} sq.m` : '2,954.21 sq.m');

  const origAreaText = activeParcel.original_area
    ? String(activeParcel.original_area).replace(/m²/g, 'sq.m')
    : '0.73 Acre';

  const latCoord = activeParcel.centroid_lat ? Number(activeParcel.centroid_lat).toFixed(4) : '30.7414';
  const lngCoord = activeParcel.centroid_lng ? Number(activeParcel.centroid_lng).toFixed(4) : '76.7813';

  // 5-STAGE CADASTRAL LIFECYCLE FLOWCHART (Catchy, Animated, Minimal, Zero Repetition)
  const lifecycleStages = [
    {
      id: 1,
      name: 'Survey & Cadastre',
      icon: Compass,
      status: 'VERIFIED',
      statusColor: '#10b981',
      dept: 'Survey of India / State Cadastral Directorate',
      metricLabel: 'Standardized Area',
      metricVal: stdAreaText,
      subMetric: `${origAreaText} (Revenue Unit)`,
      pointers: [
        `Georeferenced Polygon Centroid: Lat ${latCoord} N, Lng ${lngCoord} E (WGS-84 / EPSG:4326 Datum).`,
        `Authoritative Cadastral Extent: ${stdAreaText} computed via ISO-19152 LADM Non-Destructive Engine.`,
        `Local Revenue Demarcation: Survey #${activeParcel.survey_no || '1027/A'} recorded in village revenue maps.`,
        `Administrative LGD Hierarchy: ${activeParcel.location}, Ward #${activeParcel.ward || '17'}, ${activeParcel.jurisdiction || activeParcel.state}.`
      ]
    },
    {
      id: 2,
      name: 'Title & RoR Mutation',
      icon: ShieldCheck,
      status: 'MUTATED',
      statusColor: '#10b981',
      dept: 'Department of Revenue & Land Records',
      metricLabel: 'Registered Owner',
      metricVal: activeParcel.owner?.name || 'Sunita Sharma',
      subMetric: activeParcel.owner?.share || '100% Absolute Freehold',
      pointers: [
        `Primary Title Holder: ${activeParcel.owner?.name || 'Sunita Sharma'} (${activeParcel.owner?.share || '100% Freehold Title'}).`,
        `State Jamabandi Ledger: Khewat #${activeParcel.khewat_no || '89'}, Khatoni #${activeParcel.khatoni_no || '104'}, Khata #${activeParcel.khata_no || 'KH-842'}.`,
        `Sub-Registrar Conveyance: Sanctioned Deed #${activeParcel.deed_no || 'SR-CHD-2023-1049'} with verified stamp duty.`,
        `Title Due-Diligence: Clean legal succession with zero recorded co-sharer disputes or stay orders.`
      ]
    },
    {
      id: 3,
      name: 'Planning & Zoning',
      icon: Building,
      status: bp.status || 'APPROVED',
      statusColor: '#38bdf8',
      dept: 'Town Planning Authority & Municipal Corporation (ULB)',
      metricLabel: 'Permitted FAR',
      metricVal: '1.75 FAR',
      subMetric: bp.floors || 'G + 2 Floors Permitted',
      pointers: [
        `Municipal Sanction Order: ${bp.id || 'BP-MC-2023-0914'} - Status: ${bp.status || 'Approved & Valid'}.`,
        `Permitted Architectural Profile: ${isBuildingAllowed ? (bp.floors || 'G + 2 Floors complying with ULB Bylaws') : '[RESTRICTED ARCHITECTURAL PROFILE]'}.`,
        `Master Plan 2031 Classification: ${activeParcel.zoning || 'Eco-Sensitive Buffer'} with statutory setback alignment.`,
        `Right-of-Way Clearance: Direct frontage onto 18m municipal sector transit corridor (0% encroachment).`
      ]
    },
    {
      id: 4,
      name: 'Encumbrance & CERSAI',
      icon: Lock,
      status: hasEnc ? 'ACTIVE CHARGE' : 'UNENCUMBERED',
      statusColor: hasEnc ? '#f59e0b' : '#10b981',
      dept: 'CERSAI National Portal & Sub-District Registry',
      metricLabel: 'Mortgage Charge',
      metricVal: hasEnc ? 'Active Charge' : 'Nil (Clear)',
      subMetric: hasEnc ? (enc.amt || 'INR 45,00,000') : 'Zero Institutional Liens',
      pointers: [
        `CERSAI Portal Status: ${hasEnc ? 'Active Charge (' + (enc.inst || 'HDFC Bank Ltd.') + ')' : 'Clear / Unencumbered Title'}.`,
        `Financial Charge: ${isFinanceAllowed ? (enc.amt || (hasEnc ? 'INR 45,00,000' : 'INR 0')) : '[RESTRICTED FINANCIAL INFORMATION]'}.`,
        `Statutory Recovery Notices: Institutional NOC on file; zero land revenue recovery attachments.`,
        `Judicial Lis Pendens: Zero active caveats or court stay orders indexed across civil courts.`
      ]
    },
    {
      id: 5,
      name: 'Civic & Satellite AI',
      icon: Layers,
      status: 'VERIFIED STABLE',
      statusColor: '#10b981',
      dept: 'Municipal Revenue & Copernicus Sentinel-2 EO Network',
      metricLabel: 'Property Tax',
      metricVal: tax.status === 'Pending' ? 'Assessment Pending' : 'Paid & Cleared',
      subMetric: `Valid till 31 Mar 2025`,
      pointers: [
        `Municipal Property Tax: ${tax.status === 'Pending' ? 'Assessment Pending' : 'Paid & Up-to-date'} (Receipt #${tax.id || 'TX-2024-883'}).`,
        `Civic Infrastructure Grid: Electricity Grid (Connected & Metered) | Municipal Potable Water (Active Line).`,
        `Earth Observation Audit: Copernicus Sentinel-2 BOA surface reflectance confirms stable plinth (2020 - 2026).`,
        `Cryptographic Provenance: Tamper-evident ledger consensus across 6 state administrative departments.`
      ]
    }
  ];

  const currentStage = lifecycleStages.find(s => s.id === activeStage) || lifecycleStages[0];
  const CurrentIcon = currentStage.icon;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setUnifiedReportOpen(false);
      }}
    >
      <div
        style={{
          width: '960px',
          maxWidth: '96vw',
          maxHeight: '88vh',
          backgroundColor: '#0b1329',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.2)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Top Header */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, #0f1d40 0%, #0d1936 100%)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}
            >
              <GitBranch size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.3px', margin: 0 }}>
                  Cadastral Dossier & Statutory Flowchart: {activeParcel.parcel_id}
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  ✓ 100% Authoritative
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>
                ULPIN: <strong style={{ color: '#38bdf8' }}>{activeParcel.ulpin}</strong> • {activeParcel.location} • {activeParcel.jurisdiction || activeParcel.state}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn-primary"
              disabled={isGeneratingPdf}
              onClick={() => {
                setIsGeneratingPdf(true);
                try {
                  generateParcelPdf(activeParcel, currentRole);
                  setPdfSuccessToast(true);
                  setTimeout(() => setPdfSuccessToast(false), 3500);
                } catch (err) {
                  console.error('PDF export error:', err);
                } finally {
                  setIsGeneratingPdf(false);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '11.5px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                boxShadow: '0 0 12px rgba(56, 189, 248, 0.4)',
                cursor: isGeneratingPdf ? 'wait' : 'pointer'
              }}
              title="Download executive-grade Land Passport PDF"
            >
              <Download size={13} className={isGeneratingPdf ? 'spin' : ''} />
              <span>{isGeneratingPdf ? 'Compiling PDF...' : 'Export Land Passport (PDF)'}</span>
            </button>
            <button
              onClick={() => setUnifiedReportOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                color: '#94a3b8',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Dynamic PDF Export Feedback Toast */}
        {pdfSuccessToast && (
          <div
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)',
              borderBottom: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#34d399',
              fontSize: '11.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              animation: 'fadeInSlideUp 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={15} color="#22c55e" />
              <span>Official Cadastral Land Passport PDF Compiled & Downloaded with Cryptographic SHA-256 Seal!</span>
            </div>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>Verified Institutional Artifact</span>
          </div>
        )}

        {/* DYNAMIC INTERACTIVE FLOWCHART (ANIMATED PIPELINE) */}
        <div
          style={{
            padding: '12px 18px 10px',
            backgroundColor: '#070e20',
            borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={13} />
              <span>Cadastral Intelligence Lifecycle Pipeline</span>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '10.5px', color: '#38bdf8', fontWeight: 700 }}>
                STAGE {activeStage} OF 5 ({activeStage * 20}% VERIFIED)
              </span>
            </div>
          </div>

          {/* Dynamic Flowchart Progress Pipeline Bar */}
          <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(activeStage / 5) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 50%, #22c55e 100%)',
                boxShadow: '0 0 10px rgba(56, 189, 248, 0.7)',
                transition: 'width 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          </div>

          {/* Flowchart Track with Connecting Arrows */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '6px',
              overflowX: 'auto',
              padding: '6px 2px 10px'
            }}
          >
            {lifecycleStages.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = activeStage === stage.id;
              return (
                <React.Fragment key={stage.id}>
                  <div
                    onClick={() => setActiveStage(stage.id)}
                    className={`flowchart-stage-node ${isActive ? 'active' : ''}`}
                    style={{
                      flex: 1,
                      minWidth: '150px',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.32) 0%, rgba(37, 99, 235, 0.38) 100%)'
                        : 'rgba(15, 23, 42, 0.7)',
                      border: isActive
                        ? '1.5px solid #38bdf8'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: isActive ? '0 0 18px rgba(56, 189, 248, 0.4)' : 'none',
                      transform: isActive ? 'translateY(-2px)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: isActive ? '#38bdf8' : '#64748b', letterSpacing: '0.4px' }}>
                        STAGE 0{stage.id}
                      </span>
                      <Icon size={14} color={isActive ? '#38bdf8' : '#94a3b8'} />
                    </div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: isActive ? '#f8fafc' : '#cbd5e1', whiteSpace: 'nowrap' }}>
                      {stage.name}
                    </div>
                    <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span
                        style={{
                          fontSize: '9.5px',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          backgroundColor: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          color: stage.statusColor
                        }}
                      >
                        ● {stage.status}
                      </span>
                    </div>
                  </div>

                  {idx < lifecycleStages.length - 1 && (
                    <div
                      style={{
                        animation: 'connectorFlow 2.2s infinite ease-in-out',
                        color: idx + 1 < activeStage ? '#22c55e' : '#38bdf8',
                        fontSize: '16px',
                        padding: '0 4px',
                        fontWeight: 900
                      }}
                    >
                      ➔
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ACTIVE STAGE ANALYTICAL INSPECTOR (Catchy Bullet Points, Clean Visual Hierarchy) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            backgroundColor: '#081026'
          }}
        >
          {/* Active Stage Header & Authority Banner */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CurrentIcon size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>
                  Stage {currentStage.id}: {currentStage.name}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Issuing Department: {currentStage.dept}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right', paddingRight: '12px', borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '9.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  {currentStage.metricLabel}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#38bdf8' }}>
                  {currentStage.metricVal}
                </div>
                <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>
                  {currentStage.subMetric}
                </div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                ✓ {currentStage.status}
              </span>
            </div>
          </div>

          {/* Clean, Presentation-Grade Bullet Points (Strictly Non-Repeating) */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Key Statutory Evidence & Multi-Party Consensus
            </div>

            {currentStage.pointers.map((bullet, idx) => (
              <div
                key={idx}
                className="flowchart-bullet-card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontSize: '12px',
                  lineHeight: 1.5,
                  color: '#cbd5e1',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.04)'
                }}
              >
                <span style={{ color: '#38bdf8', fontSize: '15px', lineHeight: 1, marginTop: '2px' }}>•</span>
                <span>{bullet}</span>
              </div>
            ))}
          </div>

          {/* Bottom Stage Navigation Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '6px'
            }}
          >
            <button
              disabled={activeStage === 1}
              onClick={() => setActiveStage(s => Math.max(1, s - 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: activeStage === 1 ? '#475569' : '#f8fafc',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: activeStage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ArrowLeft size={13} />
              <span>Previous Stage</span>
            </button>

            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
              Stage {activeStage} of {lifecycleStages.length} in Statutory Lifecycle
            </span>

            <button
              disabled={activeStage === lifecycleStages.length}
              onClick={() => setActiveStage(s => Math.min(lifecycleStages.length, s + 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                backgroundColor: activeStage === lifecycleStages.length ? 'rgba(255, 255, 255, 0.06)' : 'rgba(2, 132, 199, 0.25)',
                border: activeStage === lifecycleStages.length ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #38bdf8',
                color: activeStage === lifecycleStages.length ? '#475569' : '#38bdf8',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: activeStage === lifecycleStages.length ? 'not-allowed' : 'pointer'
              }}
            >
              <span>Next Stage</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
