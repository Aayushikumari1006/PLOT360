"""
PLOT360 Backend — Standard Roles and Granular Permissions Definitions
Section 14: Granular role-to-permission mappings for the platform.
"""

ROLES_LIST = [
    "citizen",
    "revenue_officer",
    "registration_officer",
    "planning_officer",
    "municipal_officer",
    "tax_officer",
    "administrator",
    "auditor",
]

PERMISSIONS_DEFINITIONS = [
    # Parcel
    {"code": "parcel:read", "label": "Read Parcels", "category": "parcel"},
    {"code": "parcel:write", "label": "Modify Parcels", "category": "parcel"},
    # RoR & Ownership
    {"code": "ror:read", "label": "Read Record of Rights", "category": "governance"},
    {"code": "ror:write", "label": "Modify Record of Rights", "category": "governance"},
    {"code": "ownership:read", "label": "Read Ownership", "category": "governance"},
    {"code": "ownership:write", "label": "Modify Ownership", "category": "governance"},
    # Registration
    {"code": "registration:read", "label": "Read Registrations", "category": "governance"},
    {"code": "registration:write", "label": "Modify Registrations", "category": "governance"},
    # Planning & Building
    {"code": "planning:read", "label": "Read Planning & Zoning", "category": "planning"},
    {"code": "planning:write", "label": "Modify Planning & Zoning", "category": "planning"},
    {"code": "building:read", "label": "Read Building Sanctions", "category": "planning"},
    {"code": "building:write", "label": "Sanction Building Permissions", "category": "planning"},
    # Tax & Utilities
    {"code": "tax:read", "label": "Read Property Tax", "category": "tax"},
    {"code": "tax:write", "label": "Modify Property Tax", "category": "tax"},
    {"code": "utility:read", "label": "Read Utilities", "category": "utility"},
    {"code": "utility:write", "label": "Modify Utilities", "category": "utility"},
    # Citizen & Workflows
    {"code": "service_request:create", "label": "Submit Service Request", "category": "citizen"},
    {"code": "service_request:read", "label": "Read Service Requests", "category": "citizen"},
    {"code": "workflow:transition", "label": "Advance Workflow State", "category": "workflow"},
    # Conflict & Duplicates
    {"code": "conflict:read", "label": "Read Data Conflicts", "category": "quality"},
    {"code": "conflict:resolve", "label": "Resolve Data Conflicts", "category": "quality"},
    # AI & Field Verification
    {"code": "ai:read", "label": "Read AI Alerts & Insights", "category": "ai"},
    {"code": "ai:review", "label": "Submit Field Verification", "category": "ai"},
    {"code": "ai:train", "label": "Trigger AI Training", "category": "ai"},
    {"code": "ai:activate_model", "label": "Activate AI Models", "category": "ai"},
    # Documents
    {"code": "document:upload", "label": "Upload Documents", "category": "document"},
    {"code": "document:read", "label": "View Documents", "category": "document"},
    # Integration & Config
    {"code": "integration:read", "label": "View Integrations", "category": "integration"},
    {"code": "integration:sync", "label": "Trigger Department Sync", "category": "integration"},
    {"code": "config:read", "label": "View State Configs", "category": "admin"},
    {"code": "config:write", "label": "Modify State Configs", "category": "admin"},
    # Audit & Administration
    {"code": "audit:read", "label": "View Audit Logs", "category": "audit"},
    {"code": "admin:manage_users", "label": "Manage Users and Roles", "category": "admin"},
    {"code": "analytics:read", "label": "View Analytics Dashboards", "category": "analytics"},
]

ROLE_PERMISSIONS_MAP = {
    "citizen": [
        "parcel:read", "ror:read", "ownership:read", "registration:read",
        "planning:read", "tax:read", "utility:read", "service_request:create",
        "service_request:read", "document:upload", "document:read", "ai:read",
    ],
    "revenue_officer": [
        "parcel:read", "parcel:write", "ror:read", "ror:write", "ownership:read",
        "ownership:write", "registration:read", "service_request:read",
        "workflow:transition", "conflict:read", "conflict:resolve", "ai:read",
        "ai:review", "document:read", "document:upload", "analytics:read",
    ],
    "registration_officer": [
        "parcel:read", "registration:read", "registration:write", "ownership:read",
        "ror:read", "workflow:transition", "conflict:read", "conflict:resolve",
        "document:read", "document:upload", "analytics:read",
    ],
    "planning_officer": [
        "parcel:read", "planning:read", "planning:write", "building:read",
        "building:write", "workflow:transition", "conflict:read", "ai:read",
        "ai:review", "document:read", "analytics:read",
    ],
    "municipal_officer": [
        "parcel:read", "tax:read", "utility:read", "utility:write", "building:read",
        "workflow:transition", "conflict:read", "document:read", "analytics:read",
    ],
    "tax_officer": [
        "parcel:read", "tax:read", "tax:write", "conflict:read", "conflict:resolve",
        "document:read", "analytics:read",
    ],
    "administrator": [p["code"] for p in PERMISSIONS_DEFINITIONS],
    "auditor": [
        "parcel:read", "ror:read", "ownership:read", "registration:read",
        "planning:read", "tax:read", "utility:read", "audit:read",
        "conflict:read", "ai:read", "document:read", "integration:read",
        "analytics:read", "config:read",
    ],
}
