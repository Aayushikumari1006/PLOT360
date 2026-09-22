import React from 'react';
import { BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PageHeader() {
  const { activeParcel, currentLocation, selectedJurisdiction } = useApp();

  // Dynamic breadcrumb derived from state
  const state = currentLocation ? currentLocation.state : 'India';
  const jurisdiction = selectedJurisdiction || 'Chandigarh';
  const locationName = currentLocation ? currentLocation.name : 'Chandigarh';
  const parcelLabel = activeParcel ? activeParcel.parcel_id : 'No Parcel Selected';

  return (
    <div className="page-header-container">
      {/* Breadcrumb row — dynamic */}
      <div className="breadcrumb-row">
        <span className="breadcrumb-item">India</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-item">{state}</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-item">{locationName}</span>
        {activeParcel && (
          <>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-item" style={{ color: 'var(--brand-accent-blue)', fontWeight: 600 }}>
              {parcelLabel}
            </span>
          </>
        )}
      </div>

      {/* Page Title & Context */}
      <div className="page-title-row">
        <BookOpen className="page-icon" />
        <h1 className="page-title">Land Explorer</h1>
      </div>
      <p className="page-subtitle">
        Integrated parcel intelligence — Explore cadastral boundaries and connected land-governance records through a common parcel identity.
      </p>
    </div>
  );
}
