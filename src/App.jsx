import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Topbar from './components/layout/Topbar';
import LandExplorerPage from './components/land-explorer/LandExplorerPage';
import ParcelIntelligenceModule from './components/modules/ParcelIntelligenceModule';
import GovernanceModule from './components/modules/GovernanceModule';
import PlanningModule from './components/modules/PlanningModule';
import CitizenServicesModule from './components/modules/CitizenServicesModule';
import ServicesWorkflowsModule from './components/modules/ServicesWorkflowsModule';
import AnalyticsAiModule from './components/modules/AnalyticsAiModule';
import AnalyticsAdminModule from './components/modules/AnalyticsAdminModule';
import IntegrationHubModule from './components/modules/IntegrationHubModule';
import AdminSecurityModule from './components/modules/AdminSecurityModule';
import SystemHealthModule from './components/modules/SystemHealthModule';
import PresentationModeModal from './components/modules/PresentationModeModal';
import UnifiedParcelModal from './components/parcel/UnifiedParcelModal';
import ViewEvidenceModal from './components/ai/ViewEvidenceModal';
import FieldVerificationModal from './components/ai/FieldVerificationModal';

import './styles/variables.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/reference-ui.css';

import { ShieldAlert } from 'lucide-react';

function MainApp() {
  const { activeModule, deviceMode, lightweightMode, canAccessModule, currentRole, setActiveModule, isTourOpen } = useApp();

  const isAuthorized = isTourOpen || activeModule === 'presentation' || (canAccessModule ? canAccessModule(activeModule) : true);

  return (
    <div className={`app-shell mode-${deviceMode} ${lightweightMode ? 'mode-lightweight' : ''}`}>
      {/* 1. Master Platform Header & Navigation Subnav */}
      <Topbar />

      {/* 2. Main Application Area */}
      <div className="main-content">

        {!isAuthorized ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 70px)', padding: '24px', textAlign: 'center' }}>
            <div style={{ padding: '36px', maxWidth: '520px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--status-error)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShieldAlert size={28} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Access Restricted</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                Your current active role (<strong>{currentRole}</strong>) does not have statutory clearance to access the <strong>{activeModule}</strong> module.
              </p>
              <button className="btn-primary" onClick={() => setActiveModule('explorer')}>
                Return to Land Explorer
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Dynamic Module Rendering - 4 Primary Sections + Deep Route Backwards-Compatibility */}
            {(activeModule === 'explorer' || activeModule === 'presentation') && <LandExplorerPage />}
            {activeModule === 'intelligence' && <ParcelIntelligenceModule />}
            {activeModule === 'records' && <GovernanceModule />}
            {activeModule === 'planning' && <PlanningModule />}
            {activeModule === 'workflows' && <ServicesWorkflowsModule />}
            {activeModule === 'citizen' && <ServicesWorkflowsModule initialTab="citizen" />}
            {activeModule === 'analytics' && <AnalyticsAdminModule initialTab="decision" />}
            {activeModule === 'integrations' && <AnalyticsAdminModule initialTab="integrations" />}
            {activeModule === 'admin' && <AnalyticsAdminModule initialTab="admin" />}
            {activeModule === 'health' && <AnalyticsAdminModule initialTab="health" />}
          </>
        )}
      </div>

      {/* Global Modals */}
      <UnifiedParcelModal />
      <ViewEvidenceModal />
      <FieldVerificationModal />

      {/* Dynamic Guided Presentation Live Tour Overlay */}
      {isTourOpen && <PresentationModeModal />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
