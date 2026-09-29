import React, { useState } from 'react';
import UniversalParcelHeader from './UniversalParcelHeader';
import LayersPanel from './LayersPanel';
import GoogleMapView from '../map/GoogleMapView';
import ParcelDetailsPanel from './ParcelDetailsPanel';
import AiEvidencePanel from './AiEvidencePanel';
import RoleDashboardView from './RoleDashboardView';
import { useApp } from '../../context/AppContext';
import { LayoutGrid, UserCheck, MapPin, Sparkles } from 'lucide-react';

export default function LandExplorerPage() {
  const { currentRole, activeParcel, t } = useApp();
  const [viewMode, setViewMode] = useState('gis'); // 'gis' (Universal Workspace) or 'role' (Role Dashboard)
  const [aiEvidenceOpen, setAiEvidenceOpen] = useState(false);

  return (
    <div className="page-scroll-area">
      {/* 1. Persistent Universal Parcel Header (Reference Image Centerpiece) */}
      <UniversalParcelHeader />

      {/* Sub-Header View Mode Switcher for Land Explorer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2px 0 6px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className={`view-mode-toggle-btn ${viewMode === 'gis' ? 'active' : ''}`}
            onClick={() => setViewMode('gis')}
          >
            <MapPin size={13} />
            <span>Universal GIS Workspace</span>
          </button>
          <button
            className={`view-mode-toggle-btn ${viewMode === 'role' ? 'active' : ''}`}
            onClick={() => setViewMode('role')}
          >
            <UserCheck size={13} />
            <span>{currentRole ? currentRole.replace('_', ' ').toUpperCase() : 'ROLE'} Dashboard</span>
          </button>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {viewMode === 'gis'
            ? 'Unified Cadastral Workspace: Layers • Map • Records • On-Demand AI Evidence'
            : `Role-Specific Operational Surface for ${currentRole}`}
        </div>
      </div>

      {/* 2. Main Content Area */}
      {viewMode === 'gis' ? (
        <div className="gis-workspace-grid">
          {/* Panel 1: Interactive Layers Panel */}
          <LayersPanel />

          {/* Panel 2: Interactive Cadastral Map (FROZEN - GoogleMapView) */}
          <div className="workspace-map-shell">
            <GoogleMapView />
          </div>

          {/* Panel 3: Parcel Details Panel */}
          <ParcelDetailsPanel />
        </div>
      ) : (
        <RoleDashboardView onReturnToMap={() => setViewMode('gis')} />
      )}

      {/* 3. Floating AI Evidence Launcher Button in Bottom Right */}
      <div className="floating-ai-launcher-container">
        <button
          className="floating-ai-launcher-btn"
          onClick={() => setAiEvidenceOpen(prev => !prev)}
          title="Open AI Evidence Panel & Statutory Clearance Verification"
        >
          <Sparkles size={15} color="var(--brand-accent-cyan)" />
          <span>AI Evidence Panel</span>
          <span className="ai-confidence-pill">
            {activeParcel?.ai_alert ? '84%' : '98%'}
          </span>
        </button>
      </div>

      {/* 4. AI Evidence Pop-up Dialog */}
      {aiEvidenceOpen && (
        <div className="ai-evidence-popup-overlay" onClick={() => setAiEvidenceOpen(false)}>
          <div className="ai-evidence-popup-window" onClick={e => e.stopPropagation()}>
            <AiEvidencePanel onClose={() => setAiEvidenceOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
