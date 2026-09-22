import React from 'react';
import {
  Zap,
  FileText,
  Map,
  Building,
  Link2,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function QuickActionsBar() {
  const { setUnifiedReportOpen, setActiveModule } = useApp();

  const handleAction = (id) => {
    switch (id) {
      case 'records':
        setActiveModule('records');
        break;
      case 'zoning':
        setActiveModule('planning');
        break;
      case 'permission':
        setActiveModule('citizen');
        break;
      case 'encumbrance':
        setUnifiedReportOpen(true);
        break;
      case 'report':
        setUnifiedReportOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="quick-actions-container">
      <div className="quick-actions-title-wrap">
        <Zap size={15} style={{ color: 'var(--brand-orange)' }} />
        <span>Quick Actions</span>
      </div>

      <div className="quick-actions-btns">
        <button
          className="quick-action-btn"
          onClick={() => handleAction('records')}
          title="View Land Records"
        >
          <FileText size={13} style={{ color: 'var(--brand-accent-blue)' }} />
          <span>View Land Records</span>
        </button>

        <button
          className="quick-action-btn"
          onClick={() => handleAction('zoning')}
          title="Check Zoning Regulations"
        >
          <Map size={13} style={{ color: 'var(--brand-accent-cyan)' }} />
          <span>Check Zoning</span>
        </button>

        <button
          className="quick-action-btn"
          onClick={() => handleAction('permission')}
          title="Apply for Building Permission"
        >
          <Building size={13} style={{ color: 'var(--status-success)' }} />
          <span>Apply for Permission</span>
        </button>

        <button
          className="quick-action-btn"
          onClick={() => handleAction('encumbrance')}
          title="Check Encumbrance Status"
        >
          <Link2 size={13} style={{ color: 'var(--status-warning)' }} />
          <span>Check Encumbrance</span>
        </button>

        <button
          className="quick-action-btn"
          onClick={() => handleAction('report')}
          title="Generate Comprehensive Report"
        >
          <Download size={13} style={{ color: 'var(--text-secondary)' }} />
          <span>Generate Report</span>
        </button>
      </div>
    </div>
  );
}
