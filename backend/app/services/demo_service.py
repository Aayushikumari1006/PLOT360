"""
PLOT360 Backend — Demo / Presentation Service
Sections 66 & 94: Autonomous demo session management, 10 suggested targets, and 15 sequence stages.
"""
from typing import Dict, Any, List, Optional
import uuid
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.demo import DemoSession
from app.models.parcel import Parcel, Location
from app.schemas.demo import DemoStepOut, DemoTargetOut

# Import canonical demo data definitions
from app.services.demo_catalog_data import (
    DEMO_LOCATIONS_DATA,
    DEMO_PARCELS_DATA,
    SCENARIO_DISPLAY_MAP,
    get_demo_locations,
    get_demo_parcels,
    get_demo_parcel_by_ulpin,
    search_demo_catalog
)

# Suggested Demo Targets across India (Preserves flagship P-1027 at #1)
SUGGESTED_TARGETS = [
    DemoTargetOut(
        location_id="chandigarh",
        location_name="Chandigarh (Union Territory)",
        ulpin="IN-PB-CHD-0001027",
        parcel_id="P-1027",
        narrative="Primary Demonstration Parcel: Commercial/Mixed sector in Chandigarh showcasing full Land Stack integrity, multi-source conflict reconciliation, and AI temporal change alerts.",
        key_features=["Full 12-subdomain coverage", "Area discrepancy conflict", "Sentinel-2 2020/2025 change alert", "Multi-step citizen workflow"]
    ),
    DemoTargetOut(
        location_id="chandigarh",
        location_name="Chandigarh (Union Territory)",
        ulpin="IN-PB-CHD-0001028",
        parcel_id="P-1028",
        narrative="Residential parcel in Sector 17 with active mortgage lien and bank NOC requirement.",
        key_features=["Mortgage encumbrance", "Clear RoR", "Clean planning compliance"]
    ),
    DemoTargetOut(
        location_id="delhi",
        location_name="Delhi (NCT)",
        ulpin="IN-DL-DEL-0001101",
        parcel_id="P-1101",
        narrative="Connaught Place prime commercial zone under municipal property tax compliance review.",
        key_features=["Tax assessment review", "Commercial C-2 zoning", "High-frequency transaction ledger"]
    ),
    DemoTargetOut(
        location_id="bengaluru",
        location_name="Bengaluru (Karnataka)",
        ulpin="IN-KA-BLR-0001201",
        parcel_id="P-1201",
        narrative="Whitefield technology corridor corporate parcel with complete Bhoomi RTC/Pahani integration.",
        key_features=["Karnataka RTC integration", "Hi-Tech IT-1 zoning", "Clean corporate title"]
    ),
    DemoTargetOut(
        location_id="mumbai",
        location_name="Mumbai (Maharashtra)",
        ulpin="IN-MH-MUM-0001301",
        parcel_id="P-1301",
        narrative="Bandra West high-density mixed redevelopment with municipal building sanction order.",
        key_features=["Building sanction G+14", "Mixed-use MU-1 zoning", "MCGM revenue linkage"]
    ),
    DemoTargetOut(
        location_id="jaipur",
        location_name="Jaipur (Rajasthan)",
        ulpin="IN-RJ-JPR-0002001",
        parcel_id="P-2001",
        narrative="Mansarovar commercial corridor parcel featuring statutory heritage height buffer restrictions.",
        key_features=["Heritage zone restriction", "Bigha-to-sqm unit conversion", "JDA master plan overlay"]
    ),
    DemoTargetOut(
        location_id="ahmedabad",
        location_name="Ahmedabad (Gujarat)",
        ulpin="IN-GJ-AHM-0001401",
        parcel_id="P-1401",
        narrative="SG Highway commercial growth belt parcel with verified AnyRoR 7/12 land records.",
        key_features=["Gujarat AnyRoR 7/12 format", "Town Planning Scheme", "Clean title verification"]
    ),
    DemoTargetOut(
        location_id="lucknow",
        location_name="Lucknow (Uttar Pradesh)",
        ulpin="IN-UP-LKO-0001501",
        parcel_id="P-1501",
        narrative="Gomti Nagar commercial sector parcel with approved municipal building sanction G+4.",
        key_features=["Building permission workflow", "LDA Town Planning check", "Municipal tax linkage"]
    ),
    DemoTargetOut(
        location_id="hyderabad",
        location_name="Hyderabad (Telangana)",
        ulpin="IN-TG-HYD-0001601",
        parcel_id="P-1601",
        narrative="HITEC City financial corridor parcel linked to Dharani land registry portal.",
        key_features=["Dharani portal integration", "Hi-Tech IT-1 zone", "Pattadar passbook record"]
    ),
    DemoTargetOut(
        location_id="kochi",
        location_name="Kochi (Kerala)",
        ulpin="IN-KL-KOC-0005001",
        parcel_id="P-5001",
        narrative="Coastal waterfront boundary demonstrating strict CRZ clearance checks.",
        key_features=["Coastal Regulation Zone (CRZ)", "Wetland protection layer", "Ecological clearance"]
    )
]

# 15 Standard Demo Sequence Steps
DEMO_STEPS: List[DemoStepOut] = [
    DemoStepOut(
        step_number=1,
        step_name="Problem",
        title="1. The Land Governance Fragmentation Problem",
        domain="Overview",
        description="Traditional land administration in India suffers from disconnected departmental silos where Revenue (RoR), Registration, Municipal Tax, and Town Planning maintain divergent records for the same physical piece of land.",
        guidance="Observe how disparate systems lead to title disputes, unauthorized developments, and delays for citizens.",
        data_endpoint="/api/v1/health/detailed",
        key_takeaway="Fragmented records create disputes and administrative friction."
    ),
    DemoStepOut(
        step_number=2,
        step_name="GIS",
        title="2. Spatial Cadastral Base & Geospatial Foundations",
        domain="GIS",
        description="PLOT360 establishes an authoritative geospatial foundation by georeferencing cadastral parcel polygons alongside administrative boundaries, infrastructure networks, and environmental restrictions.",
        guidance="Explore parcel geometries on the interactive map with precise boundary coordinates and centroid spatial referencing.",
        data_endpoint="/api/v1/gis/layers",
        key_takeaway="True land governance begins with mathematically verified spatial parcel boundaries."
    ),
    DemoStepOut(
        step_number=3,
        step_name="Parcel",
        title="3. Unified Parcel Master & Area Preservation",
        domain="Parcels",
        description="Every land unit is captured as an immutable Master Parcel record preserving original government units (Acres, Bighas, Kanals) alongside standardized SI square-meter values.",
        guidance="Review parcel attributes including rural/urban classification, local identifiers, and standardized conversion methodology.",
        data_endpoint="/api/v1/parcels/{ulpin}",
        key_takeaway="Original revenue measurements are preserved without destructive rounding or overwriting."
    ),
    DemoStepOut(
        step_number=4,
        step_name="ULPIN",
        title="4. Canonical ULPIN Linkage Engine",
        domain="Identity",
        description="India's Land Stack uses the 14-digit Unique Land Parcel Identification Number (ULPIN) as the single authoritative digital anchor linking all departmental records.",
        guidance="Verify how all rights, registrations, permissions, and tax accounts reference the common canonical ULPIN.",
        data_endpoint="/api/v1/parcels/{ulpin}/summary",
        key_takeaway="ULPIN acts as the 'Aadhaar for Land', creating a unified digital identity for each parcel."
    ),
    DemoStepOut(
        step_number=5,
        step_name="RoR",
        title="5. Record of Rights (Jamabandi / 7/12 Extract)",
        domain="Revenue",
        description="Revenue records capture ownership titles, khata numbers, rights-holders, shares, and tenancy conditions straight from state land records systems.",
        guidance="Inspect ownership shares, relations, and revenue department verification status.",
        data_endpoint="/api/v1/parcels/{ulpin}/ror",
        key_takeaway="RoR details provide legal title lineage and rights-holder identification."
    ),
    DemoStepOut(
        step_number=6,
        step_name="Registration",
        title="6. Registration Deeds & Encumbrance Lineage",
        domain="Registration",
        description="Deed transactions, mortgages, bank liens, and registered encumbrances are retrieved directly from the Sub-Registrar Office ledger.",
        guidance="Check encumbrance certificate status and verify whether the parcel is clear of undisclosed liabilities.",
        data_endpoint="/api/v1/parcels/{ulpin}/registration",
        key_takeaway="Real-time deed registry linkage protects buyers and financial institutions from encumbered property."
    ),
    DemoStepOut(
        step_number=7,
        step_name="Planning",
        title="7. Town Planning & Master Plan Zoning Overlays",
        domain="Planning",
        description="Parcels are spatially evaluated against metropolitan master plans, land-use zoning (Residential, Commercial, Mixed), and statutory setback controls.",
        guidance="Examine permissible uses and zoning classifications defined by the planning authority.",
        data_endpoint="/api/v1/parcels/{ulpin}/planning",
        key_takeaway="Master plan zoning determines permissible development before construction begins."
    ),
    DemoStepOut(
        step_number=8,
        step_name="Building",
        title="8. Building Permissions & Sanctions Verification",
        domain="Planning",
        description="Approved building plans, sanctioned floor areas (FAR), and building permit histories are cross-referenced with cadastral limits.",
        guidance="Verify whether active construction has a valid sanction order and approved floor count.",
        data_endpoint="/api/v1/parcels/{ulpin}/building",
        key_takeaway="Cross-referencing building permits detects unauthorized footprint expansions immediately."
    ),
    DemoStepOut(
        step_number=9,
        step_name="Tax",
        title="9. Municipal Property Tax & Valuation References",
        domain="Fiscal",
        description="Municipal tax assessments, annual demands, payment receipts, and indicative guidance values are unified into the fiscal layer.",
        guidance="Review assessment IDs, payment compliance, outstanding dues, and indicative valuation references.",
        data_endpoint="/api/v1/parcels/{ulpin}/tax",
        key_takeaway="Municipal revenue collection improves when tax parcels are spatially linked to cadastral polygons."
    ),
    DemoStepOut(
        step_number=10,
        step_name="Conflict",
        title="10. Multi-Departmental Discrepancy & Conflict Engine",
        domain="Data Quality",
        description="PLOT360 continuously cross-examines records from RoR, Registration, and Property Tax to detect area mismatches, name discrepancies, and status inconsistencies.",
        guidance="Inspect the identified discrepancy (e.g. RoR area 1,248.5 m² vs Registration 1,210.0 m²) and see how it is flagged for officer resolution.",
        data_endpoint="/api/v1/conflicts",
        key_takeaway="Automated discrepancy detection prevents title fraud before transactions execute."
    ),
    DemoStepOut(
        step_number=11,
        step_name="Satellite/AI",
        title="11. Temporal Sentinel-2 Satellite Change Evidence",
        domain="AI",
        description="Comparing 2020 baseline and 2025 monitoring observations from Sentinel-2 Surface Reflectance rasters, the Siamese Temporal U-Net detects physical footprint deviations.",
        guidance="Review the explainable AI evidence modal: T1/T2 observation checksums, 10m grid provenance, and the required advisory wording: 'POTENTIAL CHANGE DETECTED — VERIFICATION REQUIRED'.",
        data_endpoint="/api/v1/ai/change-events/P-1027/evidence",
        key_takeaway="Earth observation provides objective temporal evidence while preserving cadastral boundaries."
    ),
    DemoStepOut(
        step_number=12,
        step_name="Citizen",
        title="12. Citizen Services & Persistent Service Requests",
        domain="Citizen",
        description="Citizens can search parcels, verify public records, and submit trackable service requests (demarcation, mutation, NOC) with collision-safe SR-YYYY-XXXXXX identifiers.",
        guidance="Follow a citizen service request from online submission through document attachment to status tracking.",
        data_endpoint="/api/v1/citizen/service-requests",
        key_takeaway="Transparent digital service delivery minimizes citizen visits to government offices."
    ),
    DemoStepOut(
        step_number=13,
        step_name="Department",
        title="13. Departmental Workflow Automation & Officer Roles",
        domain="Workflows",
        description="Service requests transition through state machines (SUBMITTED -> DOCUMENTS_RECEIVED -> VERIFICATION -> DEPARTMENT_REVIEW -> FINAL_PROCESSING -> DECISION) guarded by server-side RBAC.",
        guidance="Notice how revenue officers, planning officers, and sub-registrars execute authorized transitions with mandatory audit logging.",
        data_endpoint="/api/v1/workflows/1",
        key_takeaway="Permission-guarded workflows ensure regulatory compliance and administrative accountability."
    ),
    DemoStepOut(
        step_number=14,
        step_name="Integration",
        title="14. Integration Hub & Multi-Agency Connectors",
        domain="Integrations",
        description="Departmental connectors interface with external systems (Revenue, Sub-Registrar, Town Planning, Municipal Corporation, DISCOM Utilities) using standardized job lifecycles.",
        guidance="Trigger a simulated departmental synchronization job and observe records ingestion, provenance tracking, and audit updates.",
        data_endpoint="/api/v1/integrations",
        key_takeaway="Interoperable APIs connect disparate state departments into a cohesive Land Stack ecosystem."
    ),
    DemoStepOut(
        step_number=15,
        step_name="Scalability",
        title="15. National Scalability & Multi-State Configurability",
        domain="Architecture",
        description="PLOT360 avoids hardcoding one state's vocabulary. State configuration tables dynamically map local terms (Jamabandi, Patta, 7/12, Khasra) and regional measurement units across India.",
        guidance="Observe how Chandigarh maintains its Union Territory context while Rajasthan, UP, Maharashtra, and Kerala adapt seamlessly.",
        data_endpoint="/api/v1/admin/state-config",
        key_takeaway="A single platform scales nationally across all 28 States and 8 Union Territories."
    )
]


def create_or_get_demo_session(target_ulpin: str, location_id: str, db: Session) -> DemoSession:
    """Creates a new demo session or resumes active session for target."""
    # Find parcel to confirm
    parcel = db.query(Parcel).filter(
        (Parcel.ulpin == target_ulpin) | (Parcel.parcel_id == target_ulpin)
    ).first()

    clean_ulpin = parcel.ulpin if parcel else target_ulpin
    clean_parcel_id = parcel.parcel_id if parcel else "P-1027"

    loc = db.query(Location).filter(Location.id == location_id).first()
    loc_name = loc.name if loc else location_id.title()

    session_id = f"DEMO-{uuid.uuid4().hex[:8].upper()}"
    session = DemoSession(
        session_id=session_id,
        target_ulpin=clean_ulpin,
        target_parcel_id=clean_parcel_id,
        location_id=location_id,
        location_name=loc_name,
        current_step=1,
        total_steps=15,
        status="ACTIVE",
        is_completed=False,
        step_history=[{
            "step": 1,
            "name": DEMO_STEPS[0].step_name,
            "timestamp": datetime.now().isoformat()
        }],
        metadata_context={"initiated_at": datetime.now().isoformat()}
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def get_demo_session_by_id(session_id: str, db: Session) -> Optional[DemoSession]:
    """Retrieve demo session by ID."""
    return db.query(DemoSession).filter(DemoSession.session_id == session_id).first()


def advance_demo_session(session_id: str, db: Session) -> DemoSession:
    """Advance to the next step in the 15-step sequence."""
    session = get_demo_session_by_id(session_id, db)
    if not session:
        raise ValueError(f"Demo session not found: '{session_id}'")

    if session.current_step < session.total_steps:
        session.current_step += 1
        history = list(session.step_history or [])
        step_obj = DEMO_STEPS[session.current_step - 1]
        history.append({
            "step": session.current_step,
            "name": step_obj.step_name,
            "timestamp": datetime.now().isoformat()
        })
        session.step_history = history
        if session.current_step == session.total_steps:
            session.is_completed = True
            session.status = "COMPLETED"
    else:
        session.is_completed = True
        session.status = "COMPLETED"

    db.commit()
    db.refresh(session)
    return session


def reset_demo_session(session_id: str, db: Session) -> DemoSession:
    """Reset session back to step 1."""
    session = get_demo_session_by_id(session_id, db)
    if not session:
        raise ValueError(f"Demo session not found: '{session_id}'")

    session.current_step = 1
    session.status = "ACTIVE"
    session.is_completed = False
    session.step_history = [{
        "step": 1,
        "name": DEMO_STEPS[0].step_name,
        "timestamp": datetime.now().isoformat()
    }]
    db.commit()
    db.refresh(session)
    return session
