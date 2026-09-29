import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Download,
  Building,
  CreditCard,
  Search,
  Check,
  Send,
  Layers,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RoleDashboardView({ onReturnToMap }) {
  const {
    currentRole,
    activeParcel,
    selectParcel,
    parcels,
    setUnifiedReportOpen,
    setActiveModule,
    currentJurisdiction
  } = useApp();

  const [queueFilter, setQueueFilter] = useState('all');

  // 1. CITIZEN INTERFACE (Panel 1 from Reference Image)
  if (currentRole === 'citizen') {
    return (
      <div className="role-dashboard-container">
        {/* Welcome Header */}
        <div className="role-banner-welcome">
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Welcome, Citizen
            </h2>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Your land information services and applications at a glance.
            </div>
          </div>
          <button className="btn-primary" onClick={onReturnToMap}>
            View Interactive Cadastral Map →
          </button>
        </div>

        {/* 3 Quick Stats Cards */}
        <div className="stats-grid-row">
          <div className="role-stat-card">
            <span className="role-stat-card-title">My Parcels</span>
            <span className="role-stat-card-value" style={{ color: 'var(--brand-accent-blue)' }}>2</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Registered Land Titles</span>
          </div>
          <div className="role-stat-card">
            <span className="role-stat-card-title">Applications</span>
            <span className="role-stat-card-value" style={{ color: 'var(--status-warning)' }}>1</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mutation in Progress</span>
          </div>
          <div className="role-stat-card">
            <span className="role-stat-card-title">Service Requests</span>
            <span className="role-stat-card-value" style={{ color: 'var(--status-success)' }}>0</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>All Clear / Cleared Dues</span>
          </div>
        </div>

        {/* Split: Recent Requests vs My Parcels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(280px, 1fr)', gap: '14px' }}>
          {/* Left: Recent Requests Table */}
          <div className="role-table-card">
            <div className="role-table-card-header">
              <span className="role-table-title">Recent Requests</span>
              <span style={{ fontSize: '11.5px', color: 'var(--brand-accent-cyan)' }}>SLA Tracking Active</span>
            </div>
            <table className="data-table-compact">
              <thead>
                <tr>
                  <th>Service Type</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style={{ fontWeight: 600 }}>Property Verification</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Ref: #VER-PB-2023-891</div>
                  </td>
                  <td>17 Sep 2023</td>
                  <td>
                    <span className="status-pill-verified" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--status-success)' }}>
                      ✓ Verified
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={{ fontWeight: 600 }}>Mutation Application</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Ref: #MUT-PB-2023-412</div>
                  </td>
                  <td>14 Sep 2023</td>
                  <td>
                    <span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--status-warning)', fontWeight: 600 }}>
                      Under Review
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={{ fontWeight: 600 }}>Title Deed Extract Request</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Ref: #DOC-PB-2023-104</div>
                  </td>
                  <td>22 Sep 2023</td>
                  <td>
                    <span className="status-pill-verified" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--brand-accent-cyan)' }}>
                      Delivered
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right: My Parcels Card */}
          <div className="role-table-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="role-table-title">My Registered Parcels</span>
            <div style={{ background: 'var(--bg-card-alt)', borderRadius: '10px', padding: '14px', border: '1px solid var(--border-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-accent-cyan)' }}>
                  {activeParcel ? activeParcel.parcel_id : 'P-1035'}
                </span>
                <span className="status-pill-verified">✓ Verified Title</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                ULPIN: {activeParcel ? activeParcel.ulpin : 'IN-PB-CHD-0001035'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {activeParcel ? activeParcel.location : 'Sector 17, Chandigarh'}
              </div>
              <button
                className="btn-primary"
                style={{ width: '100%', marginTop: '12px', justifyContent: 'center', fontSize: '12px' }}
                onClick={() => setUnifiedReportOpen(true)}
              >
                View Complete Land Passport
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. LAND / REVENUE OFFICER INTERFACE (Panel 2 from Reference Image)
  if (currentRole === 'revenue_officer') {
    return (
      <div className="role-dashboard-container">
        {/* Banner */}
        <div className="role-banner-welcome">
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Land / Revenue Officer Work Queue</h2>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Cadastral boundaries, Jamabandi verification, mutation approvals, and conflict resolution.
            </div>
          </div>
          <button className="btn-primary" onClick={onReturnToMap}>
            Open GIS Cadastral Workspace →
          </button>
        </div>

        {/* 4 Stats */}
        <div className="stats-grid-row">
          <div className="role-stat-card">
            <span className="role-stat-card-title">Total Status</span>
            <span className="role-stat-card-value">4,582</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tehsil Registry Total</span>
          </div>
          <div className="role-stat-card">
            <span className="role-stat-card-title">Total Verified</span>
            <span className="role-stat-card-value" style={{ color: 'var(--status-success)' }}>3,904</span>
            <span style={{ fontSize: '11px', color: 'var(--status-success)' }}>✓ DILRMP Synchronized</span>
          </div>
          <div className="role-stat-card">
            <span className="role-stat-card-title">Pending Certificates</span>
            <span className="role-stat-card-value" style={{ color: 'var(--status-warning)' }}>415</span>
            <span style={{ fontSize: '11px', color: 'var(--status-warning)' }}>Awaiting Tehsildar Sign</span>
          </div>
          <div className="role-stat-card">
            <span className="role-stat-card-title">Conflicts Flagged</span>
            <span className="role-stat-card-value" style={{ color: 'var(--status-error)' }}>286</span>
            <span style={{ fontSize: '11px', color: 'var(--status-error)' }}>Area Discrepancies</span>
          </div>
        </div>

        {/* Split Table + Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.8fr) minmax(240px, 1fr)', gap: '14px' }}>
          <div className="role-table-card">
            <div className="role-table-card-header">
              <span className="role-table-title">Recent Cadastral Records</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Updated 5m ago</span>
            </div>
            <table className="data-table-compact">
              <thead>
                <tr>
                  <th>ULPIN / Parcel</th>
                  <th>Title Holder</th>
                  <th>Land Class</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {parcels.slice(0, 5).map(p => (
                  <tr key={p.parcel_id} style={{ cursor: 'pointer' }} onClick={() => selectParcel(p.parcel_id)}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--brand-accent-blue)' }}>{p.parcel_id}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{p.ulpin}</div>
                    </td>
                    <td>{p.owner?.name || 'Registered Owner'}</td>
                    <td>{p.land_use || 'Plotted'}</td>
                    <td>
                      <span className="status-pill-verified">✓ Verified</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Actions */}
          <div className="role-table-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span className="role-table-title">Revenue Actions</span>
            <button className="quick-action-btn" onClick={() => setActiveModule('intelligence')}>
              <span>Quick Khasra Search</span>
            </button>
            <button className="quick-action-btn" onClick={() => setUnifiedReportOpen(true)}>
              <span>Issue RoR Extract</span>
            </button>
            <button className="quick-action-btn" onClick={() => setActiveModule('workflows')}>
              <span>Check Mutation Queue</span>
            </button>
            <button className="quick-action-btn" onClick={() => setActiveModule('workflows')}>
              <span>Resolve Area Conflict</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. PLANNING / BUILDING OFFICER INTERFACE (Panel 3 from Reference Image)
  if (currentRole === 'planning_officer') {
    return (
      <div className="role-dashboard-container">
        <div className="role-banner-welcome">
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Planning &amp; Building Authority Interface</h2>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Master Plan compliance, permissible FAR ceilings, and building sanction approvals.
            </div>
          </div>
          <button className="btn-primary" onClick={onReturnToMap}>
            View Interactive Zoning Map →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.5fr) minmax(260px, 1fr)', gap: '14px' }}>
          <div className="role-table-card">
            <div className="role-table-card-header">
              <span className="role-table-title">Recent Building Permission Applications</span>
              <span style={{ fontSize: '11px', color: 'var(--brand-accent-cyan)' }}>ULB Cell</span>
            </div>
            <table className="data-table-compact">
              <thead>
                <tr>
                  <th>Application Ref</th>
                  <th>Permit Type</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>BP-2023-0023</td>
                  <td>Building Permission</td>
                  <td><span className="status-pill-verified">Approved</span></td>
                  <td>14 Aug 2023</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>LU-2023-0012</td>
                  <td>Land Use Conversion</td>
                  <td><span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--status-warning)' }}>Under Review</span></td>
                  <td>19 Aug 2023</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>RP-2023-0008</td>
                  <td>Reconstruction Sanction</td>
                  <td><span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--brand-accent-cyan)' }}>Vetting</span></td>
                  <td>22 Aug 2023</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="role-table-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span className="role-table-title">Zoning Parameters: {activeParcel ? activeParcel.parcel_id : 'P-1035'}</span>
            <div style={{ background: 'var(--bg-card-alt)', borderRadius: '8px', padding: '12px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>Master Plan Zone:</strong> {activeParcel?.zoning || 'Residential Mixed Density (R-2)'}</div>
              <div><strong>Permitted FAR:</strong> 1.75 Base (Max 2.25 with TDR)</div>
              <div><strong>Max Height:</strong> 15.0m (Stilt + 4 Floors)</div>
              <div><strong>Ground Coverage:</strong> Up to 55% Net Area</div>
            </div>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }} onClick={() => setActiveModule('intelligence')}>
              Cross-Check Plinth Footprint
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. REGISTRATION OFFICER INTERFACE (Panel 4 from Reference Image)
  if (currentRole === 'registration_officer') {
    return (
      <div className="role-dashboard-container">
        <div className="role-banner-welcome">
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Sub-Registrar Conveyance &amp; Deed Register</h2>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Execution of deeds, stamp duty reconciliation, and registered transfer index.
            </div>
          </div>
          <button className="btn-primary" onClick={onReturnToMap}>
            View Cadastral Map →
          </button>
        </div>

        <div className="role-table-card">
          <div className="role-table-card-header" style={{ flexWrap: 'wrap', gap: '8px' }}>
            <span className="role-table-title">Registration Queue</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['all', 'progress', 'completed', 'new'].map(f => (
                <button
                  key={f}
                  onClick={() => setQueueFilter(f)}
                  style={{
                    padding: '3px 9px',
                    borderRadius: '5px',
                    fontSize: '11px',
                    fontWeight: 600,
                    border: '1px solid var(--border-card)',
                    background: queueFilter === f ? 'var(--brand-accent-blue)' : 'var(--bg-card-alt)',
                    color: queueFilter === f ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <table className="data-table-compact">
            <thead>
              <tr>
                <th>Registration No.</th>
                <th>Instrument Type</th>
                <th>Party Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700 }}>REG-002-001</td>
                <td>Conveyance Sale Deed</td>
                <td>Sardar Gurbir Singh</td>
                <td><span className="status-pill-verified">Registered</span></td>
                <td><button className="btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => setActiveModule('intelligence')}>Inspect</button></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>REG-003-002</td>
                <td>Sale Agreement</td>
                <td>Amrik Builders Ltd.</td>
                <td><span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--status-warning)' }}>In Progress</span></td>
                <td><button className="btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => setActiveModule('intelligence')}>Inspect</button></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>REG-004-003</td>
                <td>Transfer Deed</td>
                <td>Jasbir Singh Dhillon</td>
                <td><span className="status-pill-verified">Verified</span></td>
                <td><button className="btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => setActiveModule('intelligence')}>Inspect</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 5. MUNICIPAL / TAX OFFICER INTERFACE (Panel 5 from Reference Image)
  return (
    <div className="role-dashboard-container">
      <div className="role-banner-welcome">
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Municipal Corporation Revenue &amp; Property Tax</h2>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Property taxation ledgers, rateable assessments, shortfall tracking, and civic utility billing.
          </div>
        </div>
        <button className="btn-primary" onClick={onReturnToMap}>
          View Cadastral Map →
        </button>
      </div>

      <div className="stats-grid-row">
        <div className="role-stat-card">
          <span className="role-stat-card-title">Total Demand</span>
          <span className="role-stat-card-value">3,042</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Assessed Units</span>
        </div>
        <div className="role-stat-card">
          <span className="role-stat-card-title">Tax Realization</span>
          <span className="role-stat-card-value" style={{ color: 'var(--brand-accent-cyan)' }}>₹ 12.4 Cr</span>
          <span style={{ fontSize: '11px', color: 'var(--status-success)' }}>↑ 8.2% vs FY Target</span>
        </div>
        <div className="role-stat-card">
          <span className="role-stat-card-title">Pending Shortfalls</span>
          <span className="role-stat-card-value" style={{ color: 'var(--status-warning)' }}>312</span>
          <span style={{ fontSize: '11px', color: 'var(--status-warning)' }}>Demand Notices Sent</span>
        </div>
        <div className="role-stat-card">
          <span className="role-stat-card-title">Rebates Cleared</span>
          <span className="role-stat-card-value" style={{ color: 'var(--status-success)' }}>90</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Early Payment Relief</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.6fr) minmax(260px, 1fr)', gap: '14px' }}>
        <div className="role-table-card" style={{ padding: '16px' }}>
          <span className="role-table-title">Tax Collection Trend (Apr - Sep)</span>
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'flex-end', gap: '12px', height: '160px', paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
            {[
              { month: 'Apr', val: 65 },
              { month: 'May', val: 78 },
              { month: 'Jun', val: 92 },
              { month: 'Jul', val: 84 },
              { month: 'Aug', val: 110 },
              { month: 'Sep', val: 125 }
            ].map(m => (
              <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', maxWidth: '32px', height: `${m.val}px`, background: 'linear-gradient(180deg, #38bdf8 0%, #2563eb 100%)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }} />
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="role-table-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span className="role-table-title">Tax Assessment Actions</span>
          <button className="quick-action-btn" onClick={() => setActiveModule('intelligence')}>
            <span>Recalculate Assessment</span>
          </button>
          <button className="quick-action-btn" onClick={() => setActiveModule('workflows')}>
            <span>Dispatch Demand Notices</span>
          </button>
          <button className="quick-action-btn" onClick={() => setActiveModule('analytics')}>
            <span>Shortfall Geospatial Heatmap</span>
          </button>
        </div>
      </div>
    </div>
  );
}
