import React from 'react';
import {
  LayoutGrid,
  Box,
  Landmark,
  Compass,
  Users,
  BarChart3,
  Share2,
  ShieldCheck,
  Activity,
  Tv,
  HelpCircle,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { activeModule, setActiveModule, t, setHelpModalOpen, canAccessModule } = useApp();

  const navItems = [
    { id: 'explorer', label: 'Land Explorer', icon: LayoutGrid },
    { id: 'intelligence', label: 'Parcel Intelligence', icon: Box },
    { id: 'workflows', label: 'Services & Workflows', icon: Users },
    { id: 'analytics', label: 'Analytics & Admin', icon: BarChart3 }
  ];

  const isItemActive = (itemId) => {
    if (activeModule === itemId) return true;
    if (itemId === 'intelligence' && ['records', 'planning'].includes(activeModule)) return true;
    if (itemId === 'workflows' && ['citizen', 'services'].includes(activeModule)) return true;
    if (itemId === 'analytics' && ['admin', 'integrations', 'health'].includes(activeModule)) return true;
    return false;
  };

  return (
    <aside className="sidebar-container">
      {/* Brand Header */}
      <div className="sidebar-header">
        <img src="/logo.png" alt="PLOT360" className="sidebar-logo" />
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-title">
            PLOT<span>360</span>
          </div>
          <div className="sidebar-brand-tagline">From Boundaries to Insights</div>
        </div>
      </div>

      {/* Primary Navigation (Maximum 4 Primary Toggles per Specification Section 4) */}
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = isItemActive(item.id);
          const isAllowed = canAccessModule ? canAccessModule(item.id) : true;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''} ${!isAllowed ? 'restricted-item' : ''}`}
              onClick={() => setActiveModule(item.id)}
              style={!isAllowed ? { opacity: 0.65 } : {}}
              title={
                !isAllowed
                  ? `${t ? t('nav.' + item.id, item.label) : item.label} (Restricted for current role)`
                  : t ? t('nav.' + item.id, item.label) : item.label
              }
            >
              <Icon className="nav-item-icon" />
              <span className="sidebar-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span>{t ? t('nav.' + item.id, item.label) : item.label}</span>
                {!isAllowed && <span style={{ fontSize: '9px', padding: '1px 4px', borderRadius: '3px', background: 'var(--border-subtle)', color: 'var(--text-muted)' }}>Locked</span>}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Secondary Navigation Footer */}
      <div className="sidebar-footer">
        <button
          className={`nav-item ${activeModule === 'presentation' ? 'active' : ''}`}
          onClick={() => setActiveModule('presentation')}
          title={t ? t('nav.presentation', 'Presentation Mode') : 'Presentation Mode'}
        >
          <Tv className="nav-item-icon" />
          <span className="sidebar-label">{t ? t('nav.presentation', 'Presentation Mode') : 'Presentation Mode'}</span>
        </button>
        <button
          className="nav-item"
          onClick={() => setHelpModalOpen(true)}
          title={t ? t('nav.help', 'Help') : 'Help'}
        >
          <HelpCircle className="nav-item-icon" />
          <span className="sidebar-label">{t ? t('nav.help', 'Help') : 'Help'}</span>
        </button>
        <button
          className="nav-item"
          onClick={() => setActiveModule('admin')}
          title={t ? t('nav.profile', 'User Profile') : 'User Profile'}
        >
          <User className="nav-item-icon" />
          <span className="sidebar-label">{t ? t('nav.profile', 'User Profile') : 'User Profile'}</span>
        </button>
      </div>
    </aside>
  );
}
