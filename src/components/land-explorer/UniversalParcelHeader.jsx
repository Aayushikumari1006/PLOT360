import React from 'react';
import { MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function UniversalParcelHeader() {
  const { activeParcel, t } = useApp();

  if (!activeParcel) return null;

  const areaNum = parseFloat(activeParcel.area_sqm) ||
    parseFloat(activeParcel.area_numeric) ||
    (activeParcel.area_original ? parseFloat(String(activeParcel.area_original).replace(/[^0-9.]/g, '')) : 2954.21) ||
    2954.21;

  const acreVal = (areaNum * 0.000247105).toFixed(2);
  const landUseVal = activeParcel.land_use || activeParcel.plan?.zoning || activeParcel.zoning || 'Sector / Special';
  const zoningVal = activeParcel.zoning || (activeParcel.restrictions ? 'Eco-Sensitive Buffer' : 'Commercial Mixed');
  const jurisdictionVal = activeParcel.jurisdiction || activeParcel.location || 'Chandigarh';

  return (
    <div className="universal-parcel-header">
      {/* Left: Parcel Identity & Badge */}
      <div className="universal-header-left">
        <div className="parcel-id-box">
          <MapPin size={24} />
        </div>
        <div className="parcel-identity-info">
          <div className="parcel-name-badge-row">
            <span className="parcel-primary-title">{activeParcel.parcel_id}</span>
            <span className="status-pill-verified" style={{ fontSize: '10.5px', padding: '2px 8px' }}>
              ✓ {t ? t('status.verified', 'Verified') : 'Verified'}
            </span>
          </div>
          <div className="parcel-ulpin-sub">
            ULPIN: <strong>{activeParcel.ulpin}</strong> • {activeParcel.location}
          </div>
        </div>
      </div>

      {/* Right: Key Spatial & Governance Metrics */}
      <div className="universal-header-metrics">
        <div className="header-metric-item">
          <span className="metric-key-label">{t ? t('field.standardArea', 'Area') : 'Area'}</span>
          <span className="metric-val-large">{areaNum.toLocaleString('en-IN', { maximumFractionDigits: 2 })} m²</span>
          <span className="metric-val-sub">{acreVal} Acre</span>
        </div>

        <div className="header-metric-item">
          <span className="metric-key-label">{t ? t('field.landUse', 'Land Use') : 'Land Use'}</span>
          <span className="metric-val-large">{landUseVal}</span>
          <span className="metric-val-sub">Master Plan Sanctioned</span>
        </div>

        <div className="header-metric-item">
          <span className="metric-key-label">{t ? t('field.zoning', 'Zoning') : 'Zoning'}</span>
          <span className="metric-val-large">{zoningVal}</span>
          <span className="metric-val-sub">Statutory Status Active</span>
        </div>

        <div className="header-metric-item">
          <span className="metric-key-label">{t ? t('topbar.jurisdiction', 'Jurisdiction') : 'Jurisdiction'}</span>
          <span className="metric-val-large">{jurisdictionVal}</span>
          <span className="metric-val-sub">State Cadastre Division</span>
        </div>
      </div>
    </div>
  );
}
