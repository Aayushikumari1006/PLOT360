import React from 'react';
import { X, Layers, Server, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PlatformModal() {
  const { platformModalOpen, setPlatformModalOpen, selectedLocation, selectedJurisdiction } = useApp();

  if (!platformModalOpen) return null;

  const platforms = [
    { name: 'Cadastral Spatial Vector Engine', dept: 'Survey of India / State Cadastre', status: 'Active (PostGIS / Vector GIS)', type: 'Core Cadastre' },
    { name: 'Record of Rights (RoR) & Mutation', dept: 'Department of Revenue & Land Records', status: 'Active (Jamabandi / AnyRoR / Bhoomi)', type: 'Governance' },
    { name: 'Sub-Registrar Deed Registry', dept: 'Department of Stamps & Registration', status: 'Active (Simulated SRO Integration)', type: 'Registration' },
    { name: 'Town & Country Master Plan', dept: 'Urban Development & Planning Authority', status: 'Active (Master Plan 2031)', type: 'Planning' },
    { name: 'Municipal Building Sanctions', dept: 'Municipal Corporation Cell', status: 'Active (Online Sanction System)', type: 'Municipal' },
    { name: 'Municipal Property Tax Assessment', dept: 'Property Tax Collection Directorate', status: 'Active (Tax Ledger)', type: 'Taxation' },
    { name: 'Sentinel-2 Satellite Earth Observation', dept: 'Copernicus / ESA Multispectral 10m', status: 'Active (Temporal Analysis Engine)', type: 'Earth Observation' },
    { name: 'Cross-System Conflict Detection', dept: 'PLOT360 AI & Audit Framework', status: 'Active (Discrepancy Resolver)', type: 'Data Quality' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 24, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setPlatformModalOpen(false)}
    >
      <div
        style={{
          width: '780px',
          maxWidth: '94vw',
          maxHeight: '86vh',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: '14px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-card-alt)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(37, 99, 235, 0.15)',
                color: 'var(--brand-accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Layers size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Integrated Land Governance Platform
              </h2>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Active Jurisdiction: {selectedJurisdiction} • Current Study Node: {selectedLocation}
              </div>
            </div>
          </div>
          <button
            onClick={() => setPlatformModalOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(2, 132, 199, 0.08)', border: '1px solid rgba(2, 132, 199, 0.2)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--brand-accent-cyan)' }}>Multi-Agency Integration Architecture:</strong> PLOT360 connects disparate state revenue, cadastral, planning, municipal, and registration systems into a unified spatial intelligence layer keyed by the 14-digit ULPIN.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Connected Platform Subsystems & Services
            </div>
            {platforms.map(p => (
              <div
                key={p.name}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-card-alt)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {p.dept}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10.5px', padding: '2px 7px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--status-success)', fontWeight: 600 }}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px 12px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11px', color: 'var(--status-warning)' }}>
            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Demonstration & Simulation Policy:</strong> Departmental connectors operate with high-fidelity sample payloads for demonstration and security verification. They are clearly classified as SIMULATED and do not represent live production government databases.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-card-alt)'
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            PLOT360 Platform Version 2.5.0
          </div>
          <button
            onClick={() => setPlatformModalOpen(false)}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              backgroundColor: 'var(--brand-accent-blue)',
              color: '#ffffff',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
