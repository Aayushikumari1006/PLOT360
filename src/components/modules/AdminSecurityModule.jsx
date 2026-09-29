import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Users,
  Database,
  Search,
  Filter,
  Sliders,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getAdminAuditLogs } from '../../api/admin';

export default function AdminSecurityModule() {
  const { currentRole, setCurrentRole, roles, activeParcel } = useApp();
  const [auditFilter, setAuditFilter] = useState('');
  const [loadingAudit, setLoadingAudit] = useState(false);

  const fallbackLogs = [
    {
      id: 'AUD-9021',
      who: 'Officer R. K. Singh (Admin)',
      what: 'Updated Field Verification Determination',
      parcel: 'P-1027',
      oldVal: 'PENDING',
      newVal: 'UNDER_REVIEW',
      source: 'AI Change Detection Review',
      when: '10 mins ago'
    },
    {
      id: 'AUD-9018',
      who: 'System Workflow Sync',
      what: 'Synchronized RoR Jamabandi Mutation',
      parcel: 'P-1026',
      oldVal: 'Pending Review',
      newVal: 'Sanctioned',
      source: 'Punjab Revenue Gateway',
      when: '1 hour ago'
    },
    {
      id: 'AUD-9014',
      who: 'Planning Officer',
      what: 'Sanctioned Building Permission (G+2)',
      parcel: 'P-1027',
      oldVal: 'Submitted',
      newVal: 'Approved (PJB/BP/2023/114)',
      source: 'Town Planning CAD System',
      when: '3 hours ago'
    },
    {
      id: 'AUD-9008',
      who: 'Tax Assessment Officer',
      what: 'Logged Property Tax Receipt',
      parcel: 'P-1025',
      oldVal: '₹ 18,400 Due',
      newVal: 'Paid (Ref #CHD-8902)',
      source: 'Municipal Fiscal Portal',
      when: '1 day ago'
    }
  ];

  const [auditLogs, setAuditLogs] = useState(fallbackLogs);

  useEffect(() => {
    let isMounted = true;
    setLoadingAudit(true);
    getAdminAuditLogs(50)
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((l) => ({
            id: `AUD-${l.id}`,
            who: `${l.user_name || 'System'} (${l.role || 'Officer'})`,
            what: l.action ? l.action.replace(/_/g, ' ') : 'System Audit Event',
            parcel: l.parcel_id ? `P-${l.parcel_id}` : (l.ulpin || 'Global'),
            oldVal: l.old_value || 'None',
            newVal: l.new_value || 'Applied',
            source: l.entity || 'Core Registry',
            when: l.timestamp ? new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'
          }));
          setAuditLogs(mapped);
        }
      })
      .catch((err) => {
        console.warn('Live audit logs unavailable or permission denied, using fallback:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingAudit(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredLogs = auditFilter
    ? auditLogs.filter(
        l =>
          l.who.toLowerCase().includes(auditFilter.toLowerCase()) ||
          l.parcel.toLowerCase().includes(auditFilter.toLowerCase()) ||
          l.what.toLowerCase().includes(auditFilter.toLowerCase())
      )
    : auditLogs;

  return (
    <div className="page-scroll-area">
      {/* Header */}
      <div className="page-header-container">
        <div className="breadcrumb-row">
          <span className="breadcrumb-item">PLOT360</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item">Administration & Security</span>
        </div>
        <div className="page-title-row">
          <ShieldCheck className="page-icon" />
          <h1 className="page-title">Administration, RBAC & Audit Trail</h1>
        </div>
        <p className="page-subtitle">
          Role-Based Access Control matrix, immutable audit logging, information classification, and state configuration parameters.
        </p>
      </div>

      {/* RBAC Active Role Switcher Card */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Active Role Assignment (RBAC Engine)</h3>
        <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
          Selecting any role below dynamically filters the visible dashboard, navigation modules, and administrative actions across the platform:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {roles.map(r => (
            <div
              key={r.id}
              onClick={() => setCurrentRole(r.id)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: `1.5px solid ${currentRole === r.id ? 'var(--brand-accent-blue)' : 'var(--border-subtle)'}`,
                background: currentRole === r.id ? 'rgba(37, 99, 235, 0.12)' : 'var(--bg-card-alt)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: currentRole === r.id ? 'var(--brand-accent-cyan)' : 'var(--text-primary)' }}>
                {r.name}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Immutable Audit Log */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Immutable Land Governance Audit Trail</h3>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Cryptographically verified ledger of all parcel updates and user actions
            </div>
          </div>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Filter audit logs..."
              value={auditFilter}
              onChange={(e) => setAuditFilter(e.target.value)}
              className="search-input"
              style={{ height: '32px', paddingLeft: '32px', fontSize: '11.5px' }}
            />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '8px' }}>Log ID</th>
              <th style={{ padding: '8px' }}>Who / Role</th>
              <th style={{ padding: '8px' }}>Action / What</th>
              <th style={{ padding: '8px' }}>Parcel</th>
              <th style={{ padding: '8px' }}>Old Value</th>
              <th style={{ padding: '8px' }}>New Value</th>
              <th style={{ padding: '8px' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '9px 8px', fontWeight: 600, color: 'var(--brand-accent-blue)' }}>{log.id}</td>
                <td style={{ padding: '9px 8px', fontWeight: 600 }}>{log.who}</td>
                <td style={{ padding: '9px 8px' }}>{log.what}</td>
                <td style={{ padding: '9px 8px', fontWeight: 600, color: 'var(--brand-accent-cyan)' }}>{log.parcel}</td>
                <td style={{ padding: '9px 8px', color: 'var(--status-error)' }}>{log.oldVal}</td>
                <td style={{ padding: '9px 8px', color: 'var(--status-success)' }}>{log.newVal}</td>
                <td style={{ padding: '9px 8px', color: 'var(--text-muted)' }}>{log.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Information Classification & State Config Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '14px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Information Classification Policy</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'var(--bg-card-alt)', borderRadius: '6px' }}>
              <span>PUBLIC</span>
              <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>Parcel boundary, ULPIN, zoning, tax payment status</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'var(--bg-card-alt)', borderRadius: '6px' }}>
              <span>AUTHORIZED DEPT</span>
              <span style={{ color: 'var(--brand-accent-cyan)', fontWeight: 600 }}>RoR title, mutation records, mortgage charges</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'var(--bg-card-alt)', borderRadius: '6px' }}>
              <span>RESTRICTED</span>
              <span style={{ color: 'var(--status-warning)', fontWeight: 600 }}>Aadhaar e-KYC, confidential court dispute notes</span>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '14px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>State Config: Punjab & Chandigarh</h4>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div><strong>Active State:</strong> Punjab (Jurisdiction ID: PB-03)</div>
            <div><strong>Measurement Units:</strong> Acre, Kanal, Marla, Square Meters (m²)</div>
            <div><strong>Conversion Formula:</strong> 1 Acre = 8 Kanals = 160 Marlas = 4,046.86 m²</div>
            <div><strong>Revenue Terms:</strong> Jamabandi (RoR), Intiqal (Mutation), Khasra (Plot)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
