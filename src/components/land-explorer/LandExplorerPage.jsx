import React from 'react';
import PageHeader from './PageHeader';
import KpiStrip from './KpiStrip';
import GoogleMapView from '../map/GoogleMapView';
import ParcelDetailsPanel from './ParcelDetailsPanel';
import QuickActionsBar from './QuickActionsBar';

export default function LandExplorerPage() {
  return (
    <div className="page-scroll-area">
      {/* 1. Header & Context */}
      <PageHeader />

      {/* 2. 5-Card KPI Strip */}
      <KpiStrip />

      {/* 3. Main Workspace: Strictly Bounded Grid (Map + Parcel Details) */}
      <div className="workspace-container">
        <GoogleMapView />
        <ParcelDetailsPanel />
      </div>

      {/* 4. Quick Actions Bottom Bar */}
      <QuickActionsBar />
    </div>
  );
}
