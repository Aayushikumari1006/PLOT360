import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Sun,
  Moon,
  Monitor,
  Tablet,
  Smartphone,
  ChevronDown,
  MapPin,
  Check,
  CheckCheck,
  Layers,
  Sparkles,
  ShieldCheck,
  Shield,
  Loader2,
  LayoutGrid,
  Box,
  Users,
  BarChart3,
  Tv,
  CheckCircle2,
  Zap,
  Leaf
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { searchGlobal } from '../../api/search';
import HelpModal from './HelpModal';
import PlatformModal from './PlatformModal';

export default function Topbar() {
  const {
    currentRole,
    setCurrentRole,
    roles,
    theme,
    setTheme,
    deviceMode,
    setDeviceMode,
    lightweightMode,
    setLightweightMode,
    language,
    setLanguage,
    t,
    supportedLanguages,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    searchQuery,
    setSearchQuery,
    selectParcel,
    changeLocation,
    changeJurisdiction,
    parcels,
    demoLocations,
    selectedLocation,
    selectedLocationId,
    selectedJurisdiction,
    helpModalOpen,
    setHelpModalOpen,
    platformModalOpen,
    setPlatformModalOpen,
    activeParcel,
    activeModule,
    setActiveModule,
    setUnifiedReportOpen,
    canAccessModule
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [jurisdictionDropdownOpen, setJurisdictionDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const [liveSearchResults, setLiveSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const locationDropdownRef = useRef(null);
  const jurisdictionDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const roleDropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target)) {
        setLocationDropdownOpen(false);
      }
      if (jurisdictionDropdownRef.current && !jurisdictionDropdownRef.current.contains(e.target)) {
        setJurisdictionDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target)) {
        setRoleDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResultsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced Live Backend Search
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setLiveSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    const timer = setTimeout(() => {
      searchGlobal(query)
        .then((data) => {
          if (Array.isArray(data)) {
            setLiveSearchResults(data);
          }
        })
        .catch(() => {
          setLiveSearchResults([]);
        })
        .finally(() => {
          setSearchLoading(false);
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const uniqueJurisdictions = [
    'All Jurisdictions',
    'Chandigarh',
    'Delhi',
    'Karnataka',
    'Maharashtra',
    'Rajasthan',
    'Gujarat',
    'Uttar Pradesh',
    'Telangana',
    'Tamil Nadu',
    'Himachal Pradesh',
    'Kerala',
    'Haryana',
    'Punjab',
    'West Bengal',
    'Madhya Pradesh',
    'Bihar',
    'Odisha',
    'Uttarakhand',
    'Assam',
    'Goa'
  ];

  const filteredLocationsForDropdown = (selectedJurisdiction && selectedJurisdiction !== 'All Jurisdictions')
    ? demoLocations.filter(l => l.jurisdiction.toLowerCase() === selectedJurisdiction.toLowerCase() || l.state.toLowerCase().includes(selectedJurisdiction.toLowerCase()))
    : demoLocations;

  const q = searchQuery.trim().toLowerCase();
  const filteredParcels = q
    ? parcels.filter(
        p =>
          p.parcel_id.toLowerCase().includes(q) ||
          p.ulpin.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          (p.scenario && p.scenario.toLowerCase().includes(q)) ||
          (p.survey_no && p.survey_no.toLowerCase().includes(q)) ||
          (p.owner && p.owner.name.toLowerCase().includes(q))
      )
    : [];

  const filteredLocations = q
    ? demoLocations.filter(
        l =>
          l.name.toLowerCase().includes(q) ||
          l.jurisdiction.toLowerCase().includes(q) ||
          l.state.toLowerCase().includes(q)
      )
    : [];

  const handleSelectParcelResult = (parcelId) => {
    selectParcel(parcelId);
    setSearchQuery('');
    setSearchResultsOpen(false);
  };

  const handleSelectLocationResult = (locationId) => {
    changeLocation(locationId);
    setSearchQuery('');
    setSearchResultsOpen(false);
  };

  const handleSelectLocation = (locationId) => {
    changeLocation(locationId);
    setLocationDropdownOpen(false);
  };

  const handleSelectJurisdiction = (jur) => {
    changeJurisdiction(jur);
    setJurisdictionDropdownOpen(false);
  };

  // Natural Language Intent Engine (Section 12: LandIQ AI Assistant)
  const getNaturalLanguageIntent = (query, parcel) => {
    if (!query || query.length < 4) return null;
    const lower = query.toLowerCase();
    const p = parcel || parcels[0] || {};
    const parcelName = p.parcel_id ? `Parcel ${p.parcel_id}` : 'Selected Parcel';

    if (lower.includes('who own') || lower.includes('owner') || lower.includes('ownership') || lower.includes('title holder')) {
      return {
        queryType: 'OWNERSHIP',
        targetModule: 'intelligence',
        targetTab: 'ownership',
        finding: `${parcelName} is registered to ${p.owner?.name || 'Sardar Gurbir Singh Dhillon'} (${p.owner?.shares || 'Sole Owner, 100% Share'}).`,
        evidence: `Jamabandi RoR Khewat #89, Khatoni #104; Sub-Registrar Conveyance Deed #${p.deed_no || 'SR-2021-4412'}.`,
        confidence: 'High (100% Deterministic State Registry Link)',
        recommendedAction: 'View Complete RoR & Ownership Chain in Parcel Intelligence'
      };
    }
    if (lower.includes('encumbrance') || lower.includes('mortgage') || lower.includes('lien') || lower.includes('loan') || lower.includes('liabilit')) {
      const isEnc = p.encumbrance?.status === 'Active' || p.encumbrance?.amount;
      return {
        queryType: 'LIABILITIES',
        targetModule: 'intelligence',
        targetTab: 'liabilities',
        finding: isEnc
          ? `${parcelName} has an active equitable mortgage charge registered under CERSAI.`
          : `${parcelName} has no registered encumbrances or court stay orders.`,
        evidence: `CERSAI Charge Registry & Banking Integration (Ref: ${p.encumbrance?.reference || 'CERSAI-CHG-2022-8812'}).`,
        confidence: 'High (Authoritative CERSAI & Banking API)',
        recommendedAction: 'Inspect Liabilities & Bank NOC Mandates in Parcel Intelligence'
      };
    }
    if (lower.includes('construction') || lower.includes('compliant') || lower.includes('building') || lower.includes('permission') || lower.includes('sanction')) {
      const bp = p.building_permission || {};
      return {
        queryType: 'BUILDING_COMPLIANCE',
        targetModule: 'intelligence',
        targetTab: 'building',
        finding: `${parcelName} building sanction order ${bp.order_no || 'BP-MC-2023-0914'} is recorded as ${bp.status || 'Approved & Valid'}.`,
        evidence: `Urban Local Body (ULB) Building Sanction Register & Plinth Approval Ledger.`,
        confidence: 'High (Municipal ULB Building Sanction Authority)',
        recommendedAction: 'Cross-Check Building Sanction & Plinth Specs in Parcel Intelligence'
      };
    }
    if (lower.includes('tax') || lower.includes('due') || lower.includes('property tax') || lower.includes('assessment')) {
      const tax = p.property_tax || {};
      return {
        queryType: 'TAXATION',
        targetModule: 'intelligence',
        targetTab: 'tax',
        finding: `${parcelName} property tax assessment ${tax.assessment_id || 'PT-CHD-2024-8902'} status is ${tax.status || 'Paid & Cleared'}.`,
        evidence: `Municipal Corporation Property Tax Assessment Ledger (Receipt: ${tax.last_payment || '28 June 2024'}).`,
        confidence: 'High (Municipal Revenue Ledger API)',
        recommendedAction: 'Review Tax Assessment & Receipt History in Parcel Intelligence'
      };
    }
    return null;
  };

  const naturalLanguageIntent = getNaturalLanguageIntent(searchQuery, activeParcel);
  const activeRoleObj = roles.find(r => r.id === currentRole) || roles[0];

  const primaryNavTabs = [
    { id: 'explorer', label: t ? t('nav.explorer', 'Land Explorer') : 'Land Explorer', icon: LayoutGrid },
    { id: 'intelligence', label: t ? t('nav.intelligence', 'Parcel Intelligence') : 'Parcel Intelligence', icon: Box },
    { id: 'workflows', label: t ? t('nav.citizen', 'Services & Workflows') : 'Services & Workflows', icon: Users },
    { id: 'analytics', label: t ? t('nav.analytics', 'Analytics') : 'Analytics', icon: BarChart3 },
    { id: 'admin', label: t ? t('nav.admin', 'Admin & Security') : 'Admin & Security', icon: ShieldCheck }
  ];

  const isTabActive = (itemId) => {
    if (activeModule === itemId) return true;
    if (itemId === 'intelligence' && ['records', 'planning'].includes(activeModule)) return true;
    if (itemId === 'workflows' && ['citizen', 'services'].includes(activeModule)) return true;
    if (itemId === 'analytics' && activeModule === 'analytics') return true;
    if (itemId === 'admin' && ['admin', 'integrations', 'health'].includes(activeModule)) return true;
    return false;
  };

  return (
    <>
      {/* 1. Master Platform Header (Reference Image Topmost Banner) */}
      <div className="plot360-master-header">
        {/* Left: Brand Identity */}
        <div className="master-header-left">
          <div className="master-logo-group" onClick={() => setActiveModule('explorer')}>
            <div className="master-logo-dynamic-wrap">
              <img
                src="/logo-full-transparent.png"
                alt="PLOT360 — From Boundaries to Insights"
                className="master-brand-logo-img"
                onError={(e) => {
                  e.currentTarget.src = '/logo.png';
                }}
              />
              <div className="master-logo-pulse-ring" />
            </div>
          </div>
        </div>

        {/* Center: Role-Based Land Governance Platform Title & Subtitle */}
        <div className="master-header-center">
          <span className="platform-badge-title">ROLE-BASED LAND GOVERNANCE PLATFORM</span>
          <div className="platform-subtitle-pills">
            <span>One Parcel</span>
            <span>•</span>
            <span>One ULPIN</span>
            <span>•</span>
            <span>Connected Records</span>
            <span>•</span>
            <span>Role-Specific Actions</span>
          </div>
        </div>

        {/* Right: Actions (Trust badges removed as requested) */}
        <div className="master-header-right">
          <button
            className="icon-btn"
            title="Integrated Land Governance Platform Overview"
            onClick={() => setPlatformModalOpen(true)}
          >
            <ChevronDown size={14} />
          </button>
          <button
            className="icon-btn"
            title="Help & Statutory Guidelines"
            onClick={() => setHelpModalOpen(true)}
          >
            <HelpCircle size={15} />
          </button>
        </div>
      </div>

      {/* 2. Primary Navigation Strip & Controls Subnav Bar */}
      <header className="plot360-subnav-bar">
        {/* Left: 4 Primary Functional Navigation Toggles (Specification Section 4) */}
        <div className="subnav-tabs-group">
          {primaryNavTabs.map(item => {
            const Icon = item.icon;
            const isActive = isTabActive(item.id);
            const isAllowed = canAccessModule ? canAccessModule(item.id) : true;
            return (
              <button
                key={item.id}
                className={`subnav-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveModule(item.id)}
                disabled={!isAllowed}
                style={!isAllowed ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                title={!isAllowed ? `${item.label} (Restricted for ${currentRole})` : item.label}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center: Search + Jurisdiction + Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '640px', margin: '0 8px' }}>
          {/* Global Search Bar */}
          <div ref={searchRef} style={{ position: 'relative', flex: 1 }}>
            <div className="search-input-wrapper" style={{ width: '100%' }}>
              <Search size={14} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search ULPIN, parcel, survey, or query LandIQ..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setSearchResultsOpen(true);
                }}
                onFocus={() => setSearchResultsOpen(true)}
              />
              {searchLoading && <Loader2 size={13} className="search-loader" />}
            </div>

            {/* Search Results Dropdown */}
            {searchResultsOpen && searchQuery.trim() && (
              <div
                style={{
                  position: 'absolute',
                  top: '40px',
                  left: 0,
                  right: 0,
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '8px',
                  padding: '6px',
                  zIndex: 300,
                  boxShadow: 'var(--shadow-lg)',
                  maxHeight: '340px',
                  overflowY: 'auto'
                }}
              >
                {/* Loading indicator */}
                {searchLoading && (
                  <div style={{ padding: '8px 12px', fontSize: '11.5px', color: 'var(--brand-accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Searching authoritative registries...</span>
                  </div>
                )}

                {/* LandIQ AI Assistant Quick Answer */}
                {naturalLanguageIntent && (
                  <div style={{ marginBottom: '10px', padding: '12px', background: 'var(--bg-card-alt)', borderRadius: '8px', border: '1px solid var(--brand-accent-blue)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={14} color="var(--brand-accent-cyan)" />
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        LandIQ Assistant Dossier
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                      <strong style={{ color: 'var(--brand-accent-blue)' }}>Finding:</strong> {naturalLanguageIntent.finding}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: 'var(--brand-accent-cyan)' }}>Evidence:</strong> {naturalLanguageIntent.evidence}
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--status-warning)' }}>
                      <strong>Confidence:</strong> {naturalLanguageIntent.confidence}
                    </div>
                    <button
                      className="btn-primary"
                      style={{ marginTop: '4px', padding: '5px 10px', fontSize: '11px', alignSelf: 'flex-start' }}
                      onClick={() => {
                        setActiveModule(naturalLanguageIntent.targetModule);
                        setSearchQuery('');
                        setSearchResultsOpen(false);
                      }}
                    >
                      {naturalLanguageIntent.recommendedAction} →
                    </button>
                  </div>
                )}

                {/* Live Backend Results */}
                {liveSearchResults.length > 0 && (
                  <div style={{ marginBottom: '6px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', padding: '3px 8px', fontWeight: 700, textTransform: 'uppercase' }}>
                      Verified Registry Matches ({liveSearchResults.length})
                    </div>
                    {liveSearchResults.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        onClick={() => {
                          if (item.type === 'Parcel') {
                            handleSelectParcelResult(item.id);
                          } else if (item.ulpin) {
                            handleSelectParcelResult(item.ulpin);
                          }
                        }}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-accent-blue)' }}>{item.title}</span>
                            <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '3px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--brand-accent-cyan)', fontWeight: 700 }}>
                              {item.type}
                            </span>
                          </div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                            {item.subtitle}
                          </div>
                        </div>
                        <span style={{ fontSize: '10px', padding: '1px 5px', borderRadius: '3px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--brand-accent-cyan)', fontWeight: 600 }}>
                          Select
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Fallback Location Results */}
                {liveSearchResults.length === 0 && filteredLocations.length > 0 && (
                  <div style={{ marginBottom: '6px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', padding: '3px 8px', fontWeight: 700, textTransform: 'uppercase' }}>
                      Locations ({filteredLocations.length})
                    </div>
                    {filteredLocations.map(loc => (
                      <div
                        key={loc.id}
                        onClick={() => handleSelectLocationResult(loc.id)}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <MapPin size={13} color="var(--brand-accent-cyan)" />
                        <div>
                          <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{loc.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>{loc.state}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Fallback Parcel Results */}
                {liveSearchResults.length === 0 && filteredParcels.length > 0 && (
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', padding: '3px 8px', fontWeight: 700, textTransform: 'uppercase' }}>
                      Parcels ({filteredParcels.length})
                    </div>
                    {filteredParcels.slice(0, 10).map(p => (
                      <div
                        key={p.parcel_id}
                        onClick={() => handleSelectParcelResult(p.parcel_id)}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-accent-blue)' }}>{p.parcel_id}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.ulpin}</span>
                          </div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                            {p.location} • {p.scenario_display || p.scenario}
                          </div>
                        </div>
                        <span style={{ fontSize: '10px', padding: '1px 5px', borderRadius: '3px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--brand-accent-cyan)', fontWeight: 600 }}>
                          Select
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {!searchLoading && liveSearchResults.length === 0 && filteredLocations.length === 0 && filteredParcels.length === 0 && (
                  <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                    No matching parcels or locations found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Jurisdiction Dropdown */}
          <div ref={jurisdictionDropdownRef} style={{ position: 'relative' }}>
            <div
              className="selector-pill"
              title={`Jurisdiction: ${selectedJurisdiction}`}
              onClick={() => setJurisdictionDropdownOpen(v => !v)}
              style={{ cursor: 'pointer', fontSize: '11.5px', padding: '5px 8px' }}
            >
              <span>🏛️</span>
              <span className="pill-val">{selectedJurisdiction}</span>
              <ChevronDown size={11} />
            </div>

            {jurisdictionDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '8px',
                  padding: '6px',
                  zIndex: 99999,
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  minWidth: '190px',
                  maxHeight: '320px',
                  overflowY: 'auto'
                }}
              >
                {uniqueJurisdictions.map(jur => {
                  const isActive = selectedJurisdiction === jur;
                  return (
                    <div
                      key={jur}
                      onClick={() => handleSelectJurisdiction(jur)}
                      style={{
                        padding: '7px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? 'var(--brand-accent-cyan)' : 'var(--text-primary)',
                        backgroundColor: isActive ? 'var(--bg-card-hover)' : 'transparent'
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <span>{jur}</span>
                      {isActive && <Check size={13} color="var(--brand-accent-cyan)" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Location Dropdown */}
          <div ref={locationDropdownRef} style={{ position: 'relative' }}>
            <div
              className="selector-pill"
              title={`Location: ${selectedLocation}`}
              onClick={() => setLocationDropdownOpen(v => !v)}
              style={{ cursor: 'pointer', fontSize: '11.5px', padding: '5px 8px' }}
            >
              <MapPin size={12} className="text-muted" />
              <span className="pill-val">{selectedLocation}</span>
              <ChevronDown size={11} />
            </div>

            {locationDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '8px',
                  padding: '6px',
                  zIndex: 99999,
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  minWidth: '210px',
                  maxHeight: '320px',
                  overflowY: 'auto'
                }}
              >
                {filteredLocationsForDropdown.map(loc => {
                  const isActive = (selectedLocationId === loc.id) || (selectedLocation === loc.name);
                  return (
                    <div
                      key={loc.id}
                      onClick={() => handleSelectLocation(loc.id)}
                      style={{
                        padding: '7px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? 'var(--brand-accent-cyan)' : 'var(--text-primary)',
                        backgroundColor: isActive ? 'var(--bg-card-hover)' : 'transparent'
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <span>{loc.name}</span>
                      {isActive && <Check size={13} color="var(--brand-accent-cyan)" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Role Switcher + Language + Theme + Presentation Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Role Switcher Dropdown */}
          <div ref={roleDropdownRef} style={{ position: 'relative' }}>
            <div
              className="selector-pill"
              title={`Switch Role (Current: ${currentRole})`}
              onClick={() => setRoleDropdownOpen(v => !v)}
              style={{ cursor: 'pointer', padding: '5px 10px', background: 'rgba(37, 99, 235, 0.12)', borderColor: 'rgba(56, 189, 248, 0.3)' }}
            >
              <span style={{ fontSize: '12px' }}>👤</span>
              <span className="pill-val" style={{ color: 'var(--brand-accent-cyan)', fontWeight: 700 }}>
                {activeRoleObj.name || activeRoleObj.label || activeRoleObj.id}
              </span>
              <ChevronDown size={11} />
            </div>

            {roleDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '8px',
                  padding: '6px',
                  zIndex: 99999,
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  minWidth: '220px'
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', padding: '4px 8px 6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Statutory Roles (RBAC)
                </div>
                {roles.map(r => {
                  const isActive = currentRole === r.id;
                  const roleTitle = r.name || r.label || r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => {
                        setCurrentRole(r.id);
                        setRoleDropdownOpen(false);
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        fontWeight: isActive ? 700 : 500,
                        backgroundColor: isActive ? 'var(--bg-card-hover)' : 'transparent',
                        color: isActive ? 'var(--brand-accent-cyan)' : 'var(--text-primary)'
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <span>{roleTitle}</span>
                      {isActive && <Check size={13} color="var(--brand-accent-cyan)" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div style={{ position: 'relative' }}>
            <button
              className="icon-btn"
              title="Interface Language"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              style={{ fontSize: '11px', fontWeight: 600, width: 'auto', padding: '4px 7px', gap: '3px' }}
            >
              <span>🌐</span>
              <span>{language.toUpperCase()}</span>
            </button>
            {langDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '6px',
                  padding: '4px',
                  zIndex: 99999,
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  minWidth: '140px'
                }}
              >
                {(supportedLanguages || [
                  { code: 'en', label: 'English (EN)' },
                  { code: 'hi', label: 'हिन्दी (HI)' },
                  { code: 'pa', label: 'ਪੰਜਾਬੀ (PA)' },
                  { code: 'mr', label: 'मराठी (MR)' }
                ]).map(item => (
                  <div
                    key={item.code}
                    style={{
                      padding: '5px 8px',
                      fontSize: '11.5px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      fontWeight: language === item.code ? 700 : 400,
                      backgroundColor: language === item.code ? 'var(--bg-card-hover)' : 'transparent',
                      color: language === item.code ? 'var(--brand-accent-cyan)' : 'var(--text-primary)'
                    }}
                    onClick={() => { setLanguage(item.code); setLangDropdownOpen(false); }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            className="icon-btn"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Presentation Mode Flagship Launcher Button */}
          <button
            className="btn-primary"
            style={{
              padding: '5px 12px',
              fontSize: '11.5px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              boxShadow: '0 0 10px rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={() => setActiveModule('presentation')}
            title="Launch 20-Step Guided Presentation Tour"
          >
            <Tv size={13} />
            <span>Presentation Mode</span>
          </button>
        </div>
      </header>

      {/* Global Modals */}
      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
      <PlatformModal isOpen={platformModalOpen} onClose={() => setPlatformModalOpen(false)} />
    </>
  );
}
