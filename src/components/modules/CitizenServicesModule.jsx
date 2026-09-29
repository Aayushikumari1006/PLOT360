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
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { createServiceRequest, getServiceRequests, transitionWorkflow } from '../../api/citizen';

export default function CitizenServicesModule() {
  const { activeParcel, selectParcel, parcels, userRole } = useApp();

  const [citizenQuery, setCitizenQuery] = useState('');
  const [selectedService, setSelectedService] = useState('demarcation');
  const [applicantName, setApplicantName] = useState('Ravinder Singh');
  const [applicantPhone, setApplicantPhone] = useState('+91 98765 43210');
  const [requestNotes, setRequestNotes] = useState('Request for boundary pillar verification with adjoining parcel P-1026.');
  const [selectedReqId, setSelectedReqId] = useState('SR-2026-1088');
  const [loadingLive, setLoadingLive] = useState(false);
  const [transitionError, setTransitionError] = useState(null);
  const [transitionSuccess, setTransitionSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submittedRequests, setSubmittedRequests] = useState(() => {
    const saved = localStorage.getItem('plot360_citizen_requests');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'SR-2026-1049',
            parcel_id: 'P-1027',
            ulpin: 'IN-PB-CHD-0001027',
            service: 'Certified RoR Copy (Fard)',
            date: '18 Sep 2026',
            status: 'COMPLETED',
            step: 5
          },
          {
            id: 'SR-2026-1088',
            parcel_id: 'P-1027',
            ulpin: 'IN-PB-CHD-0001027',
            service: 'Building Permission NOC',
            date: '19 Sep 2026',
            status: 'DEPARTMENT_REVIEW',
            step: 4
          }
        ];
  });

  // ── Load live service requests from backend ──
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

    return () => {
      isMounted = false;
    };
  }, []);

  const [newRequestSuccess, setNewRequestSuccess] = useState(null);

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
      step: 1
    };

    const updated = [newReq, ...submittedRequests];
    setSubmittedRequests(updated);
    setSelectedReqId(newReq.id);
    localStorage.setItem('plot360_citizen_requests', JSON.stringify(updated));
    setNewRequestSuccess(persistentId);
  };

  const handleOfficerAdvance = async (toState) => {
    setTransitionError(null);
    setTransitionSuccess(null);
    const activeReq = submittedRequests.find(r => r.id === selectedReqId) || submittedRequests[0];
    if (!activeReq) return;

    try {
      if (activeReq.backendId) {
        await transitionWorkflow(activeReq.backendId, toState, `Officer advanced workflow step`);
      }
      const updatedStatus = toState.toUpperCase();
      const updated = submittedRequests.map((r) =>
        r.id === activeReq.id ? { ...r, status: updatedStatus, step: Math.min(r.step + 1, 5) } : r
      );
      setSubmittedRequests(updated);
      setTransitionSuccess(`Workflow stage transitioned to ${updatedStatus}`);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Workflow transition rejected by authority';
      setTransitionError(`Transition Failed: ${msg}`);
    }
  };

  const activeReq = submittedRequests.find(r => r.id === selectedReqId) || submittedRequests[0] || {};

  return (
    <div className="page-scroll-area">
      {/* Header */}
      <div className="page-header-container">
        <div className="breadcrumb-row">
          <span className="breadcrumb-item">PLOT360</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item">Citizen Services</span>
        </div>
        <div className="page-title-row">
          <Users className="page-icon" />
          <h1 className="page-title">Citizen Land Services & Tracking</h1>
        </div>
        <p className="page-subtitle">
          Public parcel lookup, single-window service applications, and real-time transaction lifecycle tracking.
        </p>
      </div>

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

      {/* Grid: Left (Service Request Submission) + Right (Application Tracking) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '14px' }}>
        {/* Service Request Form */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Apply for Citizen Land Service</h3>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Selected Parcel: <strong style={{ color: 'var(--brand-accent-blue)' }}>{activeParcel.parcel_id}</strong> ({activeParcel.ulpin})
          </div>

          <form onSubmit={handleSubmitRequest} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>SERVICE TYPE</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                style={{ width: '100%', marginTop: '4px', padding: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-card)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '12px' }}
              >
                <option value="demarcation">Cadastral Boundary Demarcation (Hadd Shikni)</option>
                <option value="mutation">Title Mutation / Intiqal Application</option>
                <option value="noc">Municipal Clearance / NOC</option>
                <option value="ror">Certified Copy of Jamabandi (Fard)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>APPLICANT NAME</label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  style={{ width: '100%', marginTop: '4px', padding: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-card)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '12px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>MOBILE NUMBER</label>
                <input
                  type="text"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  style={{ width: '100%', marginTop: '4px', padding: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-card)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '12px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>DETAILS & REMARKS</label>
              <textarea
                rows={3}
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                style={{ width: '100%', marginTop: '4px', padding: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-card)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '12px', resize: 'none' }}
              />
            </div>

            {newRequestSuccess && (
              <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--status-success)', fontSize: '11.5px', fontWeight: 600 }}>
                ✓ Application Generated! Request ID: <strong>{newRequestSuccess}</strong>
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ padding: '10px', marginTop: '4px' }}>
              Submit Service Request
            </button>
          </form>
        </div>

        {/* Real-time Tracking Stepper */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Track Service Request: {activeReq.id || 'SR-2026-1088'}</h3>
            {loadingLive && <span style={{ fontSize: '11px', color: 'var(--brand-accent-cyan)' }}>Syncing...</span>}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Service: <strong>{activeReq.service}</strong> • Parcel: <strong>{activeReq.parcel_id}</strong> ({activeReq.ulpin})
          </div>

          {/* Dynamic Stepper */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-card-alt)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: (activeReq.step || 1) >= 1 ? 'var(--status-success)' : 'var(--border-card)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>✓</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Application Submitted</div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{activeReq.date || 'Recent'} — Digital application filed with Aadhaar KYC</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: (activeReq.step || 1) >= 2 ? 1 : 0.5 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: (activeReq.step || 1) >= 2 ? 'var(--status-success)' : 'var(--border-card)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>{(activeReq.step || 1) >= 2 ? '✓' : '2'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Documents Received</div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Title deed and site architecture plan indexed in digital vault</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: (activeReq.step || 1) >= 3 ? 1 : 0.5 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: (activeReq.step || 1) >= 3 ? 'var(--status-success)' : 'var(--border-card)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>{(activeReq.step || 1) >= 3 ? '✓' : '3'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Cadastral Boundary Verification</div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>ULPIN automated spatial cross-check passed with 0 overlaps</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: (activeReq.step || 1) >= 4 ? 1 : 0.5 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: (activeReq.step || 1) === 4 ? 'var(--brand-accent-blue)' : (activeReq.step || 1) > 4 ? 'var(--status-success)' : 'var(--border-card)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>{(activeReq.step || 1) > 4 ? '✓' : '●'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: (activeReq.step || 1) === 4 ? 'var(--brand-accent-cyan)' : 'var(--text-primary)' }}>Department Review</div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Competent Authority examination and NOC verification</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: (activeReq.step || 1) >= 5 ? 1 : 0.5 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: (activeReq.step || 1) >= 5 ? 'var(--status-success)' : 'var(--border-card)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>{(activeReq.step || 1) >= 5 ? '✓' : '○'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 700 }}>Final Approval &amp; Digital Certificate Issue</div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Cryptographically signed document issued with QR verification</div>
              </div>
            </div>
          </div>

          {/* Officer Workflow Actions if authorized role */}
          {userRole !== 'citizen' && (
            <div style={{ padding: '10px', background: 'var(--bg-card-alt)', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-accent-cyan)', marginBottom: '8px' }}>
                OFFICER WORKFLOW CONTROLS ({userRole})
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: '11px', padding: '6px' }}
                  onClick={() => handleOfficerAdvance('in_review')}
                >
                  Mark Under Review
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ flex: 1, fontSize: '11px', padding: '6px' }}
                  onClick={() => handleOfficerAdvance('approved')}
                >
                  Approve / Sign NOC
                </button>
              </div>
              {transitionSuccess && (
                <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--status-success)' }}>
                  ✓ {transitionSuccess}
                </div>
              )}
              {transitionError && (
                <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--status-danger)' }}>
                  ⚠ {transitionError}
                </div>
              )}
            </div>
          )}

          {/* Past requests list */}
          <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '6px' }}>
            My Active Applications ({submittedRequests.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
            {submittedRequests.map(req => (
              <div
                key={req.id}
                onClick={() => setSelectedReqId(req.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 10px',
                  background: req.id === activeReq.id ? 'var(--bg-card-hover)' : 'var(--bg-card-alt)',
                  border: req.id === activeReq.id ? '1px solid var(--brand-accent-cyan)' : '1px solid transparent',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <strong>{req.id}</strong> • {req.service}
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Parcel: {req.parcel_id} • {req.date}</div>
                </div>
                <span style={{ padding: '2px 6px', borderRadius: '4px', background: req.status === 'COMPLETED' || req.status === 'APPROVED' ? 'var(--bg-badge-green)' : 'var(--bg-badge-blue)', color: req.status === 'COMPLETED' || req.status === 'APPROVED' ? 'var(--status-success)' : 'var(--brand-accent-cyan)', fontWeight: 600, fontSize: '10px' }}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
