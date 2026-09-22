import json
import sys
import os

sys.path.insert(0, r'd:\Aayushi\Plot360\backend')
from app.services.demo_catalog_data import DEMO_LOCATIONS_DATA, DEMO_PARCELS_DATA

# Format into JS
js_content = '''// PLOT360 Comprehensive Centralized Mock Data Architecture
// All data clearly marked as DEMO / SAMPLE / SIMULATED
// Canonical synchronization from backend/app/services/demo_catalog_data.py

export const DEMO_PARCELS = ''' + json.dumps(DEMO_PARCELS_DATA, indent=2) + ''';

export const DEMO_LOCATIONS = ''' + json.dumps(DEMO_LOCATIONS_DATA, indent=2) + ''';

export const KPI_DATA = [
  {
    id: "parcels",
    value: "24,832",
    label: "Parcels",
    subLabel: "Verified",
    change: "+2%",
    status: "green",
    updated: "Updated 2h ago"
  },
  {
    id: "datasets",
    value: "9",
    label: "Integrated Datasets",
    subLabel: "Linked",
    change: "+1%",
    status: "green",
    updated: "Updated 4h ago"
  },
  {
    id: "conflicts",
    value: "83",
    label: "Data Conflicts",
    subLabel: "Flagged",
    change: "-12%",
    status: "red",
    updated: "Updated 6h ago",
    badge: "Flagged"
  },
  {
    id: "ai-alerts",
    value: "42",
    label: "AI / Change Alerts",
    subLabel: "Change Detection",
    change: "+8%",
    status: "blue",
    updated: "Updated 1h ago",
    badge: "Detection"
  },
  {
    id: "dept-connections",
    value: "7",
    label: "Department Connections",
    subLabel: "Active",
    change: "→ 0%",
    status: "muted",
    updated: "Updated 3h ago"
  }
];

export const ROLES = [
  { id: "citizen", name: "Citizen", desc: "Public land records & citizen service requests" },
  { id: "revenue_officer", name: "Revenue Officer", desc: "RoR, land mutations and cadastral records" },
  { id: "registration_officer", name: "Registration Officer", desc: "Deed registration, valuations and encumbrances" },
  { id: "planning_officer", name: "Planning Officer", desc: "Zoning, master plans and development control" },
  { id: "municipal_officer", name: "Municipal Officer", desc: "Building sanctions, civic infrastructure & utilities" },
  { id: "tax_officer", name: "Tax Officer", desc: "Property tax assessments and demand notices" },
  { id: "administrator", name: "Administrator", desc: "Full administrative, system config & integration access" },
  { id: "auditor", name: "Auditor", desc: "Compliance verification and immutable audit logs" }
];

export const QUICK_ACTIONS = [
  { id: "records", label: "View Land Records", icon: "FileText" },
  { id: "zoning", label: "Check Zoning", icon: "Map" },
  { id: "permission", label: "Apply for Permission", icon: "Building" },
  { id: "encumbrance", label: "Check Encumbrance", icon: "Link2" },
  { id: "report", label: "Generate Report", icon: "Download" }
];
'''

with open(r'd:\Aayushi\Plot360\src\data\mockData.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f'Successfully synchronized src/data/mockData.js with {len(DEMO_LOCATIONS_DATA)} locations and {len(DEMO_PARCELS_DATA)} parcels.')
