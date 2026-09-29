/**
 * PLOT360 Frontend RBAC (Role-Based Access Control)
 * Strictly mirrors backend/app/auth/rbac.py authorization rules.
 */

export const ROLES = {
  CITIZEN: 'citizen',
  REVENUE_OFFICER: 'revenue_officer',
  REGISTRATION_OFFICER: 'registration_officer',
  PLANNING_OFFICER: 'planning_officer',
  MUNICIPAL_OFFICER: 'municipal_officer',
  TAX_OFFICER: 'tax_officer',
  ADMINISTRATOR: 'administrator',
  AUDITOR: 'auditor'
};

export const ROLE_LABELS = {
  [ROLES.CITIZEN]: 'Citizen / Public User',
  [ROLES.REVENUE_OFFICER]: 'Revenue Officer (Tehsildar)',
  [ROLES.REGISTRATION_OFFICER]: 'Sub-Registrar Officer',
  [ROLES.PLANNING_OFFICER]: 'Town Planning Officer',
  [ROLES.MUNICIPAL_OFFICER]: 'Municipal Officer',
  [ROLES.TAX_OFFICER]: 'Tax Assessment Officer',
  [ROLES.ADMINISTRATOR]: 'System Administrator',
  [ROLES.AUDITOR]: 'CAG / State Auditor'
};

// Module access matrix (Public Demonstration / Unified Access)
const MODULE_PERMISSIONS = {
  explorer: Object.values(ROLES),
  intelligence: Object.values(ROLES),
  workflows: Object.values(ROLES),
  records: Object.values(ROLES),
  planning: Object.values(ROLES),
  citizen: Object.values(ROLES),
  analytics: Object.values(ROLES),
  integrations: Object.values(ROLES),
  admin: Object.values(ROLES),
  health: Object.values(ROLES),
  presentation: Object.values(ROLES)
};

/**
 * Checks if a given role is allowed to access a module
 */
export function canAccessModule(role, moduleId) {
  if (!role) return false;
  if (role === ROLES.ADMINISTRATOR) return true;
  const permitted = MODULE_PERMISSIONS[moduleId];
  if (!permitted) return true;
  return permitted.includes(role);
}

/**
 * Field-level authorization checks
 */
export function canViewFinancialLiabilities(role) {
  return [
    ROLES.REGISTRATION_OFFICER,
    ROLES.REVENUE_OFFICER,
    ROLES.TAX_OFFICER,
    ROLES.ADMINISTRATOR,
    ROLES.AUDITOR
  ].includes(role);
}

export function canViewBuildingDetails(role) {
  return [
    ROLES.PLANNING_OFFICER,
    ROLES.MUNICIPAL_OFFICER,
    ROLES.ADMINISTRATOR,
    ROLES.AUDITOR
  ].includes(role);
}

export function canViewInternalAiNotes(role) {
  return [
    ROLES.REVENUE_OFFICER,
    ROLES.PLANNING_OFFICER,
    ROLES.ADMINISTRATOR,
    ROLES.AUDITOR
  ].includes(role);
}

export function canPerformOfficerWorkflows(role) {
  return [
    ROLES.REVENUE_OFFICER,
    ROLES.REGISTRATION_OFFICER,
    ROLES.PLANNING_OFFICER,
    ROLES.MUNICIPAL_OFFICER,
    ROLES.TAX_OFFICER,
    ROLES.ADMINISTRATOR
  ].includes(role);
}

export function canResolveConflicts(role) {
  return [
    ROLES.REVENUE_OFFICER,
    ROLES.ADMINISTRATOR
  ].includes(role);
}
