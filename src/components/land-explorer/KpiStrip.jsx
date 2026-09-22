import React from 'react';
import {
  FileText,
  Database,
  AlertTriangle,
  Sparkles,
  Link
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function KpiStrip() {
  const { kpiData, setActiveModule } = useApp();

  const getIcon = (id) => {
    switch (id) {
      case 'parcels': return FileText;
      case 'datasets': return Database;
      case 'conflicts': return AlertTriangle;
      case 'ai-alerts': return Sparkles;
      case 'dept-connections': return Link;
      default: return FileText;
    }
  };

  const handleCardClick = (id) => {
    if (id === 'conflicts' || id === 'ai-alerts') {
      setActiveModule('analytics');
    } else if (id === 'datasets' || id === 'dept-connections') {
      setActiveModule('integrations');
    } else {
      setActiveModule('explorer');
    }
  };

  return (
    <div className="kpi-strip-container">
      {kpiData.map((item) => {
        const Icon = getIcon(item.id);
        const isConflict = item.id === 'conflicts';
        const isAi = item.id === 'ai-alerts';

        return (
          <div
            key={item.id}
            className={`kpi-card ${isConflict ? 'conflict' : ''} ${isAi ? 'ai-alert' : ''}`}
            onClick={() => handleCardClick(item.id)}
            title={`Click to view ${item.label}`}
          >
            <div className="kpi-content">
              <div className="kpi-val-row">
                <span className="kpi-val">{item.value}</span>
                <span className="kpi-label">{item.label}</span>
              </div>
              <div className={`kpi-sub ${item.status}`}>
                <span>{item.subLabel}</span>
                {item.change && <span>({item.change})</span>}
              </div>
            </div>

            <div className="kpi-icon-wrap">
              <Icon size={18} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
