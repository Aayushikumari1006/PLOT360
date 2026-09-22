"""
PLOT360 Backend — Idempotent Demo Data Seeder
Sections 42, 103, 104: Seeds demo users, roles, permissions, locations,
parcels (P-1027, etc.), RoR, registrations, planning, encumbrances, tax,
utilities, restrictions, conflicts, AI alerts, service requests, notifications,
state configs, and API connections.
"""
import sys
import os
import json
from datetime import datetime, timezone

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import Base, engine, SessionLocal, create_tables
from app.auth.password import hash_password
from app.auth.permissions import PERMISSIONS_DEFINITIONS, ROLES_LIST, ROLE_PERMISSIONS_MAP
from app.models.user import User, Role, Permission, UserRole, RolePermission, AuditLog
from app.models.parcel import Parcel, Location, Jurisdiction
from app.models.ownership import Ownership, OwnershipHistory
from app.models.governance import RoRRecord, Registration, Encumbrance, Mortgage, Dispute
from app.models.planning import PlanningRecord, BuildingPermission, Restriction
from app.models.taxation import PropertyTax, ValuationReference
from app.models.utilities import UtilityRecord, Infrastructure
from app.models.workflow import ServiceRequest, Application, WorkflowTemplate, WorkflowInstance, WorkflowStep, WorkflowEvent
from app.models.notification import Notification
from app.models.ai_models import (
    AIModel, AIDataset, SatelliteObservation, ChangeEvent, AIAlert, AIReview,
    DataConflict, DuplicateCandidate, Job
)
from app.models.config_model import StateConfig, StateFieldMapping, DataSource, ApiConnection


def seed():
    print("Initializing database tables...")
    create_tables()
    db = SessionLocal()

    try:
        # ── 1. Seed Permissions & Roles ───────────────────────────────────────────
        print("Seeding permissions and roles...")
        perm_map = {}
        for p_def in PERMISSIONS_DEFINITIONS:
            existing = db.query(Permission).filter(Permission.code == p_def["code"]).first()
            if not existing:
                perm = Permission(
                    code=p_def["code"],
                    label=p_def["label"],
                    category=p_def["category"]
                )
                db.add(perm)
                db.flush()
                perm_map[p_def["code"]] = perm
            else:
                perm_map[p_def["code"]] = existing

        role_map = {}
        for r_name in ROLES_LIST:
            existing = db.query(Role).filter(Role.name == r_name).first()
            if not existing:
                role = Role(
                    name=r_name,
                    label=r_name.replace("_", " ").title(),
                    description=f"Standard role for {r_name}"
                )
                db.add(role)
                db.flush()
                role_map[r_name] = role
            else:
                role_map[r_name] = existing

            # Link permissions to role
            target_codes = ROLE_PERMISSIONS_MAP.get(r_name, [])
            for code in target_codes:
                p_obj = perm_map.get(code)
                if p_obj:
                    link = db.query(RolePermission).filter(
                        RolePermission.role_id == role_map[r_name].id,
                        RolePermission.permission_id == p_obj.id
                    ).first()
                    if not link:
                        db.add(RolePermission(role_id=role_map[r_name].id, permission_id=p_obj.id))

        db.commit()

        # ── 2. Seed Demo Users ────────────────────────────────────────────────────
        print("Seeding demo users...")
        demo_users = [
            {"email": "admin@plot360.gov.in", "username": "admin", "full_name": "Dr. Arun Varma", "role": "administrator", "dept": "Land Administration Directorate"},
            {"email": "revenue@plot360.gov.in", "username": "revenue_officer", "full_name": "S. Gurinder Singh", "role": "revenue_officer", "dept": "Department of Revenue & Land Records"},
            {"email": "planning@plot360.gov.in", "username": "planning_officer", "full_name": "Meera Nambiar", "role": "planning_officer", "dept": "Town & Country Planning Authority"},
            {"email": "citizen@plot360.gov.in", "username": "citizen", "full_name": "Ravinder Singh", "role": "citizen", "dept": "Citizen / Landholder"},
            {"email": "registration@plot360.gov.in", "username": "registration_officer", "full_name": "P. K. Sharma", "role": "registration_officer", "dept": "Sub-Registrar Office"},
            {"email": "municipal@plot360.gov.in", "username": "municipal_officer", "full_name": "Kavita Rao", "role": "municipal_officer", "dept": "Municipal Corporation"},
            {"email": "tax@plot360.gov.in", "username": "tax_officer", "full_name": "Sunil Mehta", "role": "tax_officer", "dept": "Municipal Property Tax Cell"},
            {"email": "auditor@plot360.gov.in", "username": "auditor", "full_name": "Justice R. Deshmukh (Retd.)", "role": "auditor", "dept": "State Land Audit Authority"},
        ]

        for u_data in demo_users:
            existing = db.query(User).filter(User.email == u_data["email"]).first()
            if not existing:
                u = User(
                    email=u_data["email"],
                    username=u_data["username"],
                    full_name=u_data["full_name"],
                    hashed_password=hash_password("Plot360Pass123!"),
                    department=u_data["dept"],
                    is_active=True,
                    is_demo_user=True,
                    information_classification="PUBLIC" if u_data["role"] == "citizen" else "AUTHORIZED_DEPARTMENT"
                )
                db.add(u)
                db.flush()

                # Assign user role
                r_obj = role_map.get(u_data["role"])
                if r_obj:
                    db.add(UserRole(user_id=u.id, role_id=r_obj.id))

        db.commit()

        # ── 3. Seed Demo Locations (15 Curated Geographic Contexts) ──────────────
        print("Seeding locations and jurisdictions...")
        from app.services.demo_catalog_data import DEMO_LOCATIONS_DATA, DEMO_PARCELS_DATA

        for loc in DEMO_LOCATIONS_DATA:
            existing = db.query(Location).filter(Location.id == loc["id"]).first()
            if not existing:
                db.add(Location(
                    id=loc["id"],
                    name=loc["name"],
                    state=loc["state"],
                    jurisdiction=loc["jurisdiction"],
                    lat=loc["lat"],
                    lng=loc["lng"],
                    default_zoom=16,
                    default_parcel_id=loc["defaultParcelId"]
                ))

        db.commit()

        # ── 4. Seed Canonical Demo Parcels (37 Curated Targets) ───────────────────
        print(f"Seeding {len(DEMO_PARCELS_DATA)} demo parcels (including flagship P-1027)...")
        parcels_data = DEMO_PARCELS_DATA

        for p_data in parcels_data:
            existing = db.query(Parcel).filter(Parcel.parcel_id == p_data["parcel_id"]).first()
            from app.utils.geo import coords_to_geojson_polygon
            poly_geojson = coords_to_geojson_polygon(p_data["coords"])
            poly_str = json.dumps(poly_geojson)

            if not existing:
                p = Parcel(
                    parcel_id=p_data["parcel_id"],
                    ulpin=p_data["ulpin"],
                    survey_no=p_data["survey_no"],
                    khata_no=p_data["khata_no"],
                    location=p_data["location"],
                    location_id=p_data["location_id"],
                    state=p_data["state"],
                    district=p_data["district"],
                    tehsil=p_data.get("tehsil"),
                    rural_urban=p_data["rural_urban"],
                    original_area=p_data["original_area"],
                    original_unit=p_data["original_unit"],
                    standardized_area=p_data["standardized_area"],
                    standardized_unit="m²",
                    area_display=p_data["area_display"],
                    original_area_display=p_data["original_area_display"],
                    land_use=p_data["land_use"],
                    zoning=p_data["zoning"],
                    jurisdiction=p_data["jurisdiction"],
                    status=p_data["status"],
                    centroid_lat=p_data["centroid_lat"],
                    centroid_lng=p_data["centroid_lng"],
                    geometry=poly_str,
                    last_updated="12 Aug 2025, 10:24 AM"
                )
                db.add(p)
                db.flush()

                # Ownership
                db.add(Ownership(
                    parcel_id=p.id,
                    ulpin=p.ulpin,
                    owner_name=p_data["owner"]["name"],
                    owner_relation=p_data["owner"].get("relation"),
                    share_percent=p_data["owner"].get("share", "100%"),
                    verified=True,
                    is_current=True,
                    last_updated="12 Aug 2025"
                ))

                # RoR Record
                db.add(RoRRecord(
                    parcel_id=p.id,
                    ulpin=p.ulpin,
                    record_number=p_data["khata_no"],
                    owner_name=p_data["owner"]["name"],
                    rights_type="Pattadar / Absolute Owner",
                    rights="Exclusive ownership rights with agricultural inheritance transition.",
                    land_type=p_data["land_use"],
                    area=p_data["area_display"],
                    jurisdiction=p_data["jurisdiction"],
                    status="Verified",
                    verification_status="VERIFIED",
                    last_updated="10 Aug 2025"
                ))

                # Registration Deed
                db.add(Registration(
                    parcel_id=p.id,
                    ulpin=p.ulpin,
                    registration_id=f"REG-{p.parcel_id}-2022",
                    transaction_type="Sale Deed",
                    registration_date="14 Sep 2022",
                    parties=f"Vendor: Harbhajan Singh | Purchaser: {p_data['owner']['name']}",
                    consideration_amount="₹ 65,00,000",
                    stamp_duty_paid="₹ 4,55,000",
                    status="REGISTERED"
                ))

                # Building Permission
                if "bp" in p_data:
                    db.add(BuildingPermission(
                        parcel_id=p.id,
                        ulpin=p.ulpin,
                        permission_id=p_data["bp"]["id"],
                        status=p_data["bp"]["status"],
                        floors=p_data["bp"].get("floors"),
                        approval_date=p_data["bp"].get("date"),
                        approved_area=p_data["area_display"]
                    ))

                # Encumbrance
                if "enc" in p_data:
                    db.add(Encumbrance(
                        parcel_id=p.id,
                        ulpin=p.ulpin,
                        status=p_data["enc"]["status"],
                        institution=p_data["enc"].get("inst"),
                        loan_amount=p_data["enc"].get("amt"),
                        noc_required=p_data["enc"].get("noc", False),
                        reference=p_data["enc"].get("ref")
                    ))

                # Property Tax
                if "tax" in p_data:
                    db.add(PropertyTax(
                        parcel_id=p.id,
                        ulpin=p.ulpin,
                        assessment_id=p_data["tax"]["id"],
                        status=p_data["tax"]["status"],
                        amount_paid=p_data["tax"].get("paid"),
                        last_payment=p_data["tax"].get("date")
                    ))

                # Utilities
                if "ut" in p_data:
                    db.add(UtilityRecord(
                        parcel_id=p.id,
                        ulpin=p.ulpin,
                        electricity=p_data["ut"].get("elec", "Connected"),
                        water=p_data["ut"].get("water", "Connected"),
                        sewer=p_data["ut"].get("sewer", "Connected"),
                        gas=p_data["ut"].get("gas", "Available Nearby")
                    ))

                # Planning
                db.add(PlanningRecord(
                    parcel_id=p.id,
                    ulpin=p.ulpin,
                    master_plan_year="Master Plan 2031",
                    land_use=p_data["land_use"],
                    zoning=p_data["zoning"],
                    zoning_code="R-2",
                    floor_area_ratio=1.5,
                    ground_coverage=40.0,
                    development_status="Developed"
                ))

                # AI Alert for P-1027
                if p_data["parcel_id"] == "P-1027":
                    ce = ChangeEvent(
                        parcel_id=p.id,
                        ulpin=p.ulpin,
                        change_type="POTENTIAL_NEW_CONSTRUCTION",
                        confidence=0.89,
                        change_area_m2=385.4,
                        model_version="Siamese-UNet-v1",
                        status="UNDER_REVIEW"
                    )
                    db.add(ce)
                    db.flush()

                    db.add(AIAlert(
                        parcel_id=p.id,
                        ulpin=p.ulpin,
                        change_event_id=ce.id,
                        alert_id="AI-2024-031",
                        title="Potential Change Detected — Verification Required",
                        description="Change identified: Development activity started on agricultural land.",
                        category="Potential New Construction",
                        confidence="High (89%)",
                        flagged_date="Mar 2024",
                        review_status="UNDER_REVIEW",
                        recommended_step="Field officer site verification",
                        notes="Site inspection order generated.",
                        date1_label="Oct 2023",
                        date2_label="Mar 2024"
                    ))

                    # Initial Conflict for P-1027
                    db.add(DataConflict(
                        conflict_id="CONF-CHD-001",
                        parcel_id=p.id,
                        ulpin=p.ulpin,
                        conflict_type="AREA_MISMATCH",
                        field="area",
                        source_a="Cadastral GIS Vector",
                        value_a="1,248.50 m² (0.31 Acre)",
                        source_b="Municipal Property Tax Cell",
                        value_b="1,310.00 m²",
                        difference="+61.50 m² (+4.9%)",
                        evidence="Digital Cadastral Survey polygon area differs from municipal tax valuation assessment area.",
                        status="UNDER_REVIEW",
                        assigned_officer="Revenue Officer"
                    ))

        # Ensure OwnershipHistory is seeded for parcels
        for p_data in parcels_data:
            p_obj = db.query(Parcel).filter(Parcel.parcel_id == p_data["parcel_id"]).first()
            if p_obj:
                has_hist = db.query(OwnershipHistory).filter(OwnershipHistory.parcel_id == p_obj.id).first()
                if not has_hist:
                    db.add(OwnershipHistory(
                        parcel_id=p_obj.id,
                        ulpin=p_obj.ulpin,
                        previous_state=json.dumps({"owner": "Harbhajan Singh", "share": "100%", "relation": "s/o Milkha Singh"}),
                        new_state=json.dumps({"owner": p_data["owner"]["name"], "share": p_data["owner"].get("share", "100%"), "relation": p_data["owner"].get("relation")}),
                        transaction_type="Sale Deed",
                        deed_number=f"REG-{p_obj.parcel_id}-2022",
                        source="Sub-Registrar Office, Chandigarh",
                        record_reference="CHD-SRO-VOL-442-PAGE-18",
                        effective_date="14 Sep 2022",
                        notes="Conveyance executed pursuant to registered deed. Mutation duly approved in Jamabandi."
                    ))

                has_mort = db.query(Mortgage).filter(Mortgage.parcel_id == p_obj.id).first()
                if not has_mort:
                    db.add(Mortgage(
                        parcel_id=p_obj.id,
                        ulpin=p_obj.ulpin,
                        mortgagee=p_data.get("enc", {}).get("inst") or "State Bank of India (Sector 17 SME Branch)",
                        amount=p_data.get("enc", {}).get("amt") or "₹ 45,00,000",
                        status="ACTIVE" if p_data.get("enc", {}).get("status") == "ACTIVE" else "DISCHARGED",
                        deed_reference=p_data.get("enc", {}).get("ref") or f"MORT-{p_obj.parcel_id}-2022",
                        registered_on="15 Oct 2022"
                    ))

                if p_obj.parcel_id == "P-1027":
                    has_disp = db.query(Dispute).filter(Dispute.parcel_id == p_obj.id).first()
                    if not has_disp:
                        db.add(Dispute(
                            dispute_id="DISP-CHD-2023-044",
                            parcel_id=p_obj.id,
                            ulpin=p_obj.ulpin,
                            category="Boundary Conflict",
                            filed_date="18 Oct 2023",
                            status="PENDING",
                            current_stage="Evidence Stage",
                            responsible_authority="Revenue Court of Sub-Divisional Magistrate, Chandigarh",
                            last_updated="12 Jan 2025"
                        ))

                has_rest = db.query(Restriction).filter(Restriction.parcel_id == p_obj.id).first()
                if not has_rest:
                    db.add(Restriction(
                        parcel_id=p_obj.id,
                        ulpin=p_obj.ulpin,
                        restriction_type="Eco-Sensitive Zone",
                        title="Sukhna Wildlife Sanctuary Buffer (ESZ Category 2)",
                        description="Conditional clearance required for commercial vertical expansion beyond G+2.",
                        authority="Chandigarh Department of Environment & Forest",
                        is_active=True,
                        source="Department of Environment Notification 2017"
                    ))

                has_val = db.query(ValuationReference).filter(ValuationReference.parcel_id == p_obj.id).first()
                if not has_val:
                    db.add(ValuationReference(
                        parcel_id=p_obj.id,
                        ulpin=p_obj.ulpin,
                        reference_type="STATUTORY_CIRCLE_RATE",
                        reference_value=48500.0,
                        unit="₹/sq_m",
                        jurisdiction=p_obj.jurisdiction,
                        classification="STATUTORY_CIRCLE_RATE",
                        source="Department of Revenue & Stamps, Chandigarh UT (Circle Rate Notification 2024)",
                        effective_date="01 Apr 2024",
                        notes="Collector circle rate for residential plot category R-2."
                    ))

        db.commit()

        # ── 5. Seed Service Requests & Notifications ──────────────────────────────
        print("Seeding service requests and notifications...")
        p1027 = db.query(Parcel).filter(Parcel.parcel_id == "P-1027").first()
        if p1027:
            existing_sr = db.query(ServiceRequest).filter(ServiceRequest.request_id == "SR-2025-001027").first()
            if not existing_sr:
                sr = ServiceRequest(
                    request_id="SR-2025-001027",
                    parcel_id=p1027.id,
                    ulpin=p1027.ulpin,
                    service_type="demarcation",
                    department="Department of Revenue & Land Records",
                    applicant_name="Ravinder Singh",
                    applicant_phone="+91 98765 43210",
                    applicant_email="citizen@plot360.gov.in",
                    status="UNDER_REVIEW",
                    current_step=3,
                    total_steps=5,
                    notes="Urgent boundary demarcation request for northern boundary alignment."
                )
                db.add(sr)

        # Notifications
        notifs = [
            {"title": "New Service Request", "desc": "Demarcation request filed for P-1026", "type": "SERVICE_REQUEST", "ulpin": "IN-PB-CHD-0001026"},
            {"title": "AI Alert Requiring Review", "desc": "Potential new development flagged on P-1027", "type": "AI_ALERT", "ulpin": "IN-PB-CHD-0001027"},
            {"title": "Data Conflict Assigned", "desc": "Area mismatch flagged between RoR and Tax for P-1028", "type": "CONFLICT", "ulpin": "IN-PB-CHD-0001028"}
        ]
        for n in notifs:
            existing_n = db.query(Notification).filter(Notification.title == n["title"]).first()
            if not existing_n:
                db.add(Notification(
                    title=n["title"],
                    message=n["desc"],
                    notification_type=n["type"],
                    related_ulpin=n["ulpin"],
                    is_read=False
                ))

        # Duplicate Candidates
        existing_dup = db.query(DuplicateCandidate).first()
        if not existing_dup:
            p1 = db.query(Parcel).filter(Parcel.parcel_id == "P-1027").first()
            p2 = db.query(Parcel).filter(Parcel.parcel_id == "P-1025").first()
            if p1 and p2:
                db.add(DuplicateCandidate(
                    parcel_id=p1.id,
                    candidate_parcel_id=p2.id,
                    similarity_score=0.88,
                    matched_fields=["khasra_no", "owner_surname", "boundary_proximity"],
                    reason="High spatial proximity, matching khewat entry, similar area metric (2.37 acres vs 2.35 acres)",
                    status="PENDING_REVIEW"
                ))

        # ── 6. Seed Integration Sources ───────────────────────────────────────────
        print("Seeding integration connectors...")
        conns = [
            {"id": "REV-01", "name": "State Revenue Department (RoR)", "dept": "Department of Revenue & Land Records", "ver": "v2.4", "status": "CONNECTED", "records": 48210, "lat": 42},
            {"id": "REG-01", "name": "Inspector General of Registration (SRO)", "dept": "Department of Stamp & Registration", "ver": "v3.1", "status": "CONNECTED", "records": 19430, "lat": 68},
            {"id": "PLAN-01", "name": "Town & Country Planning Authority", "dept": "Town Planning Directorate", "ver": "v1.8", "status": "CONNECTED", "records": 8720, "lat": 35},
            {"id": "MUN-01", "name": "Municipal Corporation Property Tax Cell", "dept": "Urban Local Bodies", "ver": "v2.0", "status": "CONNECTED", "records": 31050, "lat": 51},
            {"id": "UTIL-01", "name": "State DISCOM & Water Supply Board", "dept": "Power & Water Utilities", "ver": "v1.2", "status": "SIMULATED", "records": 14200, "lat": 74}
        ]

        for c in conns:
            existing_c = db.query(ApiConnection).filter(ApiConnection.connection_id == c["id"]).first()
            if not existing_c:
                db.add(ApiConnection(
                    connection_id=c["id"],
                    name=c["name"],
                    department=c["dept"],
                    version=c["ver"],
                    status=c["status"],
                    is_simulated=(c["status"] == "SIMULATED"),
                    records_synced=c["records"],
                    latency_ms=c["lat"],
                    last_sync="Today, 08:30 AM",
                    next_sync="In 4 hours"
                ))

        # ── 7. Seed Multi-State Configuration ─────────────────────────────────────
        print("Seeding state configurations...")
        states = [
            {
                "id": "chandigarh_ut", "name": "Chandigarh (UT)", "code": "CH", "is_ut": True,
                "terms": {"ror": "Jamabandi", "sub_district": "Tehsil", "plot": "Plot / Khasra", "authority": "Chandigarh Administration"},
                "units": ["m²", "Acre", "Kanal", "Marla", "sq_yd"],
                "hierarchy": ["Union Territory", "Sub-Division", "Tehsil", "Sector"]
            },
            {
                "id": "punjab", "name": "Punjab", "code": "PB", "is_ut": False,
                "terms": {"ror": "Jamabandi", "sub_district": "Tehsil", "plot": "Khasra", "authority": "Punjab Land Records Society"},
                "units": ["m²", "Acre", "Kanal", "Marla", "Bigha"],
                "hierarchy": ["State", "Division", "District", "Sub-Division", "Tehsil", "Kanungo Circle", "Patwar Circle", "Village"]
            },
            {
                "id": "rajasthan", "name": "Rajasthan", "code": "RJ", "is_ut": False,
                "terms": {"ror": "Jamabandi (Apna Khata)", "sub_district": "Tehsil", "plot": "Khasra", "authority": "Board of Revenue Rajasthan"},
                "units": ["m²", "Bigha", "Biswa", "Acre"],
                "hierarchy": ["State", "Division", "District", "Sub-Division", "Tehsil", "Girdawar Circle", "Patwar Circle", "Village"]
            }
        ]

        for s in states:
            existing_s = db.query(StateConfig).filter(StateConfig.state_id == s["id"]).first()
            if not existing_s:
                db.add(StateConfig(
                    state_id=s["id"],
                    state_name=s["name"],
                    state_code=s["code"],
                    is_union_territory=s["is_ut"],
                    local_terminology=s["terms"],
                    measurement_units=s["units"],
                    administrative_hierarchy=s["hierarchy"]
                ))

        # ── 8. Seed AI Model Registry ─────────────────────────────────────────────
        print("Seeding AI model registry...")
        existing_model = db.query(AIModel).filter(AIModel.model_id == "MOD-SIAMESE-V1").first()
        if not existing_model:
            db.add(AIModel(
                model_id="MOD-SIAMESE-V1",
                model_version="Siamese-UNet-v1",
                architecture="Siamese Temporal U-Net",
                dataset_version="DS-SENTINEL2-INDIA-V1",
                training_date="2025-11-20",
                input_bands=6,
                input_resolution=10.0,
                patch_size=256,
                metrics={"precision": 0.884, "recall": 0.862, "f1": 0.873, "iou": 0.775},
                status="ACTIVE",
                active=True
            ))

        db.commit()
        print("SEEDING COMPLETED SUCCESSFULLY!")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
