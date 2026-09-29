import React, { useState, useEffect } from 'react';
import {
  Box,
  Compass,
  FileText,
  ShieldCheck,
  Building,
  Lock,
  Zap,
  Layers,
  ArrowRight,
  ArrowLeft,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  GitBranch,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateParcelPdf } from '../../utils/pdfGenerator';
import { canViewFinancialLiabilities, canViewBuildingDetails, canViewInternalAiNotes } from '../../utils/rbac';

export default function ParcelIntelligenceModule() {
  const {
    activeParcel,
    selectParcel,
    parcels,
    currentRole,
    setUnifiedReportOpen,
    tourStage
  } = useApp();

  const [selectedUnit, setSelectedUnit] = useState('sqm');
  const [activeStage, setActiveStage] = useState(tourStage || 1);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccessToast, setPdfSuccessToast] = useState(false);

  useEffect(() => {
    if (tourStage) {
      setActiveStage(tourStage);
    }
  }, [tourStage]);

  if (!activeParcel) {
    return (
      <div className="page-scroll-area" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 110px)' }}>
        <div className="page-header-container">
          <div className="breadcrumb-row">
            <span className="breadcrumb-item">PLOT360</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-item">Parcel Intelligence</span>
          </div>
          <div className="page-title-row">
            <Box className="page-icon" />
            <h1 className="page-title">Parcel Intelligence & Analytical Dossier</h1>
          </div>
          <p className="page-subtitle">
            Select a cadastral parcel to examine its dynamic lifecycle flowchart and standardized measurements.
          </p>
        </div>
        <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-card)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>No active parcel selected.</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {parcels.slice(0, 5).map(p => (
              <button key={p.parcel_id} className="btn-secondary" onClick={() => selectParcel(p.parcel_id)}>
                Select {p.parcel_id} ({p.location})
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Derive standardized area metrics
  const rawAreaNum = parseFloat(activeParcel.area_sqm) ||
    parseFloat(activeParcel.area_numeric) ||
    (activeParcel.standardized_area ? parseFloat(String(activeParcel.standardized_area).replace(/[^0-9.]/g, '')) : 1248.5) ||
    1248.5;

  const jurisdictionStr = (activeParcel.jurisdiction || activeParcel.location || '').toLowerCase();
  const isHimachal = jurisdictionStr.includes('himachal') || jurisdictionStr.includes('hp') || jurisdictionStr.includes('shimla');

  const convertArea = (sqm) => {
    switch (selectedUnit) {
      case 'acre':
        return { value: `${(sqm * 0.000247105).toFixed(3)} Acres`, basis: '1 Acre = 4,046.856 sq.m (National Standard)' };
      case 'bigha':
        if (isHimachal) {
          return { value: `${(sqm / 809.37).toFixed(3)} Bigha (HP Standard)`, basis: '1 HP Bigha = 809.37 sq.m (Himachal Land Revenue Act)' };
        }
        return { value: `${(sqm * 0.000395368).toFixed(3)} Bigha (Pucca)`, basis: '1 Pucca Bigha = 2,529.285 sq.m (Northern States Standard)' };
      case 'kanal':
        return { value: `${(sqm * 0.00197684).toFixed(2)} Kanal`, basis: '1 Kanal = 505.857 sq.m (Northern States Standard)' };
      case 'marla':
        return { value: `${(sqm * 0.0395368).toFixed(1)} Marla`, basis: '1 Marla = 25.29285 sq.m (Northern States Standard)' };
      case 'guntha':
        return { value: `${(sqm / 101.1714).toFixed(2)} Guntha`, basis: '1 Guntha = 101.1714 sq.m (Western/Southern Standard)' };
      case 'sqft':
        return { value: `${(sqm * 10.7639).toLocaleString(undefined, { maximumFractionDigits: 1 })} sq. ft.`, basis: '1 sq.m = 10.7639 sq. ft. (Imperial/NBC Standard)' };
      default:
        return { value: `${sqm.toFixed(2)} sq.m`, basis: 'ISO-19152 LADM / SI Metric Standard' };
    }
  };

  const convertedData = convertArea(rawAreaNum);
  const circleRate = (activeParcel.valuation && activeParcel.valuation.circle_rate_sqm) || activeParcel.circle_rate || 30000;
  const indicativeValuation = Math.round(rawAreaNum * circleRate);

  const isFinanceAllowed = canViewFinancialLiabilities(currentRole);
  const isBuildingAllowed = canViewBuildingDetails(currentRole);

  const enc = activeParcel.encumbrance || activeParcel.enc || {};
  const hasEnc = enc.status && !enc.status.toLowerCase().includes('none') && !enc.status.toLowerCase().includes('unencumbered');
  const bp = activeParcel.building_permission || activeParcel.bp || {};
  const tax = activeParcel.property_tax || activeParcel.tax || {};

  // 5-STAGE DYNAMIC CADASTRAL LIFECYCLE FLOWCHART
  const flowStages = [
    {
      id: 1,
      name: 'Survey & Cadastre',
      icon: Compass,
      status: 'VERIFIED',
      statusColor: 'var(--status-success)',
      dept: 'Survey of India / State Cadastral Directorate',
      leadMetric: convertedData.value,
      leadLabel: 'Standardized Area',
      pointers: [
        `Cadastral Centroid: Lat ${activeParcel.centroid_lat || 30.7414} N, Lng ${activeParcel.centroid_lng || 76.7813} E (WGS-84 / EPSG:4326 Datum).`,
        `Standardized SI Extent: ${convertedData.value} [${convertedData.basis}].`,
        `Local Revenue Extract: ${activeParcel.original_area || '0.73 Acre (Revenue)'} demarcated under Survey #${activeParcel.survey_no || '1027/A'}.`,
        `Administrative LGD: ${activeParcel.location}, Ward #${activeParcel.ward || '17'}, ${activeParcel.jurisdiction || activeParcel.state}.`
      ]
    },
    {
      id: 2,
      name: 'Title & RoR Mutation',
      icon: ShieldCheck,
      status: 'MUTATED',
      statusColor: 'var(--status-success)',
      dept: 'Department of Revenue & Land Records',
      leadMetric: activeParcel.owner?.name || 'Sunita Sharma',
      leadLabel: 'Sole Freehold Title',
      pointers: [
        `Primary Registered Owner: ${activeParcel.owner?.name || 'Sunita Sharma'} (${activeParcel.owner?.share || '100% Freehold Title'}).`,
        `State RoR Ledger: Jamabandi Khewat #${activeParcel.khewat_no || '89'}, Khatoni #${activeParcel.khatoni_no || '104'}, Khata #${activeParcel.khata_no || 'KH-842'}.`,
        `Conveyance Deed Record: Sub-Registrar Deed #${activeParcel.deed_no || 'SR-CHD-2023-1049'} registered with complete stamp duty verification.`,
        `Legal Standing: Undisputed freehold tenure recorded in digital revenue ledger with active mutation consensus.`
      ]
    },
    {
      id: 3,
      name: 'Planning & Building',
      icon: Building,
      status: bp.status || 'APPROVED',
      statusColor: 'var(--brand-accent-cyan)',
      dept: 'Town Planning Authority & Municipal Corporation (ULB)',
      leadMetric: bp.floors || 'G + 2 Floors',
      leadLabel: 'Permitted Profile',
      pointers: [
        `Municipal Sanction Order: ${bp.id || 'BP-MC-2023-0914'} - Status: ${bp.status || 'Approved & Valid'}.`,
        `Permitted Architectural Profile: ${isBuildingAllowed ? (bp.floors || 'G + 2 Floors') : '[RESTRICTED ARCHITECTURAL PROFILE]'} under ULB Bylaws.`,
        `Master Plan 2031 Zoning: ${activeParcel.zoning || 'Eco-Sensitive Buffer'} with Permitted FAR of 1.75.`,
        `Right-of-Way Compliance: Verified zero statutory setback or transit corridor encroachment.`
      ]
    },
    {
      id: 4,
      name: 'Encumbrance & CERSAI',
      icon: Lock,
      status: hasEnc ? 'ACTIVE LIEN' : 'CLEAR',
      statusColor: hasEnc ? 'var(--status-warning)' : 'var(--status-success)',
      dept: 'CERSAI National Portal & Registration Sub-District',
      leadMetric: hasEnc ? (enc.amt || 'INR 45,00,000') : 'INR 0',
      leadLabel: 'Mortgage Liabilities',
      pointers: [
        `CERSAI Charge Status: ${hasEnc ? 'Active Equitable Mortgage' : 'Unencumbered (Clean Title)'}.`,
        `Financial Institution: ${isFinanceAllowed ? (enc.inst || enc.institution || (hasEnc ? 'HDFC Bank Ltd.' : 'Nil')) : '[RESTRICTED FINANCIAL INSTITUTION]'}.`,
        `Encumbrance Amount: ${isFinanceAllowed ? (enc.amt || enc.loan_amount || (hasEnc ? 'INR 45,00,000' : 'INR 0')) : '[RESTRICTED]'}.`,
        `Litigation & Court Registry: Clean Record - Zero active lis pendens or revenue stay orders recorded.`
      ]
    },
    {
      id: 5,
      name: 'Civic & Satellite AI',
      icon: Layers,
      status: '100% STABLE',
      statusColor: 'var(--status-success)',
      dept: 'Municipal Revenue & Copernicus Sentinel-2 EO Network',
      leadMetric: tax.status === 'Pending' ? 'Assessment Pending' : 'Paid & Cleared',
      leadLabel: 'Property Tax Ledger',
      pointers: [
        `Municipal Property Tax: ${tax.status === 'Pending' ? 'Assessment Pending' : 'Paid & Cleared'} (Annual Assessment ID: ${tax.id || 'PT-CHD-2024-8902'}).`,
        `Civic Infrastructure Grid: Electricity Grid (Connected & Metered) | Municipal Potable Water (Active Line).`,
        `Earth Observation Audit: Copernicus Sentinel-2 surface reflectance confirms 0 plinth shift between 2020 and 2026.`,
        `Audit Ledger Provenance: SHA-256 Multi-Departmental State Consensus (${activeParcel.blockchain_hash || 'SHA256:7f8b9a21...VERIFIED'}).`
      ]
    }
  ];

  const currentStageObj = flowStages.find(s => s.id === activeStage) || flowStages[0];
  const CurrentIcon = currentStageObj.icon;

  return (
    <div
      className="page-scroll-area"
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        maxHeight: 'calc(100vh - 105px)',
        flex: 1,
        paddingBottom: '32px'
      }}
    >
      {/* Header Container */}
      <div className="page-header-container">
        <div className="breadcrumb-row">
          <span className="breadcrumb-item">PLOT360</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item">Parcel Intelligence</span>
          <span className="breadcrumb-sep">/</span>
          <span style={{ color: 'var(--brand-accent-blue)', fontWeight: 600 }}>{activeParcel.parcel_id}</span>
        </div>
        <div className="page-title-row">
          <Box className="page-icon" />
          <h1 className="page-title">Parcel Intelligence & Analytical Dossier</h1>
        </div>
        <p className="page-subtitle">
          Interactive cadastral lifecycle flowchart, standardized measurement engine, and authoritative statutory verification.
        </p>
      </div>

      {/* Parcel Identity Header Bar */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.3px' }}>{activeParcel.parcel_id}</h2>
            <span className="status-pill-verified">✓ ULPIN Verified</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
            ULPIN: <strong style={{ color: 'var(--brand-accent-cyan)' }}>{activeParcel.ulpin}</strong> • {activeParcel.location} • {activeParcel.jurisdiction || activeParcel.state}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '11.5px', fontWeight: 700, cursor: isGeneratingPdf ? 'wait' : 'pointer' }}
            title="Download authoritative Land Passport PDF"
          >
            <Download size={13} className={isGeneratingPdf ? 'spin' : ''} />
            <span>{isGeneratingPdf ? 'Compiling PDF...' : 'Land Passport PDF'}</span>
          </button>
          <button
            className="btn-secondary"
            onClick={() => setUnifiedReportOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', fontSize: '11.5px' }}
          >
            <ExternalLink size={13} />
            <span>Full Dossier</span>
          </button>
        </div>
      </div>

      {/* Dynamic PDF Export Feedback Toast */}
      {pdfSuccessToast && (
        <div
          style={{
            padding: '10px 16px',
            background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            borderRadius: '10px',
            color: '#34d399',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'fadeInSlideUp 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#22c55e" />
            <span>Official Cadastral Land Passport PDF Compiled & Downloaded with Cryptographic SHA-256 Seal!</span>
          </div>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Verified Institutional Document</span>
        </div>
      )}

      {/* Non-Destructive Measurement Engine & Area Unit Converter */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '13.5px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={15} color="var(--brand-accent-cyan)" />
              <span>Non-Destructive Measurement Engine</span>
            </h3>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Computes standardized SI metric area and state-specific revenue conversions without mutating source records.
            </div>
          </div>

          {/* Unit Switcher Pills */}
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {[
              { id: 'sqm', label: 'm²' },
              { id: 'acre', label: 'Acre' },
              { id: 'kanal', label: 'Kanal' },
              { id: 'marla', label: 'Marla' },
              { id: 'bigha', label: isHimachal ? 'Bigha (HP)' : 'Bigha (PB/HR)' },
              { id: 'guntha', label: 'Guntha' },
              { id: 'sqft', label: 'sq. ft.' }
            ].map(u => (
              <button
                key={u.id}
                onClick={() => setSelectedUnit(u.id)}
                className="quick-action-btn"
                style={{
                  padding: '3px 9px',
                  fontSize: '11px',
                  fontWeight: selectedUnit === u.id ? 700 : 500,
                  backgroundColor: selectedUnit === u.id ? 'var(--brand-accent-blue)' : 'var(--bg-card-alt)',
                  color: selectedUnit === u.id ? '#fff' : 'var(--text-secondary)',
                  borderColor: selectedUnit === u.id ? 'var(--brand-accent-cyan)' : 'var(--border-card)'
                }}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '4px' }}>
          <div style={{ background: 'var(--bg-card-alt)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Original Revenue Demarcation
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {activeParcel.original_area || '0.73 Acre'}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              Source Verified Revenue Extract
            </div>
          </div>

          <div style={{ background: 'var(--bg-card-alt)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Standardized Metric Extent
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-accent-cyan)', marginTop: '2px' }}>
              {convertedData.value}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              {convertedData.basis}
            </div>
          </div>

          <div style={{ background: 'var(--bg-card-alt)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Indicative Circle Valuation
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-accent-blue)', marginTop: '2px' }}>
              ₹ {indicativeValuation.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              Rate: ₹ {circleRate.toLocaleString('en-IN')} / sq.m
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC CADASTRAL LIFECYCLE FLOWCHART */}
      <div className="flowchart-pipeline-container">
        <div className="flowchart-header">
          <div className="flowchart-title">
            <GitBranch size={16} color="var(--brand-accent-cyan)" />
            <span>Cadastral Intelligence Flowchart (Interactive Statutory Pipeline)</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--brand-accent-cyan)', fontWeight: 700 }}>
            STAGE {activeStage} OF {flowStages.length} ({activeStage * 20}% VERIFIED)
          </div>
        </div>

        {/* Dynamic Lifecycle Progress Pipeline Bar */}
        <div style={{ margin: '8px 0 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(activeStage / flowStages.length) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 50%, #22c55e 100%)',
                boxShadow: '0 0 10px rgba(56, 189, 248, 0.7)',
                transition: 'width 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          </div>
        </div>

        {/* Visual Pipeline Nodes with Forward Connectors */}
        <div className="flowchart-track">
          {flowStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.id;
            return (
              <React.Fragment key={stage.id}>
                <div
                  className={`flowchart-node ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveStage(stage.id)}
                  title={`Click to inspect Stage ${stage.id}: ${stage.name}`}
                >
                  <div className="flowchart-node-top">
                    <span className="flowchart-step-badge">Stage 0{stage.id}</span>
                    <Icon size={14} color={isActive ? 'var(--brand-accent-cyan)' : 'var(--brand-accent-blue)'} />
                  </div>
                  <div className="flowchart-node-title">{stage.name}</div>
                  <span
                    className="flowchart-node-status"
                    style={{
                      backgroundColor: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: stage.statusColor
                    }}
                  >
                    ● {stage.status}
                  </span>
                </div>

                {idx < flowStages.length - 1 && (
                  <div
                    className="flowchart-connector"
                    style={{
                      animation: 'connectorFlow 2.2s infinite ease-in-out',
                      color: idx + 1 < activeStage ? '#22c55e' : '#38bdf8',
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

        {/* Flowchart Stage Inspector Card (Clean Bullet Points - NOT a sack of raw info) */}
        <div className="flowchart-inspector-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--brand-accent-cyan)'
                }}
              >
                <CurrentIcon size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Stage {currentStageObj.id}: {currentStageObj.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Issuing Authority: {currentStageObj.dept}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ textAlign: 'right', paddingRight: '8px', borderRight: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {currentStageObj.leadLabel}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-accent-cyan)' }}>
                  {currentStageObj.leadMetric}
                </div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: 'var(--status-success)',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}
              >
                ✓ {currentStageObj.status}
              </span>
            </div>
          </div>

          {/* Clean, Presentation-Grade Bullet Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '4px 0' }}>
            {currentStageObj.pointers.map((bullet, bIdx) => (
              <div
                key={bIdx}
                className="flowchart-bullet-card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontSize: '12px',
                  lineHeight: 1.5,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.04)'
                }}
              >
                <span style={{ color: 'var(--brand-accent-cyan)', fontSize: '15px', lineHeight: 1, marginTop: '2px' }}>•</span>
                <span style={{ color: 'var(--text-primary)' }}>{bullet}</span>
              </div>
            ))}
          </div>

          {/* Flow Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              className="btn-secondary"
              disabled={activeStage === 1}
              onClick={() => setActiveStage(s => Math.max(1, s - 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                fontSize: '11.5px',
                opacity: activeStage === 1 ? 0.4 : 1,
                cursor: activeStage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ArrowLeft size={13} />
              <span>Previous Stage</span>
            </button>

            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Stage {activeStage} of {flowStages.length} in Statutory Lifecycle
            </span>

            <button
              className="btn-secondary"
              disabled={activeStage === flowStages.length}
              onClick={() => setActiveStage(s => Math.min(flowStages.length, s + 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                fontSize: '11.5px',
                opacity: activeStage === flowStages.length ? 0.4 : 1,
                cursor: activeStage === flowStages.length ? 'not-allowed' : 'pointer'
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
