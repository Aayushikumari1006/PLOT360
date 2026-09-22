import React, { useState } from 'react';
import {
  Share2,
  CheckCircle,
  AlertCircle,
  Database,
  Code,
  Layers,
  ArrowRight,
  Play,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function IntegrationHubModule() {
  const { activeParcel } = useApp();
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/v1/parcels/{ulpin}');
  const [apiResponse, setApiResponse] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const apis = [
    {
      id: 'revenue',
      name: 'Revenue & RoR Registry',
      dept: 'Dept. of Land Records, Punjab',
      status: 'CONNECTED',
      latency: '42ms',
      records: '24,832',
      version: 'v2.4'
    },
    {
      id: 'registration',
      name: 'Deed Registration System',
      dept: 'Inspector General of Registration',
      status: 'CONNECTED',
      latency: '68ms',
      records: '18,402',
      version: 'v3.1'
    },
    {
      id: 'planning',
      name: 'Town Planning & Zoning GIS',
      dept: 'Chief Town Planner, Chandigarh',
      status: 'CONNECTED',
      latency: '55ms',
      records: '9,120',
      version: 'v1.8'
    },
    {
      id: 'municipality',
      name: 'Municipal Property Tax System',
      dept: 'Municipal Corporation Chandigarh',
      status: 'CONNECTED',
      latency: '78ms',
      records: '22,100',
      version: 'v2.0'
    },
    {
      id: 'utilities',
      name: 'Public Utilities Grid',
      dept: 'Power & Water Supply Board',
      status: 'SIMULATED',
      latency: '110ms',
      records: '24,800',
      version: 'v1.0-sim'
    },
    {
      id: 'banking',
      name: 'Mortgage & CERSAI Registry',
      dept: 'Central Registry of Securitisation',
      status: 'SIMULATED',
      latency: '95ms',
      records: '5,420',
      version: 'v1.2-sim'
    }
  ];

  const handleTestEndpoint = () => {
    let responsePayload = {};
    if (selectedEndpoint === '/api/v1/parcels/{ulpin}') {
      responsePayload = {
        status: 'SUCCESS',
        ulpin: activeParcel.ulpin,
        parcel_id: activeParcel.parcel_id,
        location: activeParcel.location,
        area: {
          standardized: activeParcel.standardized_area,
          original: activeParcel.original_area
        },
        land_use: activeParcel.land_use,
        zoning: activeParcel.zoning,
        jurisdiction: activeParcel.jurisdiction,
        last_updated: activeParcel.last_updated
      };
    } else if (selectedEndpoint === '/api/v1/parcels/{ulpin}/ownership') {
      responsePayload = {
        ulpin: activeParcel.ulpin,
        owner: activeParcel.owner,
        khata_no: activeParcel.khata_no,
        survey_no: activeParcel.survey_no,
        verification_status: 'VERIFIED_DIGITALLY'
      };
    } else if (selectedEndpoint === '/api/v1/parcels/{ulpin}/planning') {
      responsePayload = {
        ulpin: activeParcel.ulpin,
        zoning: activeParcel.zoning,
        permissible_far: 1.5,
        building_permission: activeParcel.building_permission
      };
    } else {
      responsePayload = {
        ulpin: activeParcel.ulpin,
        tax: activeParcel.property_tax,
        utilities: activeParcel.utilities,
        encumbrance: activeParcel.encumbrance
      };
    }

    setApiResponse(JSON.stringify(responsePayload, null, 2));
  };

  const handleSyncAll = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert('All 6 departmental registries synchronized with PLOT360 Common Land Model!');
    }, 1200);
  };

  return (
    <div className="page-scroll-area">
      {/* Header */}
      <div className="page-header-container">
        <div className="breadcrumb-row">
          <span className="breadcrumb-item">PLOT360</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item">Integration Hub</span>
        </div>
        <div className="page-title-row">
          <Share2 className="page-icon" />
          <h1 className="page-title">Interoperability & Integration Hub</h1>
        </div>
        <p className="page-subtitle">
          Departmental API gateways, state data normalization pipelines, Common Land Model connectors, and sync monitors.
        </p>
      </div>

      {/* Sync Banner */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--brand-accent-blue)' }}>
            PLOT360 Common Land Model Pipeline
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            STATE DEPARTMENT DATA → STATE-SPECIFIC MAPPING → VALIDATION → COMMON LAND MODEL → PLOT360
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={handleSyncAll}
          disabled={syncing}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} className={syncing ? 'spin' : ''} />
          <span>{syncing ? 'Synchronizing Pipeline...' : 'Sync All Datasets'}</span>
        </button>
      </div>

      {/* 6 Connected APIs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {apis.map(api => (
          <div
            key={api.id}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{api.name}</span>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: api.status === 'CONNECTED' ? 'var(--bg-badge-green)' : 'var(--bg-badge-blue)',
                  color: api.status === 'CONNECTED' ? 'var(--status-success)' : 'var(--brand-accent-cyan)'
                }}
              >
                {api.status}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{api.dept}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px' }}>
              <span>Latency: <strong>{api.latency}</strong></span>
              <span>Records: <strong>{api.records}</strong></span>
              <span>{api.version}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive REST API Explorer */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '14.5px', fontWeight: 700 }}>Interactive REST API Sandbox</h3>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Query live normalized JSON payloads using active ULPIN {activeParcel.ulpin}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={selectedEndpoint}
              onChange={(e) => {
                setSelectedEndpoint(e.target.value);
                setApiResponse(null);
              }}
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)', borderRadius: '6px', color: 'var(--text-primary)', padding: '6px 10px', fontSize: '12px' }}
            >
              <option value="/api/v1/parcels/{ulpin}">GET /api/v1/parcels/{'{ulpin}'} (Consolidated)</option>
              <option value="/api/v1/parcels/{ulpin}/ownership">GET /api/v1/parcels/{'{ulpin}'}/ownership (RoR)</option>
              <option value="/api/v1/parcels/{ulpin}/planning">GET /api/v1/parcels/{'{ulpin}'}/planning (Zoning)</option>
              <option value="/api/v1/parcels/{ulpin}/tax">GET /api/v1/parcels/{'{ulpin}'}/tax (Fiscal)</option>
            </select>
            <button className="btn-primary" onClick={handleTestEndpoint} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Play size={13} />
              <span>Send Request</span>
            </button>
          </div>
        </div>

        {apiResponse && (
          <pre
            style={{
              background: '#040915',
              padding: '14px',
              borderRadius: '8px',
              border: '1px solid var(--border-card)',
              color: '#38bdf8',
              fontFamily: 'monospace',
              fontSize: '11.5px',
              overflowX: 'auto',
              maxHeight: '220px'
            }}
          >
            {apiResponse}
          </pre>
        )}
      </div>
    </div>
  );
}
