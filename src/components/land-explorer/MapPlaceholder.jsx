import React, { useState } from 'react';
import {
  Layers,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  LocateFixed,
  X,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MapPlaceholder() {
  const {
    activeParcel,
    selectParcel,
    mapType,
    setMapType,
    isFullscreen,
    setIsFullscreen,
    layers,
    toggleLayer,
    layersDrawerOpen,
    setLayersDrawerOpen
  } = useApp();

  const [zoomLevel, setZoomLevel] = useState(17);

  return (
    <div className="map-wrapper" id="land-explorer-map-container">
      <div className="map-canvas-container">
        {/* Realistic Satellite Basemap Texture / Canvas */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: mapType === 'map'
              ? 'url(/assets/demo/chandigarh_roadmap_basemap.png)'
              : 'url(/assets/demo/chandigarh_satellite_basemap.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: mapType === 'satellite' ? 'brightness(0.95) contrast(1.05)' : 'none',
            transition: 'background-image 0.2s ease, filter 0.2s ease'
          }}
        />

        {/* Vector Cadastral SVG Overlay */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'auto'
          }}
          viewBox="0 0 800 600"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1.5" />
            </pattern>
          </defs>

          {/* Roadways / Jan Marg / Madhya Marg references */}
          <path
            d="M 120 0 L 380 600"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="24"
            fill="none"
          />
          <text x="180" y="240" fill="rgba(255,255,255,0.7)" fontSize="11" transform="rotate(64, 180, 240)" fontWeight="600">
            Madhya Marg
          </text>

          <path
            d="M 280 600 L 720 320"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="22"
            fill="none"
          />
          <text x="450" y="490" fill="rgba(255,255,255,0.7)" fontSize="11" transform="rotate(-32, 450, 490)" fontWeight="600">
            Jan Marg
          </text>

          {/* Green Belt Zone */}
          {layers.zoning && (
            <polygon
              points="480,120 680,180 720,300 520,240"
              fill="rgba(16, 185, 129, 0.2)"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
          )}
          {layers.zoning && (
            <text x="560" y="190" fill="#a7f3d0" fontSize="11" fontWeight="600">
              Green Belt
            </text>
          )}

          {/* Commercial Zone */}
          {layers.zoning && (
            <polygon
              points="490,340 600,370 560,460 450,420"
              fill="rgba(168, 85, 247, 0.22)"
              stroke="#a855f7"
              strokeWidth="1.5"
            />
          )}
          {layers.zoning && (
            <text x="500" y="390" fill="#e9d5ff" fontSize="11" fontWeight="600">
              Commercial Zone
            </text>
          )}

          {/* Institutional / Government Medical College */}
          <polygon
            points="140,360 260,390 230,500 110,460"
            fill="rgba(100, 116, 139, 0.2)"
            stroke="#94a3b8"
            strokeWidth="1.2"
          />
          <text x="130" y="440" fill="#cbd5e1" fontSize="10" fontWeight="500">
            Government Medical College
          </text>

          {/* Cadastral Parcels Layer */}
          {layers.parcels && (
            <>
              {/* Parcel P-1025 */}
              <polygon
                points="340,160 440,190 410,260 310,230"
                fill={activeParcel.parcel_id === 'P-1025' ? 'rgba(56, 189, 248, 0.35)' : 'rgba(15, 23, 42, 0.45)'}
                stroke={activeParcel.parcel_id === 'P-1025' ? '#38bdf8' : 'rgba(255, 255, 255, 0.4)'}
                strokeWidth={activeParcel.parcel_id === 'P-1025' ? '2.5' : '1'}
                style={{ cursor: 'pointer' }}
                onClick={() => selectParcel('P-1025')}
              />
              <text x="360" y="210" fill="#ffffff" fontSize="10" fontWeight="600" pointerEvents="none">P-1025</text>

              {/* Parcel P-1026 */}
              <polygon
                points="240,240 330,270 300,340 210,310"
                fill={activeParcel.parcel_id === 'P-1026' ? 'rgba(56, 189, 248, 0.35)' : 'rgba(15, 23, 42, 0.45)'}
                stroke={activeParcel.parcel_id === 'P-1026' ? '#38bdf8' : 'rgba(255, 255, 255, 0.4)'}
                strokeWidth={activeParcel.parcel_id === 'P-1026' ? '2.5' : '1'}
                style={{ cursor: 'pointer' }}
                onClick={() => selectParcel('P-1026')}
              />
              <text x="255" y="290" fill="#ffffff" fontSize="10" fontWeight="600" pointerEvents="none">P-1026</text>

              {/* Parcel P-1028 (Conflict) */}
              <polygon
                points="390,380 480,410 440,490 350,460"
                fill={activeParcel.parcel_id === 'P-1028' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.15)'}
                stroke={activeParcel.parcel_id === 'P-1028' ? '#ef4444' : 'rgba(239, 68, 68, 0.6)'}
                strokeWidth={activeParcel.parcel_id === 'P-1028' ? '2.5' : '1.2'}
                style={{ cursor: 'pointer' }}
                onClick={() => selectParcel('P-1028')}
              />
              <text x="400" y="435" fill="#fca5a5" fontSize="10" fontWeight="600" pointerEvents="none">P-1028</text>

              {/* Parcel P-1030 */}
              <polygon
                points="310,450 390,480 350,560 270,530"
                fill={activeParcel.parcel_id === 'P-1030' ? 'rgba(56, 189, 248, 0.35)' : 'rgba(15, 23, 42, 0.45)'}
                stroke={activeParcel.parcel_id === 'P-1030' ? '#38bdf8' : 'rgba(255, 255, 255, 0.4)'}
                strokeWidth={activeParcel.parcel_id === 'P-1030' ? '2.5' : '1'}
                style={{ cursor: 'pointer' }}
                onClick={() => selectParcel('P-1030')}
              />
              <text x="320" y="505" fill="#ffffff" fontSize="10" fontWeight="600" pointerEvents="none">P-1030</text>

              {/* Parcel P-1034 */}
              <polygon
                points="330,280 420,310 390,370 300,340"
                fill={activeParcel.parcel_id === 'P-1034' ? 'rgba(56, 189, 248, 0.35)' : 'rgba(15, 23, 42, 0.45)'}
                stroke={activeParcel.parcel_id === 'P-1034' ? '#38bdf8' : 'rgba(255, 255, 255, 0.4)'}
                strokeWidth={activeParcel.parcel_id === 'P-1034' ? '2.5' : '1'}
                style={{ cursor: 'pointer' }}
                onClick={() => selectParcel('P-1034')}
              />
              <text x="345" y="325" fill="#ffffff" fontSize="10" fontWeight="600" pointerEvents="none">P-1034</text>

              {/* PRIMARY DEMO PARCEL: P-1027 */}
              <polygon
                points="300,340 440,390 390,490 250,440"
                fill={activeParcel.parcel_id === 'P-1027' ? 'rgba(2, 132, 199, 0.35)' : 'rgba(15, 23, 42, 0.45)'}
                stroke={activeParcel.parcel_id === 'P-1027' ? '#38bdf8' : 'rgba(255, 255, 255, 0.4)'}
                strokeWidth={activeParcel.parcel_id === 'P-1027' ? '3.5' : '1.5'}
                filter={activeParcel.parcel_id === 'P-1027' ? 'url(#cyanGlow)' : 'none'}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={() => selectParcel('P-1027')}
              />
              <text
                x="330"
                y="420"
                fill="#ffffff"
                fontSize="14"
                fontWeight="700"
                pointerEvents="none"
                style={{ letterSpacing: '0.5px' }}
              >
                P-1027
              </text>
            </>
          )}
        </svg>

        {/* Selected Parcel Popup Marker over P-1027 */}
        {activeParcel.parcel_id === 'P-1027' && (
          <div className="parcel-popup-marker">
            <div className="popup-title">Parcel P-1027</div>
            <div className="popup-ulpin">ULPIN: {activeParcel.ulpin}</div>
            <div className="popup-area">Area: 1.14 Acres (1,248.50 m²) | Selected</div>
          </div>
        )}

        {/* Floating Top Left Pill */}
        <div className="map-pill-top-left">
          <span>Cadastral Parcels</span>
          <X size={12} style={{ cursor: 'pointer' }} onClick={() => toggleLayer('parcels')} />
        </div>

        {/* Basemap Switcher Pills (Top Right) */}
        <div className="map-basemap-toggle">
          <button
            className={`basemap-btn ${mapType === 'map' ? 'active' : ''}`}
            onClick={() => setMapType('map')}
          >
            Map
          </button>
          <button
            className={`basemap-btn ${mapType === 'satellite' ? 'active' : ''}`}
            onClick={() => setMapType('satellite')}
          >
            Satellite
          </button>
          <button
            className={`basemap-btn ${mapType === 'revenue' ? 'active' : ''}`}
            onClick={() => setMapType('revenue')}
          >
            Revenue
          </button>
          <button
            className={`basemap-btn ${mapType === 'survey' ? 'active' : ''}`}
            onClick={() => setMapType('survey')}
          >
            Survey
          </button>
        </div>

        {/* Right Floating Toolbar Buttons */}
        <div className="map-toolbar">
          <button
            className="map-tool-btn"
            onClick={() => setLayersDrawerOpen(!layersDrawerOpen)}
            title="Toggle Layers"
          >
            <Layers size={16} />
          </button>
          <button
            className="map-tool-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            className="map-tool-btn"
            onClick={() => setZoomLevel(prev => Math.min(prev + 1, 20))}
            title="Zoom In"
          >
            <Plus size={16} />
          </button>
          <button
            className="map-tool-btn"
            onClick={() => setZoomLevel(prev => Math.max(prev - 1, 10))}
            title="Zoom Out"
          >
            <Minus size={16} />
          </button>
          <button
            className="map-tool-btn"
            onClick={() => selectParcel('P-1027')}
            title="Center on Selected Parcel"
          >
            <LocateFixed size={16} />
          </button>
        </div>

        {/* Floating Layers Drawer */}
        {layersDrawerOpen && (
          <div className="map-layers-drawer">
            <div className="layer-drawer-header">
              <span>Layers</span>
              <X size={14} style={{ cursor: 'pointer' }} onClick={() => setLayersDrawerOpen(false)} />
            </div>

            <div className="layer-group-title">Base Map</div>
            <label className="layer-checkbox-item">
              <input
                type="radio"
                name="basemap-radio"
                checked={mapType === 'satellite'}
                onChange={() => setMapType('satellite')}
              />
              <span>Satellite (Default)</span>
            </label>
            <label className="layer-checkbox-item">
              <input
                type="radio"
                name="basemap-radio"
                checked={mapType === 'map'}
                onChange={() => setMapType('map')}
              />
              <span>Roadmap</span>
            </label>

            <div className="layer-group-title">Cadastral & Parcels</div>
            <label className="layer-checkbox-item">
              <input
                type="checkbox"
                checked={layers.parcels}
                onChange={() => toggleLayer('parcels')}
              />
              <span>Parcel Boundaries</span>
            </label>
            <label className="layer-checkbox-item">
              <input
                type="checkbox"
                checked={layers.labels}
                onChange={() => toggleLayer('labels')}
              />
              <span>Parcel Labels</span>
            </label>
            <label className="layer-checkbox-item">
              <input
                type="checkbox"
                checked={true}
                readOnly
              />
              <span>Selected Parcel</span>
            </label>

            <div className="layer-group-title">Planning & Zoning</div>
            <label className="layer-checkbox-item">
              <input
                type="checkbox"
                checked={layers.zoning}
                onChange={() => toggleLayer('zoning')}
              />
              <span>Master Plan Zones</span>
            </label>
            <label className="layer-checkbox-item">
              <input
                type="checkbox"
                checked={layers.zoning}
                onChange={() => toggleLayer('zoning')}
              />
              <span>Green Belt / Parks</span>
            </label>

            <div className="layer-group-title">Other Layers</div>
            <label className="layer-checkbox-item">
              <input
                type="checkbox"
                checked={layers.utilities}
                onChange={() => toggleLayer('utilities')}
              />
              <span>Utilities Network</span>
            </label>
            <label className="layer-checkbox-item">
              <input
                type="checkbox"
                checked={layers.protected}
                onChange={() => toggleLayer('protected')}
              />
              <span>Heritage / Protected</span>
            </label>
          </div>
        )}

        {/* Floating Legend Box (Bottom Right) */}
        <div className="map-legend">
          <div className="legend-title">Legend</div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: 'var(--brand-accent-blue)', border: '1px solid #38bdf8' }} />
            <span>Parcels</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#22c55e' }} />
            <span>Satellite</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#f59e0b' }} />
            <span>Revenue</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#a855f7' }} />
            <span>Survey</span>
          </div>
        </div>

        {/* Map Scale Ruler (Bottom Left) */}
        <div className="map-scale">
          <span>0</span>
          <div className="scale-ruler" />
          <span>200 m</span>
        </div>
      </div>
    </div>
  );
}
