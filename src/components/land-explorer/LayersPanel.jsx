import React from 'react';
import { Layers, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LayersPanel() {
  const { mapType, setMapType, layers, toggleLayer } = useApp();

  return (
    <div className="layers-panel-card">
      <div className="layers-header-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} color="var(--brand-accent-cyan)" />
          <span>Layers</span>
        </div>
      </div>

      {/* Base Map Group */}
      <div className="layers-group-title">Base Map</div>
      <label className="layer-toggle-row">
        <span>Satellite (Default)</span>
        <input
          type="radio"
          name="basemap-choice"
          checked={mapType === 'satellite'}
          onChange={() => setMapType('satellite')}
        />
      </label>
      <label className="layer-toggle-row">
        <span>Roadmap</span>
        <input
          type="radio"
          name="basemap-choice"
          checked={mapType === 'map'}
          onChange={() => setMapType('map')}
        />
      </label>
      <label className="layer-toggle-row">
        <span>Hybrid</span>
        <input
          type="radio"
          name="basemap-choice"
          checked={mapType === 'hybrid'}
          onChange={() => setMapType('hybrid')}
        />
      </label>

      {/* Essential Governance Group */}
      <div className="layers-group-title" style={{ marginTop: '10px' }}>
        Essential Governance
      </div>
      <label className="layer-toggle-row">
        <span>Cadastral Boundaries</span>
        <input
          type="checkbox"
          checked={layers.parcels}
          onChange={() => toggleLayer('parcels')}
        />
      </label>
      <label className="layer-toggle-row">
        <span>Parcel Labels</span>
        <input
          type="checkbox"
          checked={layers.labels}
          onChange={() => toggleLayer('labels')}
        />
      </label>
      <label className="layer-toggle-row">
        <span>Master Plan Zones</span>
        <input
          type="checkbox"
          checked={layers.zoning}
          onChange={() => toggleLayer('zoning')}
        />
      </label>
      <label className="layer-toggle-row">
        <span>Utilities Network</span>
        <input
          type="checkbox"
          checked={layers.utilities}
          onChange={() => toggleLayer('utilities')}
        />
      </label>
      <label className="layer-toggle-row">
        <span>Statutory Buffers</span>
        <input
          type="checkbox"
          checked={layers.protected}
          onChange={() => toggleLayer('protected')}
        />
      </label>

      {/* Administrative Boundaries */}
      <div className="layers-group-title" style={{ marginTop: '10px' }}>
        Administrative
      </div>
      <label className="layer-toggle-row">
        <span>Tehsil Boundaries</span>
        <input
          type="checkbox"
          checked={layers.boundaries}
          onChange={() => toggleLayer('boundaries')}
        />
      </label>
    </div>
  );
}
