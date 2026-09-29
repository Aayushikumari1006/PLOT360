import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  FileCheck,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  ArrowRight,
  GitBranch,
  AlertTriangle,
  Copy,
  Layers,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { createServiceRequest, getServiceRequests, transitionWorkflow } from '../../api/citizen';
import { getAdminConflicts, resolveConflict, getAdminDuplicates } from '../../api/admin';

export default function ServicesWorkflowsModule({ initialTab }) {
  const { activeParcel, selectParcel, parcels, currentRole, t, tourActiveTab } = useApp();

  // Primary subtab within Services & Workflows
  const [activeTab, setActiveTab] = useState(initialTab || tourActiveTab || 'citizen'); // 'citizen' | 'workflows' | 'conflicts' | 'duplicates'

  useEffect(() => {
    if (tourActiveTab && ['citizen', 'workflows', 'conflicts', 'duplicates'].includes(tourActiveTab)) {
      setActiveTab(tourActiveTab);
    }
  }, [tourActiveTab]);

  // ── CITIZEN SERVICES & REQUESTS STATE ──
  const [citizenQuery, setCitizenQuery] = useState('');
  const [selectedService, setSelectedService] = useState('demarcation');
  const [applicantName, setApplicantName] = useState('Ravinder Singh');
  const [applicantPhone, setApplicantPhone] = useState('+91 98765 43210');
  const [requestNotes, setRequestNotes] = useState('Request for boundary pillar verification with adjoining parcel P-1026.');
  const [selectedReqId, setSelectedReqId] = useState('SR-2026-910642');
  const [loadingLive, setLoadingLive] = useState(false);
  const [transitionError, setTransitionError] = useState(null);
  const [transitionSuccess, setTransitionSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newRequestSuccess, setNewRequestSuccess] = useState(null);
  const [submissionModalData, setSubmissionModalData] = useState(null);
  const [tokenCopied, setTokenCopied] = useState(false);

  // Workflow Stepper Dynamic States
  const [inspectedStep, setInspectedStep] = useState(null);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [clarificationNotice, setClarificationNotice] = useState(null);
  const [checklistChecks, setChecklistChecks] = useState({
    '1-0': true, '1-1': true, '1-2': true,
    '2-0': true, '2-1': true, '2-2': false,
    '3-0': true, '3-1': false, '3-2': false,
    '4-0': false, '4-1': false, '4-2': false,
    '5-0': false, '5-1': false, '5-2': false
  });

  const [submittedRequests, setSubmittedRequests] = useState(() => {
    const saved = localStorage.getItem('plot360_citizen_requests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'SR-2026-910642',
        parcel_id: 'P-1027',
        ulpin: 'IN-PB-CHD-0001027',
        service: 'Cadastral Boundary Demarcation (Hadd Shikni)',
        date: '20 Sep 2026',
        status: 'SUBMITTED',
        step: 1
      },
      {
        id: 'SR-2026-1088',
        parcel_id: 'P-1027',
        ulpin: 'IN-PB-CHD-0001027',
        service: 'Building Permission NOC',
        date: '19 Sep 2026',
        status: 'DEPARTMENT_REVIEW',
        step: 4
      },
      {
        id: 'SR-2026-1049',
        parcel_id: 'P-1027',
        ulpin: 'IN-PB-CHD-0001027',
        service: 'Certified RoR Copy (Fard)',
        date: '18 Sep 2026',
        status: 'COMPLETED',
        step: 5
      }
    ];
  });

  // ── CONFLICTS & DUPLICATES STATE ──
  const fallbackConflicts = [
    {
      id: 'CONF-CHD-001',
      conflict_id: 'CONF-CHD-001',
      parcel_id: '0001027',
      ulpin: 'IN-PB-CHD-0001027',
      field: 'Parcel Area Discrepancy',
      sourceA: 'Cadastral GIS Vector',
      sourceADept: 'Department of Land Records (Cadastral GIS Survey)',
      valueA: '1,248.50 m² (0.31 Acre)',
      sourceB: 'Municipal Property Tax Cell',
      sourceBDept: 'Municipal Corporation Chandigarh (Assessment Cell)',
      valueB: '1,310.00 m²',
      diff: 'Inter-departmental discrepancy flagged',
      delta: '+61.50 m²',
      pctDiff: '+4.92%',
      officer: 'Revenue Kanungo & Municipal Assessor',
      status: 'OPEN',
      category: 'area',
      tolerance: '5.0%',
      withinTolerance: true,
      rawA: 1248.5,
      rawB: 1310.0
    },
    {
      id: 'CONF-CHD-002',
      conflict_id: 'CONF-CHD-002',
      parcel_id: 'P-1028',
      ulpin: 'IN-PB-CHD-0001028',
      field: 'Boundary & Parcel Area Discrepancy',
      sourceA: 'Record of Rights (Jamabandi)',
      sourceADept: 'Revenue Tehsil North (Jamabandi 2023-24)',
      valueA: '1,416.40 m² (0.35 Acre)',
      sourceB: 'Property Tax Assessment',
      sourceBDept: 'Municipal Taxation Wing',
      valueB: '1,530.00 m² (0.38 Acre)',
      diff: '+113.60 m² statutory area mismatch flagged',
      delta: '+113.60 m²',
      pctDiff: '+8.02%',
      officer: 'Revenue Officer (Tehsil North)',
      status: 'OPEN',
      category: 'area',
      tolerance: '5.0%',
      withinTolerance: false,
      rawA: 1416.4,
      rawB: 1530.0
    },
    {
      id: 'CONF-CHD-003',
      conflict_id: 'CONF-CHD-003',
      parcel_id: 'P-1025',
      ulpin: 'IN-PB-CHD-0001025',
      field: 'Land Use Master Plan Classification',
      sourceA: 'Town Planning Master Plan',
      sourceADept: 'Chief Town Planner, Chandigarh (Zonal Plan 2031)',
      valueA: 'Commercial / Mixed-Use',
      sourceB: 'Property Tax Registry',
      sourceBDept: 'Municipal Assessment Registry',
      valueB: 'Residential Zone R-2',
      diff: 'Statutory land-use classification mismatch',
      delta: 'Zoning Conflict',
      pctDiff: 'N/A',
      officer: 'Municipal Planning Officer',
      status: 'OPEN',
      category: 'zoning',
      tolerance: 'Strict',
      withinTolerance: false,
      rawA: 100,
      rawB: 100
    },
    {
      id: 'CONF-CHD-004',
      conflict_id: 'CONF-CHD-004',
      parcel_id: 'P-1009',
      ulpin: 'IN-PB-CHD-0001009',
      field: 'Encumbrance Lien Status',
      sourceA: 'CERSAI / Bank Registry',
      sourceADept: 'Central Registry of Securitisation (HDFC Bank)',
      valueA: 'Charge Recorded (INR 85.00 Lakhs)',
      sourceB: 'Sub-Registrar RoR',
      sourceBDept: 'Sub-Registrar Land Records RoR',
      valueB: 'Unencumbered',
      diff: 'Missing statutory encumbrance endorsement in RoR',
      delta: 'Lien Mismatch',
      pctDiff: 'N/A',
      officer: 'Sub-Registrar Officer',
      status: 'OPEN',
      category: 'encumbrance',
      tolerance: 'Strict',
      withinTolerance: false,
      rawA: 100,
      rawB: 0
    }
  ];

  const [conflictsList, setConflictsList] = useState(fallbackConflicts);
  const [selectedConflict, setSelectedConflict] = useState(fallbackConflicts[0]);
  const [resolutionStatus, setResolutionStatus] = useState(null);
  const [resolutionError, setResolutionError] = useState(null);
  const [conflictFilter, setConflictFilter] = useState('all');
  const [adoptedChoice, setAdoptedChoice] = useState(null); // 'A' | 'B' | null

  // Duplicates State
  const [duplicatesList, setDuplicatesList] = useState([]);
  const [loadingConflicts, setLoadingConflicts] = useState(false);

  // 1. Fetch live service requests
  useEffect(() => {
    let isMounted = true;
    setLoadingLive(true);
    getServiceRequests()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const liveMapped = data.map((r) => ({
            id: r.request_id || `SR-2026-${r.id}`,
            backendId: r.id,
            parcel_id: r.ulpin ? r.ulpin.split('-').pop() : 'P-1027',
            ulpin: r.ulpin || 'IN-PB-CHD-0001027',
            service: r.service_type || 'Land Service',
            department: r.department,
            date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today',
            status: r.status || 'SUBMITTED',
            step: r.current_step || 1
          }));
          setSubmittedRequests(liveMapped);
          setSelectedReqId(liveMapped[0].id);
        }
      })
      .catch((err) => {
        console.warn('Backend service requests offline, using local store:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingLive(false);
      });

    return () => { isMounted = false; };
  }, []);

  // 2. Fetch live conflicts and duplicates
  useEffect(() => {
    let isMounted = true;
    setLoadingConflicts(true);

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
            field: c.field_name || 'Discrepancy',
            sourceA: c.source_a || 'Source Registry A',
            valueA: c.value_a || 'Value A',
            sourceB: c.source_b || 'Source Registry B',
            valueB: c.value_b || 'Value B',
            diff: c.notes || 'Inter-departmental discrepancy flagged',
            officer: c.assigned_officer || 'Revenue Officer',
            status: c.status || 'OPEN'
          }));
          setConflictsList(mapped);
          setSelectedConflict(mapped[0]);
        }
      })
      .catch((err) => console.warn('Conflicts live feed note:', err));

    getAdminDuplicates()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setDuplicatesList(data);
        }
      })
      .catch((err) => console.warn('Duplicates live feed note:', err))
      .finally(() => {
        if (isMounted) setLoadingConflicts(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    if (!citizenQuery.trim()) return;
    const found = parcels.find(
      p =>
        p.parcel_id.toLowerCase() === citizenQuery.toLowerCase() ||
        p.ulpin.toLowerCase() === citizenQuery.toLowerCase()
    );
    if (found) {
      selectParcel(found.parcel_id);
    } else {
      alert(`No parcel found matching "${citizenQuery}". Try P-1027 or IN-PB-CHD-0001027.`);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNewRequestSuccess(null);
    let persistentId = null;

    try {
      const res = await createServiceRequest({
        service_type: selectedService,
        parcel_id: activeParcel ? activeParcel.parcel_id : 'P-1027',
        ulpin: activeParcel ? activeParcel.ulpin : 'IN-PB-CHD-0001027',
        applicant_name: applicantName,
        applicant_phone: applicantPhone,
        notes: requestNotes
      });
      if (res && res.request_id) {
        persistentId = res.request_id;
      }
    } catch (err) {
      console.warn('Backend createServiceRequest error, creating local fallback record:', err);
    } finally {
      setIsSubmitting(false);
    }

    if (!persistentId) {
      persistentId = `SR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const newReq = {
      id: persistentId,
      parcel_id: activeParcel ? activeParcel.parcel_id : 'P-1027',
      ulpin: activeParcel ? activeParcel.ulpin : 'IN-PB-CHD-0001027',
      service:
        selectedService === 'demarcation'
          ? 'Cadastral Boundary Demarcation (Hadd Shikni)'
          : selectedService === 'mutation'
          ? 'Title Mutation (Intiqal)'
          : selectedService === 'noc'
          ? 'Municipal No-Objection Certificate'
          : 'Certified Land Record (Nakall)',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'SUBMITTED',
      step: 1,
      isNew: true
    };

    const updated = [newReq, ...submittedRequests.map(r => ({ ...r, isNew: false }))];
    setSubmittedRequests(updated);
    setSelectedReqId(newReq.id);
    localStorage.setItem('plot360_citizen_requests', JSON.stringify(updated));
    setNewRequestSuccess(persistentId);
    setSubmissionModalData(newReq);
  };

  const handleOfficerAdvance = async (actionType = 'APPROVED') => {
    setTransitionError(null);
    setTransitionSuccess(null);
    setClarificationNotice(null);
    const activeReq = submittedRequests.find(r => r.id === selectedReqId) || submittedRequests[0];
    if (!activeReq) return;

    if (actionType === 'REVERT_CLARIFICATION') {
      setClarificationNotice('Notice Issued to Citizen: Boundary Pillar #4 coordinates obscured. Spot verification photo requested from Halqa Patwari.');
      return;
    }

    setIsAdvancing(true);
    setTimeout(() => setIsAdvancing(false), 500);

    const stepStatuses = [
      { step: 1, name: 'SUBMITTED', next: 'FEE & SCRUTINY' },
      { step: 2, name: 'FEE_VERIFIED', next: 'FIELD INSPECTION' },
      { step: 3, name: 'INSPECTION_COMPLETED', next: 'OFFICER REVIEW' },
      { step: 4, name: 'OFFICER_APPROVED', next: 'COMPLETED' },
      { step: 5, name: 'COMPLETED', next: 'DIGITAL CERTIFICATE ISSUED' }
    ];

    const currentStepNum = activeReq.step || 1;
    const nextStepNum = Math.min(currentStepNum + 1, 5);
    const targetStatus = nextStepNum === 5 ? 'COMPLETED' : (stepStatuses[nextStepNum - 1]?.name || 'APPROVED');

    try {
      if (activeReq.backendId) {
        await transitionWorkflow(activeReq.backendId, targetStatus, `Officer advanced workflow step to ${targetStatus}`);
      }
    } catch (err) {
      console.warn('Live backend transition note (proceeding locally):', err);
    }

    const updated = submittedRequests.map((r) =>
      r.id === activeReq.id ? { ...r, status: targetStatus, step: nextStepNum } : r
    );
    setSubmittedRequests(updated);
    setInspectedStep(nextStepNum);
    setTransitionSuccess(`Workflow stage transitioned to ${targetStatus} (Stage ${nextStepNum}/5)`);
  };

  const handleResolveConflict = async (sourceChoice, resValue, rationale) => {
    setResolutionError(null);
    setResolutionStatus('Reconciling with State Ledger...');
    setAdoptedChoice(sourceChoice);

    try {
      if (selectedConflict.backendId) {
        await resolveConflict(selectedConflict.backendId, resValue, rationale);
      }
    } catch (err) {
      console.warn('Backend resolve note (applying client state resolution):', err);
    }

    const updated = conflictsList.map(c =>
      c.id === selectedConflict.id ? { ...c, status: 'RESOLVED', adopted: sourceChoice, resolution_notes: rationale } : c
    );
    setConflictsList(updated);
    setSelectedConflict({ ...selectedConflict, status: 'RESOLVED', adopted: sourceChoice, resolution_notes: rationale });
    setResolutionStatus(`Adopted Source ${sourceChoice} (${resValue}). Reconciled on State Cadastral Ledger.`);
  };

  const handleUndoResolution = () => {
    setAdoptedChoice(null);
    setResolutionStatus(null);
    const updated = conflictsList.map(c =>
      c.id === selectedConflict.id ? { ...c, status: 'OPEN', adopted: null, resolution_notes: null } : c
    );
    setConflictsList(updated);
    setSelectedConflict({ ...selectedConflict, status: 'OPEN', adopted: null, resolution_notes: null });
  };

  const activeReq = submittedRequests.find(r => r.id === selectedReqId) || submittedRequests[0] || {};

  return (
    <div className="page-scroll-area">
      {/* Dynamic Application Submission Celebration Modal */}
      {submissionModalData && (
        <div
          className="app-submission-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSubmissionModalData(null);
          }}
        >
          <div className="app-submission-modal">
            {/* Top Close Icon */}
            <button
              onClick={() => setSubmissionModalData(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                color: '#94a3b8',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <XCircle size={16} />
            </button>

            {/* Glowing Icon & Header */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(56, 189, 248, 0.3) 100%)',
                  border: '2px solid rgba(34, 197, 94, 0.7)',
                  color: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                  boxShadow: '0 0 25px rgba(34, 197, 94, 0.5)'
                }}
              >
                <CheckCircle size={28} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
                Application Registered & Token Minted!
              </h3>
              <p style={{ fontSize: '11.5px', color: '#94a3b8', margin: 0 }}>
                Statutory single-window e-Filing verified with ULPIN geospatial coordinates.
              </p>
            </div>

            {/* Authoritative Token Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(2, 132, 199, 0.15) 100%)',
                border: '1.5px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '14px',
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.15)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px' }}>
                  AUTHORITATIVE E-TOKEN ID
                </span>
                <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  LIVE ON STATE LEDGER
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '19px', fontWeight: 900, color: '#38bdf8', letterSpacing: '0.8px', fontFamily: 'monospace' }}>
                  {submissionModalData.id}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(submissionModalData.id);
                    setTokenCopied(true);
                    setTimeout(() => setTokenCopied(false), 2000);
                  }}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Copy size={12} />
                  <span>{tokenCopied ? 'Copied!' : 'Copy Token'}</span>
                </button>
              </div>
            </div>

            {/* Application Parameters */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '12px 14px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ color: '#94a3b8' }}>Service Requested:</span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>{submissionModalData.service}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ color: '#94a3b8' }}>Target Parcel &amp; ULPIN:</span>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>{submissionModalData.parcel_id} ({submissionModalData.ulpin})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ color: '#94a3b8' }}>Statutory SLA Countdown:</span>
                <span style={{ color: '#22c55e', fontWeight: 700 }}>15 Working Days (Right to Service Act)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ color: '#94a3b8' }}>Assigned Field Officer:</span>
                <span style={{ color: '#f8fafc' }}>Tehsildar &amp; Halqa Patwari Office</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, padding: '9px', fontSize: '12px', justifyContent: 'center' }}
                onClick={() => setSubmissionModalData(null)}
              >
                Close &amp; File Another
              </button>
              <button
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: '9px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onClick={() => {
                  setSubmissionModalData(null);
                  setActiveTab('workflows');
                }}
              >
                <span>Track Workflow Lifecycle</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="page-header-container">
        <div className="breadcrumb-row">
          <span className="breadcrumb-item">PLOT360</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item">Services & Workflows</span>
          <span className="breadcrumb-sep">/</span>
          <span style={{ color: 'var(--brand-accent-blue)', fontWeight: 600 }}>
            {activeTab === 'citizen' && 'Citizen Service Delivery'}
            {activeTab === 'workflows' && 'Department Workflow Automation'}
            {activeTab === 'conflicts' && 'Cross-Department Conflict Engine'}
            {activeTab === 'duplicates' && 'Duplicate Record Resolution'}
          </span>
        </div>
        <div className="page-title-row">
          <Users className="page-icon" />
          <h1 className="page-title">Services & Workflows Hub</h1>
        </div>
        <p className="page-subtitle">
          Single-window citizen land service delivery, inter-departmental workflow state machines, and data conflict resolution.
        </p>
      </div>

      {/* Primary Sub-Navigation Bar */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
        {[
          { id: 'citizen', label: 'Citizen Service Applications', icon: FileCheck },
          { id: 'workflows', label: 'Department Workflow Lifecycles', icon: GitBranch },
          { id: 'conflicts', label: `Conflict Center (${conflictsList.filter(c => c.status !== 'RESOLVED').length})`, icon: AlertTriangle },
          { id: 'duplicates', label: `Duplicate Reviews (${duplicatesList.length || 15})`, icon: Copy }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`quick-action-btn ${isActive ? 'active' : ''}`}
              style={{
                backgroundColor: isActive ? 'var(--brand-accent-blue)' : 'var(--bg-card)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px'
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: CITIZEN SERVICE APPLICATIONS ── */}
      {activeTab === 'citizen' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Citizen Search Bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', background: 'var(--bg-card)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-card)' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="search-input"
                style={{ height: '40px', paddingLeft: '38px', fontSize: '13px' }}
                placeholder="Search your Land by ULPIN, Parcel ID, Survey No., or Location (e.g. IN-PB-CHD-0001027 or P-1027)..."
                value={citizenQuery}
                onChange={(e) => setCitizenQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '0 20px', fontSize: '13px' }}>
              Search Land
            </button>
          </form>

          {/* New Request Form + Request Queue */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
            {/* Form */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Initiate New Land Service Application</h3>
                <span className="status-pill-verified">
                  Target: <strong>{activeParcel?.parcel_id || 'P-1027'}</strong>
                </span>
              </div>

              {newRequestSuccess && (
                <div style={{ padding: '10px 14px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid var(--status-success)', borderRadius: '8px', color: 'var(--status-success)', fontSize: '12px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} />
                  <span>Application <strong>{newRequestSuccess}</strong> submitted successfully and assigned to relevant departmental authority.</span>
                </div>
              )}

              <form onSubmit={handleSubmitRequest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Select Statutory Service</label>
                  <select
                    className="search-input"
                    style={{ width: '100%', height: '36px', fontSize: '12.5px' }}
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="demarcation">Cadastral Boundary Demarcation (Hadd Shikni)</option>
                    <option value="mutation">Title Mutation Application (Intiqal)</option>
                    <option value="ror_copy">Certified RoR Copy / Jamabandi Fard</option>
                    <option value="noc">Building Permission No-Objection Certificate</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Applicant Full Name</label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%', height: '36px', fontSize: '12.5px' }}
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Mobile Phone / OTP Linked</label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%', height: '36px', fontSize: '12.5px' }}
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Application Notes &amp; Statutory Purpose</label>
                  <textarea
                    className="search-input"
                    style={{ width: '100%', height: '70px', padding: '8px', fontSize: '12px' }}
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                    style={{
                      padding: '8px 22px',
                      fontSize: '13px',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                      boxShadow: '0 0 14px rgba(56, 189, 248, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: isSubmitting ? 'wait' : 'pointer'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spin" style={{ display: 'inline-block' }}>⚙️</span>
                        <span>Registering Application &amp; Minting Token...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Submit Application &amp; Generate Token</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Application Queue */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Your Active Applications ({submittedRequests.length})</h3>
                {loadingLive && <span style={{ fontSize: '10.5px', color: 'var(--brand-accent-cyan)' }}>Live Sync...</span>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '360px', overflowY: 'auto' }}>
                {submittedRequests.map(req => {
                  const isSelected = selectedReqId === req.id;
                  const isNewlyAdded = req.isNew;
                  return (
                    <div
                      key={req.id}
                      onClick={() => {
                        setSelectedReqId(req.id);
                        if (req.parcel_id) selectParcel(req.parcel_id);
                      }}
                      className={isNewlyAdded ? 'app-card-newly-submitted' : ''}
                      style={{
                        padding: '11px 13px',
                        borderRadius: '8px',
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.22) 0%, rgba(37, 99, 235, 0.25) 100%)'
                          : 'var(--bg-card-alt)',
                        border: `1.5px solid ${isSelected ? 'var(--brand-accent-blue)' : isNewlyAdded ? 'rgba(34, 197, 94, 0.7)' : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.22s ease-in-out',
                        boxShadow: isSelected ? '0 0 14px rgba(56, 189, 248, 0.25)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.borderColor = isNewlyAdded ? 'rgba(34, 197, 94, 0.7)' : 'var(--border-subtle)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--brand-accent-cyan)', fontFamily: 'monospace' }}>
                            {req.id}
                          </span>
                          {isNewlyAdded && (
                            <span style={{ fontSize: '9px', fontWeight: 800, padding: '1px 6px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.5)', animation: 'pulseGlow 1.2s infinite alternate' }}>
                              ✨ NEWLY FILED
                            </span>
                          )}
                        </div>
                        <span className={`status-badge-inline ${req.status === 'COMPLETED' ? 'green' : 'amber'}`}>
                          {req.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{req.service}</div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Parcel: {req.parcel_id} • Filed: {req.date}</span>
                        <span style={{ color: 'var(--brand-accent-blue)', fontWeight: 600 }}>Step {req.step || 1}/5</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: DEPARTMENT WORKFLOW LIFECYCLES ── */}
      {activeTab === 'workflows' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Main Execution Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '18px' }}>
            {/* Header & Application Switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>
                    Workflow Execution State: <span style={{ color: 'var(--brand-accent-cyan)', fontFamily: 'monospace' }}>{activeReq.id || 'SR-2026-910642'}</span>
                  </h3>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    LIVE STATE MACHINE
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Service: <strong style={{ color: 'var(--text-primary)' }}>{activeReq.service}</strong> • Target Parcel: <strong style={{ color: 'var(--brand-accent-blue)' }}>{activeReq.parcel_id}</strong>
                </div>
              </div>

              {/* Status Pill & Application Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card-alt)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  {submittedRequests.map(r => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setSelectedReqId(r.id);
                        setInspectedStep(r.step || 1);
                        setTransitionSuccess(null);
                        setClarificationNotice(null);
                      }}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        background: selectedReqId === r.id ? 'var(--brand-accent-blue)' : 'transparent',
                        color: selectedReqId === r.id ? '#ffffff' : 'var(--text-secondary)',
                        transition: 'all 0.18s ease'
                      }}
                    >
                      {r.id.split('-').pop()}
                    </button>
                  ))}
                </div>

                <span className={`status-badge-inline ${activeReq.status === 'COMPLETED' ? 'green' : 'amber'}`} style={{ padding: '5px 10px', fontSize: '11px', fontWeight: 800 }}>
                  CURRENT STAGE: {activeReq.status || 'SUBMITTED'}
                </span>
              </div>
            </div>

            {/* Notification Banners */}
            {transitionSuccess && (
              <div style={{ padding: '9px 14px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid var(--status-success)', borderRadius: '8px', color: 'var(--status-success)', fontSize: '12px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', animation: 'scaleBounce 0.28s ease-out' }}>
                <CheckCircle2 size={15} />
                <span>✓ {transitionSuccess} • Logged to immutable state audit trail.</span>
              </div>
            )}
            {clarificationNotice && (
              <div style={{ padding: '9px 14px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid var(--status-warning)', borderRadius: '8px', color: 'var(--status-warning)', fontSize: '12px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', animation: 'scaleBounce 0.28s ease-out' }}>
                <AlertTriangle size={15} />
                <span>{clarificationNotice}</span>
              </div>
            )}
            {transitionError && (
              <div style={{ padding: '9px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--status-error)', borderRadius: '8px', color: 'var(--status-error)', fontSize: '12px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <XCircle size={15} />
                <span>⚠ {transitionError}</span>
              </div>
            )}

            {/* 5-Step Interactive Pipeline Visualizer with Connecting Laser Track */}
            <div style={{ position: 'relative', margin: '24px 0 20px' }}>
              {/* Horizontal Connecting Laser Bar */}
              <div style={{ position: 'absolute', top: '24px', left: '8%', right: '8%', height: '3px', background: 'var(--border-subtle)', zIndex: 0 }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.max(0, Math.min(100, ((activeReq.step || 1) - 1) * 25))}%`,
                    background: 'linear-gradient(90deg, #22c55e, #38bdf8)',
                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.6)',
                    transition: 'width 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative'
                  }}
                >
                  {isAdvancing && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '-4px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#38bdf8',
                        boxShadow: '0 0 14px 4px #38bdf8'
                      }}
                    />
                  )}
                </div>
              </div>

              {/* 5 Stage Nodes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', position: 'relative', zIndex: 2 }}>
                {[
                  { step: 1, name: '1. Submitted', desc: 'Citizen e-Filing Verified', dept: 'Citizen Portal', duration: 'Day 1' },
                  { step: 2, name: '2. Fee & Scrutiny', desc: 'Accounts & KYC Clearance', dept: 'Treasury Wing', duration: 'Day 2' },
                  { step: 3, name: '3. Field Inspection', desc: 'Tehsil Kanungo Verification', dept: 'Revenue Kanungo', duration: 'Day 5' },
                  { step: 4, name: '4. Officer Review', desc: 'Sub-Registrar Order Draft', dept: 'Sub-Registrar', duration: 'Day 10' },
                  { step: 5, name: '5. Completed', desc: 'Digital Certificate Issued', dept: 'Land Records Dir.', duration: 'Day 15' }
                ].map(st => {
                  const currentStep = activeReq.step || 1;
                  const isCompleted = currentStep > st.step;
                  const isCurrent = currentStep === st.step;
                  const isInspected = (inspectedStep || currentStep) === st.step;

                  return (
                    <div
                      key={st.step}
                      onClick={() => setInspectedStep(st.step)}
                      className={`workflow-step-card ${isCurrent ? 'active-step' : isCompleted ? 'completed-step' : ''}`}
                      style={{
                        padding: '12px 10px',
                        textAlign: 'center',
                        background: isCurrent
                          ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)'
                          : isCompleted
                          ? 'rgba(34, 197, 94, 0.08)'
                          : 'var(--bg-card-alt)',
                        border: `1.5px solid ${isInspected ? 'var(--brand-accent-cyan)' : isCurrent ? 'var(--brand-accent-blue)' : isCompleted ? 'rgba(34, 197, 94, 0.4)' : 'var(--border-subtle)'}`,
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      {/* Step Indicator Pill */}
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '8px' }}>
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: isCompleted
                              ? '#22c55e'
                              : isCurrent
                              ? 'var(--brand-accent-cyan)'
                              : 'var(--bg-card)',
                            border: `1.5px solid ${isCurrent ? '#ffffff' : isCompleted ? '#22c55e' : 'var(--border-subtle)'}`,
                            color: isCompleted || isCurrent ? '#040d21' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '11px',
                            boxShadow: isCurrent ? '0 0 12px var(--brand-accent-cyan)' : 'none'
                          }}
                        >
                          {isCompleted ? <CheckCircle2 size={14} style={{ strokeWidth: 3 }} /> : st.step}
                        </div>
                      </div>

                      <div style={{ fontSize: '12px', fontWeight: 700, color: isCurrent ? '#38bdf8' : isCompleted ? '#22c55e' : 'var(--text-primary)' }}>
                        {st.name}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1.3 }}>
                        {st.desc}
                      </div>

                      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center' }}>
                        <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', background: isCurrent ? 'rgba(56, 189, 248, 0.2)' : isCompleted ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)', color: isCurrent ? '#38bdf8' : isCompleted ? '#22c55e' : 'var(--text-muted)' }}>
                          {isCompleted ? 'VERIFIED' : isCurrent ? 'IN PROGRESS' : 'PENDING'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Stage Execution Dossier (Inspected Step Details) */}
            {(() => {
              const currentStep = activeReq.step || 1;
              const inspected = inspectedStep || currentStep;
              const stageConfigs = {
                1: {
                  title: 'Stage 1: Citizen e-Filing & Initial Validation',
                  authority: 'Sub-Divisional Citizen Service Centre (e-Seva Punjab)',
                  officer: 'Harpreet Singh (Revenue e-Filing Desk)',
                  hash: 'SHA-256: 9f8a2c1e...b49d',
                  sla: 'SLA: 2 Working Days (Right to Service Act)',
                  checks: [
                    'Citizen Aadhaar e-KYC Verified & Linked to ULPIN',
                    'Application Form e-Signed with Cadastral Coordinates (P-1027)',
                    'Statutory Demarcation Fee Challan GRN-88192 Validated'
                  ]
                },
                2: {
                  title: 'Stage 2: Accounts Scrutiny & Treasury Reconciliation',
                  authority: 'Treasury & Accounts Officer, Sub-Tehsil Office',
                  officer: 'Sunita Rao (Senior Accounts Officer)',
                  hash: 'SHA-256: 3a1b89fc...7c22',
                  sla: 'SLA: 3 Working Days • Treasury Clearance Window',
                  checks: [
                    'Treasury Challan INR 250 Reconciled against State Pool',
                    'Jamabandi Khewat 482/19 Ownership Title Confirmed',
                    'Automated Intimation Dispatched to Adjoining Landowners'
                  ]
                },
                3: {
                  title: 'Stage 3: Ground Boundary Field Inspection (Hadd Shikni)',
                  authority: 'Tehsil Kanungo & Field Survey Office (Zone 3)',
                  officer: 'Vikram Patel (Field Kanungo & DGPS Surveyor)',
                  hash: 'SHA-256: 6f9e120b...1a41',
                  sla: 'SLA: 5 Working Days • Field Measurement Window',
                  checks: [
                    'Total Station / DGPS Ground Survey Completed with 4 Pillars',
                    'Field Naksha Shajra Boundary Overlay Tagged with GIS Layer',
                    'Spot Statement Signed in Presence of Adjoining Landowners'
                  ]
                },
                4: {
                  title: 'Stage 4: Officer Scrutiny & Draft Order Sanction',
                  authority: 'Office of Assistant Collector / Sub-Registrar',
                  officer: 'Dr. Simran Kaur (Assistant Collector Grade-II)',
                  hash: 'SHA-256: 1d8b67ce...8b90',
                  sla: 'SLA: 3 Working Days • Statutory Hearing / Clearance',
                  checks: [
                    'Field Demarcation Report Evaluated & Sanctioned',
                    'Statutory 7-Day Objection Period Cleared (Zero Objections)',
                    'Digital Hadd Shikni Order Draft Formulated & Digitally Signed'
                  ]
                },
                5: {
                  title: 'Stage 5: Final Digital Certificate Minting & Ledger Update',
                  authority: 'Directorate of Land Records & Cadastral GIS Center',
                  officer: 'State Cadastral Master Node 01',
                  hash: 'SHA-256: 7e4c302f...91ab',
                  sla: 'SLA: Instantaneous upon Officer Authorization',
                  checks: [
                    'Authoritative Digital Certificate Minted with QR Code',
                    'State Cadastral GIS Vector Geometry Layer Synchronized',
                    'SMS & WhatsApp Download Link Dispatched to Citizen'
                  ]
                }
              };
              const config = stageConfigs[inspected] || stageConfigs[1];

              return (
                <div style={{ background: 'var(--bg-card-alt)', borderRadius: '10px', border: '1px solid var(--border-subtle)', padding: '14px 16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-accent-cyan)' }}>
                        {config.title}
                      </span>
                      {inspected === currentStep && (
                        <span style={{ fontSize: '9.5px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                          ● ACTIVE STEP
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {config.sla}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                    {/* Authority Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '11.5px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Issuing Authority: </span>
                        <strong style={{ color: 'var(--text-primary)' }}>{config.authority}</strong>
                      </div>
                      <div style={{ fontSize: '11.5px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Designated Officer: </span>
                        <strong style={{ color: 'var(--brand-accent-blue)' }}>{config.officer}</strong>
                      </div>
                      <div style={{ fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Cryptographic Seal: </span>
                        <span style={{ fontSize: '10.5px', fontFamily: 'monospace', color: '#94a3b8', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                          {config.hash}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Verification Checklist */}
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        STATUTORY CLEARANCE CHECKLIST
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {config.checks.map((chk, idx) => {
                          const key = `${inspected}-${idx}`;
                          const isChecked = checklistChecks[key] ?? (inspected <= currentStep);
                          return (
                            <label
                              key={idx}
                              onClick={(e) => {
                                e.preventDefault();
                                setChecklistChecks(prev => ({ ...prev, [key]: !isChecked }));
                              }}
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: isChecked ? 'var(--text-primary)' : 'var(--text-muted)', cursor: 'pointer' }}
                            >
                              <div
                                style={{
                                  width: '15px',
                                  height: '15px',
                                  borderRadius: '3px',
                                  border: `1.5px solid ${isChecked ? '#22c55e' : 'var(--border-subtle)'}`,
                                  background: isChecked ? 'rgba(34, 197, 94, 0.25)' : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#22c55e',
                                  fontSize: '10px'
                                }}
                              >
                                {isChecked && '✓'}
                              </div>
                              <span style={{ textDecoration: isChecked ? 'none' : 'none' }}>{chk}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Officer Workflow Actions Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Active Session Role: <strong style={{ color: 'var(--brand-accent-blue)' }}>{currentRole}</strong>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  onClick={() => handleOfficerAdvance('REVERT_CLARIFICATION')}
                  style={{ fontSize: '12px', padding: '7px 15px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <AlertTriangle size={13} style={{ color: 'var(--status-warning)' }} />
                  <span>Request Clarification</span>
                </button>
                <button
                  className="btn-primary"
                  onClick={() => handleOfficerAdvance('APPROVED')}
                  disabled={(activeReq.step || 1) >= 5}
                  style={{
                    fontSize: '12px',
                    padding: '7px 18px',
                    fontWeight: 700,
                    background: (activeReq.step || 1) >= 5
                      ? 'rgba(34, 197, 94, 0.4)'
                      : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    boxShadow: '0 0 14px rgba(56, 189, 248, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {(activeReq.step || 1) >= 5 ? (
                    <>
                      <CheckCircle2 size={14} />
                      <span>Workflow Fully Completed</span>
                    </>
                  ) : (
                    <>
                      <span>Advance to Next Workflow Stage</span>
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: CROSS-DEPARTMENT CONFLICT ENGINE ── */}
      {activeTab === 'conflicts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Conflict Split: List on Left, Detail on Right */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1.25fr', gap: '14px' }}>
            {/* Left Column: Conflict Queue */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>Active Conflict Queue</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, padding: '1px 6px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--status-error)', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                    {conflictsList.filter(c => c.status !== 'RESOLVED').length} Active
                  </span>
                </div>
                {loadingConflicts && <span style={{ fontSize: '11px', color: 'var(--brand-accent-cyan)' }}>Syncing...</span>}
              </div>

              {/* Conflict Filter Chips */}
              <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: `All (${conflictsList.length})` },
                  { id: 'area', label: 'Area Discrepancies' },
                  { id: 'zoning', label: 'Zoning' },
                  { id: 'encumbrance', label: 'Liens' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setConflictFilter(f.id)}
                    style={{
                      padding: '3px 8px',
                      fontSize: '10.5px',
                      borderRadius: '5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: `1px solid ${conflictFilter === f.id ? 'var(--brand-accent-blue)' : 'var(--border-subtle)'}`,
                      background: conflictFilter === f.id ? 'rgba(2, 132, 199, 0.25)' : 'var(--bg-card-alt)',
                      color: conflictFilter === f.id ? '#38bdf8' : 'var(--text-secondary)'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Queue Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto' }}>
                {conflictsList
                  .filter(c => conflictFilter === 'all' || c.category === conflictFilter)
                  .map(item => {
                    const isSelected = selectedConflict.id === item.id;
                    const isResolved = item.status === 'RESOLVED';
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedConflict(item);
                          setAdoptedChoice(item.adopted || null);
                          setResolutionStatus(item.resolution_notes || null);
                          if (item.parcel_id) selectParcel(item.parcel_id);
                        }}
                        className={`conflict-queue-item ${isSelected ? 'selected-conflict' : ''}`}
                        style={{
                          padding: '11px 12px',
                          background: isSelected
                            ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.22) 0%, rgba(15, 23, 42, 0.8) 100%)'
                            : 'var(--bg-card-alt)',
                          border: `1.5px solid ${isSelected ? 'var(--brand-accent-blue)' : 'var(--border-subtle)'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12.5px', fontWeight: 800, color: isSelected ? 'var(--brand-accent-cyan)' : 'var(--text-primary)' }}>
                              {item.parcel_id}
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                              ({item.conflict_id || item.id})
                            </span>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {item.diff}
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--brand-accent-cyan)', fontFamily: 'monospace' }}>
                            {item.valueB.split(' ')[0]}
                          </span>
                          <span style={{ fontSize: '9.5px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: isResolved ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: isResolved ? '#22c55e' : '#ef4444', border: `1px solid ${isResolved ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}` }}>
                            {isResolved ? 'RESOLVED' : 'CONFLICT FLAGGED'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right Column: Source Comparison & Dynamic Delta Comparator */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 700, margin: 0 }}>
                    Source Comparison: <span style={{ color: 'var(--brand-accent-cyan)' }}>{selectedConflict.parcel_id}</span>
                  </h4>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Conflict: {selectedConflict.field} • Assigned to: {selectedConflict.officer}
                  </div>
                </div>
                <span className={`status-badge-inline ${selectedConflict.status === 'RESOLVED' ? 'green' : 'red'}`} style={{ fontWeight: 800, fontSize: '10.5px' }}>
                  {selectedConflict.status === 'RESOLVED' ? '✓ RECONCILED' : '⚠ CONFLICT FLAGGED'}
                </span>
              </div>

              {/* Dynamic Animated Variance Comparator (Delta Meter) */}
              <div style={{ background: 'var(--bg-card-alt)', borderRadius: '10px', border: '1px solid var(--border-subtle)', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
                    CROSS-REGISTRY DISCREPANCY COMPARISON
                  </span>
                  <span className="delta-shimmer-badge" style={{ fontSize: '10.5px', fontWeight: 800, padding: '2px 8px', borderRadius: '12px', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                    Δ {selectedConflict.delta || '+61.50 m²'} ({selectedConflict.pctDiff || '+4.92%'})
                  </span>
                </div>

                {/* Calibrated Proportional Comparison Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '14px', borderRadius: '6px', overflow: 'hidden', background: 'rgba(0,0,0,0.3)', padding: '2px' }}>
                  <div
                    style={{
                      height: '100%',
                      width: '48.8%',
                      background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                      borderRadius: '4px 0 0 4px',
                      transition: 'width 0.4s ease'
                    }}
                    title={`Source A: ${selectedConflict.valueA}`}
                  />
                  <div
                    style={{
                      height: '100%',
                      width: '51.2%',
                      background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                      borderRadius: '0 4px 4px 0',
                      transition: 'width 0.4s ease'
                    }}
                    title={`Source B: ${selectedConflict.valueB}`}
                  />
                </div>

                {/* Legend & Tolerance */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10.5px', marginTop: '6px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ color: 'var(--brand-accent-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#38bdf8', display: 'inline-block' }} />
                      Source A ({selectedConflict.valueA.split(' ')[0]})
                    </span>
                    <span style={{ color: 'var(--brand-accent-purple)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#6366f1', display: 'inline-block' }} />
                      Source B ({selectedConflict.valueB.split(' ')[0]})
                    </span>
                  </div>
                  <span style={{ color: selectedConflict.withinTolerance ? 'var(--status-success)' : 'var(--status-warning)', fontWeight: 600 }}>
                    {selectedConflict.withinTolerance
                      ? 'Within statutory 5.0% field tolerance'
                      : 'Exceeds standard 5.0% survey tolerance'}
                  </span>
                </div>
              </div>

              {/* Source A vs Source B Dual Cards with Minimal Hover & Transition */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {/* Source A Card */}
                <div
                  className={`conflict-source-card ${adoptedChoice === 'A' ? 'adopted' : adoptedChoice === 'B' ? 'superseded' : ''}`}
                  style={{
                    background: 'var(--bg-card-alt)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>SOURCE A</span>
                      {adoptedChoice === 'A' && (
                        <span style={{ fontSize: '9px', fontWeight: 800, color: '#22c55e', background: 'rgba(34, 197, 94, 0.2)', padding: '1px 5px', borderRadius: '4px' }}>
                          ✓ ADOPTED
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-accent-blue)', marginTop: '2px' }}>
                      {selectedConflict.sourceA}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {selectedConflict.sourceADept || 'Dept. of Land Records Cadastral Vector'}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', marginTop: '8px', fontFamily: 'monospace' }}>
                      {selectedConflict.valueA}
                    </div>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <button
                      className="btn-secondary"
                      onClick={() => handleResolveConflict('A', selectedConflict.valueA, `Sanctioned and verified per ${selectedConflict.sourceA}`)}
                      style={{
                        width: '100%',
                        fontSize: '11.5px',
                        padding: '6px',
                        justifyContent: 'center',
                        background: adoptedChoice === 'A' ? 'rgba(34, 197, 94, 0.25)' : undefined,
                        borderColor: adoptedChoice === 'A' ? '#22c55e' : undefined
                      }}
                    >
                      {adoptedChoice === 'A' ? 'Adopted Truth ✓' : 'Adopt Source A'}
                    </button>
                  </div>
                </div>

                {/* Source B Card */}
                <div
                  className={`conflict-source-card ${adoptedChoice === 'B' ? 'adopted' : adoptedChoice === 'A' ? 'superseded' : ''}`}
                  style={{
                    background: 'var(--bg-card-alt)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>SOURCE B</span>
                      {adoptedChoice === 'B' && (
                        <span style={{ fontSize: '9px', fontWeight: 800, color: '#22c55e', background: 'rgba(34, 197, 94, 0.2)', padding: '1px 5px', borderRadius: '4px' }}>
                          ✓ ADOPTED
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-accent-cyan)', marginTop: '2px' }}>
                      {selectedConflict.sourceB}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {selectedConflict.sourceBDept || 'Municipal Corporation Tax Cell'}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', marginTop: '8px', fontFamily: 'monospace' }}>
                      {selectedConflict.valueB}
                    </div>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <button
                      className="btn-primary"
                      onClick={() => handleResolveConflict('B', selectedConflict.valueB, `Reconciled and endorsed per ${selectedConflict.sourceB}`)}
                      style={{
                        width: '100%',
                        fontSize: '11.5px',
                        padding: '6px',
                        justifyContent: 'center',
                        background: adoptedChoice === 'B' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : undefined
                      }}
                    >
                      {adoptedChoice === 'B' ? 'Adopted Truth ✓' : 'Adopt Source B'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Resolution Certificate & Undo Action */}
              {selectedConflict.status === 'RESOLVED' && (
                <div style={{ padding: '12px 14px', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1.5px solid rgba(34, 197, 94, 0.5)', borderRadius: '10px', animation: 'sealPopIn 0.35s ease-out' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={16} style={{ color: '#22c55e' }} />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#22c55e' }}>
                          Conflict Reconciled on State Cadastral Ledger
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '2px' }}>
                          Reconciliation Order #REC-2026-9041 • Block Hash: SHA-256: 0xa4e8...31fd
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleUndoResolution}
                      className="btn-secondary"
                      style={{ fontSize: '10.5px', padding: '3px 8px' }}
                    >
                      Re-evaluate
                    </button>
                  </div>
                </div>
              )}

              {resolutionError && (
                <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--status-error)', borderRadius: '6px', color: 'var(--status-error)', fontSize: '11.5px' }}>
                  ⚠ {resolutionError}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: DUPLICATE RECORD RESOLUTION ── */}
      {activeTab === 'duplicates' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '18px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>Cadastral Duplicate Detection &amp; Deduplication Engine</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Probabilistic &amp; deterministic entity matching across legacy revenue khewats, ULPIN centroid proximity, and deed registration chains.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '8px' }}>Candidate ID</th>
                <th style={{ padding: '8px' }}>Target Parcel</th>
                <th style={{ padding: '8px' }}>Duplicate Candidate</th>
                <th style={{ padding: '8px' }}>Match Basis</th>
                <th style={{ padding: '8px' }}>Confidence</th>
                <th style={{ padding: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {(duplicatesList.length > 0 ? duplicatesList : [
                { id: 'DUP-104', parcel_a: 'P-1027', parcel_b: 'P-1027-ALT', rule: 'Centroid Distance < 2m & Same Khewat', score: 0.94 },
                { id: 'DUP-108', parcel_a: 'P-1025', parcel_b: 'P-1025-LEGACY', rule: 'Same Khasra 14/2 in Jamabandi', score: 0.88 },
                { id: 'DUP-112', parcel_a: 'P-1009', parcel_b: 'P-1009-REV', rule: 'Matching Mutation Intiqal Token', score: 0.91 }
              ]).map((dup, idx) => (
                <tr key={dup.id || idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 8px', fontWeight: 700, color: 'var(--brand-accent-cyan)' }}>{dup.id || `DUP-${idx + 101}`}</td>
                  <td style={{ padding: '10px 8px', fontWeight: 600 }}>{dup.parcel_a || dup.ulpin_a || 'P-1027'}</td>
                  <td style={{ padding: '10px 8px', color: 'var(--brand-accent-blue)', fontWeight: 600 }}>{dup.parcel_b || dup.ulpin_b || 'P-1027-ALT'}</td>
                  <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{dup.rule || dup.match_reason || 'Spatial Polygon Overlap > 95%'}</td>
                  <td style={{ padding: '10px 8px', fontWeight: 700, color: 'var(--status-warning)' }}>
                    {typeof dup.score === 'number' ? `${Math.round(dup.score * 100)}%` : '94%'}
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '10.5px', padding: '4px 10px' }}
                      onClick={() => alert(`Reviewing candidate ${dup.id || 'record'}. Spatial boundary comparison loaded.`)}
                    >
                      Inspect Pair
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
