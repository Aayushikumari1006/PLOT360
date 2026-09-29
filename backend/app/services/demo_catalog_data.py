"""
PLOT360 Backend — Canonical Demonstration Catalogue Data Registry
Defines the authoritative 15 sample locations and 37 curated demo parcels across India.
Clearly marked as DEMO / SAMPLE / ILLUSTRATIVE data.
"""
from typing import Dict, Any, List, Optional

# Supported Scenario Translation Mapping
SCENARIO_DISPLAY_MAP = {
    "AI_CHANGE_REVIEW": {
        "en": "AI Temporal Change Review",
        "hi": "एआई कालिक परिवर्तन समीक्षा",
        "pa": "ਏਆਈ ਸਮਾਂਬੱਧ ਤਬਦੀਲੀ ਸਮੀਖਿਆ",
        "mr": "एआय कालिक बदल पुनरावलोकन"
    },
    "CLEAN_PARCEL": {
        "en": "Clean Verified Title",
        "hi": "सत्यापित स्पष्ट स्वामित्व",
        "pa": "ਤਸਦੀਕਸ਼ੁਦਾ ਸਾਫ਼ ਮਾਲਕੀ",
        "mr": "पडताळणी झालेले निर्दोष शीर्षक"
    },
    "PLANNING_REVIEW": {
        "en": "Statutory Planning Review",
        "hi": "सांविधिक नगर नियोजन समीक्षा",
        "pa": "ਨਗਰ ਯੋਜਨਾਬੰਦੀ ਸਮੀਖਿਆ",
        "mr": "वैधानिक नियोजन पुनरावलोकन"
    },
    "MORTGAGE_LIEN": {
        "en": "Registered Mortgage / Bank Lien",
        "hi": "पंजीकृत बंधक / बैंक लियन",
        "pa": "ਰਜਿਸਟਰਡ ਰਹਿਣ / ਬੈਂਕ ਲੀਅਨ",
        "mr": "नोंदणीकृत तारण / बँक धारणाधिकार"
    },
    "ENCUMBERED_PARCEL": {
        "en": "Active Encumbrance Recorded",
        "hi": "सक्रिय भार दर्ज",
        "pa": "ਸਰਗਰਮ ਦੇਣਦਾਰੀ ਦਰਜ",
        "mr": "सक्रिय बोजा नोंदवलेला"
    },
    "TAX_CASE": {
        "en": "Property Tax Compliance Case",
        "hi": "संपत्ति कर अनुपालन मामला",
        "pa": "ਜਾਇਦਾਦ ਟੈਕਸ ਪਾਲਣਾ ਮਾਮਲਾ",
        "mr": "मालमत्ता कर अनुपालन प्रकरण"
    },
    "DISPUTED": {
        "en": "Boundary Demarcation Dispute",
        "hi": "सीमा सीमांकन विवाद",
        "pa": "ਹੱਦਬੰਦੀ ਨਿਸ਼ਾਨਦੇਹੀ ਝਗੜਾ",
        "mr": "सीमा रेखांकन वाद"
    },
    "RESTRICTION_BUFFER": {
        "en": "Statutory Environmental / Heritage Buffer",
        "hi": "सांविधिक पर्यावरण / धरोहर बफर",
        "pa": "ਵਾਤਾਵਰਣ / ਵਿਰਾਸਤੀ ਬਫ਼ਰ ਪਾਬੰਦੀ",
        "mr": "वैधानिक पर्यावरण / वारसा बफर"
    },
    "INFRASTRUCTURE_GAP": {
        "en": "Civic Infrastructure Feasibility Review",
        "hi": "नागरिक अवसंरचना व्यवहार्यता समीक्षा",
        "pa": "ਨਾਗਰਿਕ ਬੁਨਿਆਦੀ ਢਾਂਚਾ ਸੰਭਾਵਨਾ ਸਮੀਖਿਆ",
        "mr": "नागरी पायाभूत सुविधा व्यवहार्यता पुनरावलोकन"
    },
    "BUILDING_APPROVAL": {
        "en": "Municipal Building Sanction Active",
        "hi": "नगरपालिका भवन निर्माण स्वीकृति सक्रिय",
        "pa": "ਮਿਊਂਸੀਪਲ ਇਮਾਰਤ ਮਨਜ਼ੂਰੀ ਸਰਗਰਮ",
        "mr": "नगरपालिका इमारत मंजुरी सक्रिय"
    },
    "OWNERSHIP_REVIEW": {
        "en": "Multi-Party Share Mutation Review",
        "hi": "बहु-पक्षीय अंश नामांतरण समीक्षा",
        "pa": "ਸਾਂਝੀ ਮਾਲਕੀ ਇੰਤਕਾਲ ਸਮੀਖਿਆ",
        "mr": "बहु-पक्षीय हिस्सा फेरफार पुनरावलोकन"
    }
}

# 15 Curated Demo Locations
DEMO_LOCATIONS_DATA = [
    {
        "id": "chandigarh",
        "name": "Chandigarh",
        "state": "Punjab / UT",
        "jurisdiction": "Chandigarh",
        "lat": 30.7398,
        "lng": 76.7794,
        "urban_rural": "Urban",
        "defaultParcelId": "P-1027",
        "description": "Union Territory administrative centre featuring Sector 17 commercial, residential sectors, and active Sentinel-2 change alert.",
        "sentinel_available": True
    },
    {
        "id": "delhi",
        "name": "Delhi",
        "state": "Delhi",
        "jurisdiction": "Delhi",
        "lat": 28.6139,
        "lng": 77.2090,
        "urban_rural": "Urban",
        "defaultParcelId": "P-1101",
        "description": "National Capital Territory metropolitan commercial and residential plots under DDA master plan.",
        "sentinel_available": False
    },
    {
        "id": "bengaluru",
        "name": "Bengaluru",
        "state": "Karnataka",
        "jurisdiction": "Karnataka",
        "lat": 12.9716,
        "lng": 77.5946,
        "urban_rural": "Urban",
        "defaultParcelId": "P-1201",
        "description": "Silicon Valley IT corridors, Whitefield tech parks, and residential layouts integrated with Bhoomi RTC format.",
        "sentinel_available": False
    },
    {
        "id": "mumbai",
        "name": "Mumbai",
        "state": "Maharashtra",
        "jurisdiction": "Maharashtra",
        "lat": 19.0760,
        "lng": 72.8777,
        "urban_rural": "Urban",
        "defaultParcelId": "P-1301",
        "description": "High-density western suburban transit corridors with high-rise building permissions and municipal revenue assessments.",
        "sentinel_available": False
    },
    {
        "id": "jaipur",
        "name": "Jaipur",
        "state": "Rajasthan",
        "jurisdiction": "Rajasthan",
        "lat": 26.9124,
        "lng": 75.7873,
        "urban_rural": "Urban",
        "defaultParcelId": "P-2001",
        "description": "Heritage-buffered commercial sectors and residential colonies evaluated under JDA Master Plan 2025.",
        "sentinel_available": False
    },
    {
        "id": "ahmedabad",
        "name": "Ahmedabad",
        "state": "Gujarat",
        "jurisdiction": "Gujarat",
        "lat": 23.0225,
        "lng": 72.5714,
        "urban_rural": "Urban",
        "defaultParcelId": "P-1401",
        "description": "SG Highway commercial growth zone with verified AnyRoR 7/12 land records and TP scheme integration.",
        "sentinel_available": False
    },
    {
        "id": "lucknow",
        "name": "Lucknow",
        "state": "Uttar Pradesh",
        "jurisdiction": "Uttar Pradesh",
        "lat": 26.8467,
        "lng": 80.9462,
        "urban_rural": "Urban",
        "defaultParcelId": "P-1501",
        "description": "Gomti Nagar planned expansion and Hazratganj heritage conservation zones under LDA regulations.",
        "sentinel_available": False
    },
    {
        "id": "hyderabad",
        "name": "Hyderabad",
        "state": "Telangana",
        "jurisdiction": "Telangana",
        "lat": 17.3850,
        "lng": 78.4867,
        "urban_rural": "Urban",
        "defaultParcelId": "P-1601",
        "description": "Cyberabad HITEC City and financial district parcels with Dharani portal record synchronization.",
        "sentinel_available": False
    },
    {
        "id": "chennai",
        "name": "Chennai",
        "state": "Tamil Nadu",
        "jurisdiction": "Tamil Nadu",
        "lat": 13.0827,
        "lng": 80.2707,
        "urban_rural": "Urban",
        "defaultParcelId": "P-1701",
        "description": "OMR Rajiv Gandhi Salai IT corridor and commercial hubs linked with Patta/Chitta registry.",
        "sentinel_available": False
    },
    {
        "id": "pune",
        "name": "Pune",
        "state": "Maharashtra",
        "jurisdiction": "Maharashtra",
        "lat": 18.5204,
        "lng": 73.8567,
        "urban_rural": "Urban",
        "defaultParcelId": "P-4001",
        "description": "Hinjawadi Infotech Zone and suburban residential zones demonstrating Maharashtra 7/12 extract formats.",
        "sentinel_available": False
    },
    {
        "id": "varanasi",
        "name": "Varanasi",
        "state": "Uttar Pradesh",
        "jurisdiction": "Uttar Pradesh",
        "lat": 25.3176,
        "lng": 82.9739,
        "urban_rural": "Rural",
        "defaultParcelId": "P-3001",
        "description": "Rural revenue village and riverfront buffer context illustrating eco-sensitive CRZ and archaeological restrictions.",
        "sentinel_available": False
    },
    {
        "id": "anand",
        "name": "Anand",
        "state": "Gujarat",
        "jurisdiction": "Gujarat",
        "lat": 22.5645,
        "lng": 72.9289,
        "urban_rural": "Rural",
        "defaultParcelId": "P-1901",
        "description": "Agricultural cooperative dairy belt revenue village showcasing succession mutation and farm land tenure.",
        "sentinel_available": False
    },
    {
        "id": "shimla",
        "name": "Shimla",
        "state": "Himachal Pradesh",
        "jurisdiction": "Himachal Pradesh",
        "lat": 31.1048,
        "lng": 77.1734,
        "urban_rural": "Mountain",
        "defaultParcelId": "P-1801",
        "description": "Hilly terrain and Shivalik mountain context demonstrating steep slope contour building restrictions.",
        "sentinel_available": False
    },
    {
        "id": "solan",
        "name": "Solan",
        "state": "Himachal Pradesh",
        "jurisdiction": "Himachal Pradesh",
        "lat": 30.9084,
        "lng": 77.0999,
        "urban_rural": "Mountain",
        "defaultParcelId": "P-1803",
        "description": "Hill transit and industrial corridor evaluating slope stability and utility infrastructure connectivity.",
        "sentinel_available": False
    },
    {
        "id": "kochi",
        "name": "Kochi",
        "state": "Kerala",
        "jurisdiction": "Kerala",
        "lat": 9.9312,
        "lng": 76.2673,
        "urban_rural": "Coastal",
        "defaultParcelId": "P-5001",
        "description": "Coastal wetlands and port logistics corridor governed by strict CRZ buffer regulations and utility easements.",
        "sentinel_available": False
    },
    {
        "id": "gurugram",
        "name": "Gurugram",
        "state": "Haryana",
        "jurisdiction": "Haryana",
        "lat": 28.4595,
        "lng": 77.0266,
        "urban_rural": "Urban",
        "defaultParcelId": "P-6001",
        "description": "Cyber City IT & commercial hub, Golf Course Road transit-oriented zone under GMDA.",
        "sentinel_available": False
    },
    {
        "id": "amritsar",
        "name": "Amritsar",
        "state": "Punjab",
        "jurisdiction": "Punjab",
        "lat": 31.6340,
        "lng": 74.8723,
        "urban_rural": "Urban",
        "defaultParcelId": "P-6101",
        "description": "Ranjit Avenue smart commercial zone and historic walled city heritage buffer.",
        "sentinel_available": False
    },
    {
        "id": "kolkata",
        "name": "Kolkata",
        "state": "West Bengal",
        "jurisdiction": "West Bengal",
        "lat": 22.5726,
        "lng": 88.3639,
        "urban_rural": "Urban",
        "defaultParcelId": "P-6201",
        "description": "New Town Rajarhat IT corridor and Salt Lake Sector V under WBHIDCO master plan.",
        "sentinel_available": False
    },
    {
        "id": "bhopal",
        "name": "Bhopal",
        "state": "Madhya Pradesh",
        "jurisdiction": "Madhya Pradesh",
        "lat": 23.2599,
        "lng": 77.4126,
        "urban_rural": "Urban",
        "defaultParcelId": "P-6301",
        "description": "Arera Colony and MP Nagar commercial zone with Upper Lake wetland buffer.",
        "sentinel_available": False
    },
    {
        "id": "indore",
        "name": "Indore",
        "state": "Madhya Pradesh",
        "jurisdiction": "Madhya Pradesh",
        "lat": 22.7196,
        "lng": 75.8577,
        "urban_rural": "Urban",
        "defaultParcelId": "P-6401",
        "description": "Super Corridor IT parks and Vijay Nagar commercial hub under IDA master plan.",
        "sentinel_available": False
    },
    {
        "id": "patna",
        "name": "Patna",
        "state": "Bihar",
        "jurisdiction": "Bihar",
        "lat": 25.5941,
        "lng": 85.1376,
        "urban_rural": "Urban",
        "defaultParcelId": "P-6501",
        "description": "Bailey Road corridor and Ganga Riverfront expressway smart zone under PRDA.",
        "sentinel_available": False
    },
    {
        "id": "bhubaneswar",
        "name": "Bhubaneswar",
        "state": "Odisha",
        "jurisdiction": "Odisha",
        "lat": 20.2961,
        "lng": 85.8245,
        "urban_rural": "Urban",
        "defaultParcelId": "P-6601",
        "description": "Infocity IT hub and Chandrasekharpur institutional belt under BDA.",
        "sentinel_available": False
    },
    {
        "id": "dehradun",
        "name": "Dehradun",
        "state": "Uttarakhand",
        "jurisdiction": "Uttarakhand",
        "lat": 30.3165,
        "lng": 78.0322,
        "urban_rural": "Mountain",
        "defaultParcelId": "P-6701",
        "description": "Rajpur Road foothill corridor and Doon Valley eco-sensitive development zone.",
        "sentinel_available": False
    },
    {
        "id": "guwahati",
        "name": "Guwahati",
        "state": "Assam",
        "jurisdiction": "Assam",
        "lat": 26.1445,
        "lng": 91.7362,
        "urban_rural": "Urban",
        "defaultParcelId": "P-6801",
        "description": "Dispur capital complex and Brahmaputra riverfront smart city corridor under GMDA.",
        "sentinel_available": False
    },
    {
        "id": "panaji",
        "name": "Panaji",
        "state": "Goa",
        "jurisdiction": "Goa",
        "lat": 15.4909,
        "lng": 73.8278,
        "urban_rural": "Coastal",
        "defaultParcelId": "P-6901",
        "description": "Miramar coastal residential and Mandovi commercial waterfront governed by strict CRZ buffers.",
        "sentinel_available": False
    }
]

# Helper generator for sample polygons
def _make_box_polygon(lat: float, lng: float, dlat: float = 0.0012, dlng: float = 0.0016):
    return [
        {"lat": round(lat - dlat, 6), "lng": round(lng - dlng, 6)},
        {"lat": round(lat + dlat, 6), "lng": round(lng - dlng, 6)},
        {"lat": round(lat + dlat, 6), "lng": round(lng + dlng, 6)},
        {"lat": round(lat - dlat, 6), "lng": round(lng + dlng, 6)}
    ]

# 37 Curated Demo Parcels Across All 15 Locations
INITIAL_CURATED_PARCELS = [
    # ── 1. Chandigarh (4 Parcels) ─────────────────────────────────────────────
    {
        "parcel_id": "P-1027",
        "ulpin": "IN-PB-CHD-0001027",
        "survey_no": "1027/A",
        "khata_no": "KH-842",
        "location": "Sector 17, Chandigarh",
        "location_id": "chandigarh",
        "state": "Punjab / UT",
        "district": "Chandigarh",
        "tehsil": "Chandigarh Central",
        "rural_urban": "Urban",
        "original_area": 0.31,
        "original_unit": "Acre",
        "standardized_area": 1248.50,
        "standardized_unit": "m²",
        "area_display": "1,248.50 m²",
        "original_area_display": "0.31 Acre",
        "land_use": "Residential",
        "zoning": "Residential (R-2)",
        "jurisdiction": "Chandigarh",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 30.7392,
        "centroid_lng": 76.7818,
        "scenario": "AI_CHANGE_REVIEW",
        "scenario_display": "AI Temporal Change Review",
        "sentinel_available": True,
        "owner": {"name": "Ravinder Singh", "relation": "s/o Harbhajan Singh", "share": "100%"},
        "bp": {"id": "PJB/BP/2023/114", "status": "Approved", "floors": "G + 2", "date": "14 Nov 2023"},
        "enc": {"status": "Active", "inst": "HDFC Bank Ltd.", "amt": "₹ 45,00,000", "noc": True, "ref": "MORT-2023-098"},
        "tax": {"id": "PT-CHD-2024-8902", "status": "Paid", "paid": "₹ 18,400", "date": "28 Jun 2024"},
        "ut": {"elec": "Connected (Meter #99210)", "water": "Connected (Connection #4412)", "sewer": "Connected", "gas": "Available Nearby"},
        "coords": [
            {"lat": 30.7398, "lng": 76.7794},
            {"lat": 30.7412, "lng": 76.7820},
            {"lat": 30.7385, "lng": 76.7842},
            {"lat": 30.7371, "lng": 76.7816}
        ]
    },
    {
        "parcel_id": "P-1025",
        "ulpin": "IN-PB-CHD-0001025",
        "survey_no": "1025",
        "khata_no": "KH-840",
        "location": "Sector 17, Chandigarh",
        "location_id": "chandigarh",
        "state": "Punjab / UT",
        "district": "Chandigarh",
        "tehsil": "Chandigarh Central",
        "rural_urban": "Urban",
        "original_area": 0.28,
        "original_unit": "Acre",
        "standardized_area": 1133.12,
        "standardized_unit": "m²",
        "area_display": "1,133.12 m²",
        "original_area_display": "0.28 Acre",
        "land_use": "Commercial",
        "zoning": "Commercial (C-1)",
        "jurisdiction": "Chandigarh",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 30.7412,
        "centroid_lng": 76.7842,
        "scenario": "CLEAN_PARCEL",
        "scenario_display": "Clean Verified Title",
        "sentinel_available": False,
        "owner": {"name": "Amrik Builders & Promoters", "relation": "Ltd.", "share": "100%"},
        "bp": {"id": "PJB/BP/2022/881", "status": "Approved", "floors": "G + 4", "date": "10 Jan 2022"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-CHD-2024-8900", "status": "Paid", "paid": "₹ 34,200", "date": "15 Jul 2024"},
        "ut": {"elec": "Connected", "water": "Connected", "sewer": "Connected", "gas": "Connected"},
        "coords": [
            {"lat": 30.7415, "lng": 76.7825},
            {"lat": 30.7428, "lng": 76.7845},
            {"lat": 30.7410, "lng": 76.7860},
            {"lat": 30.7397, "lng": 76.7840}
        ]
    },
    {
        "parcel_id": "P-1026",
        "ulpin": "IN-PB-CHD-0001026",
        "survey_no": "1026",
        "khata_no": "KH-841",
        "location": "Sector 17, Chandigarh",
        "location_id": "chandigarh",
        "state": "Punjab / UT",
        "district": "Chandigarh",
        "tehsil": "Chandigarh Central",
        "rural_urban": "Urban",
        "original_area": 0.45,
        "original_unit": "Acre",
        "standardized_area": 1821.08,
        "standardized_unit": "m²",
        "area_display": "1,821.08 m²",
        "original_area_display": "0.45 Acre",
        "land_use": "Residential",
        "zoning": "Residential (R-2)",
        "jurisdiction": "Chandigarh",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 30.7380,
        "centroid_lng": 76.7788,
        "scenario": "PLANNING_REVIEW",
        "scenario_display": "Statutory Planning Review",
        "sentinel_available": False,
        "owner": {"name": "Gurpreet Kaur", "relation": "w/o Jaswant Singh", "share": "100%"},
        "bp": {"id": "PJB/BP/2024/012", "status": "Under Review", "floors": "G + 2", "date": "05 Mar 2024"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-CHD-2024-8901", "status": "Paid", "paid": "₹ 21,500", "date": "10 Aug 2024"},
        "ut": {"elec": "Connected", "water": "Connected", "sewer": "Connected", "gas": "Available Nearby"},
        "coords": [
            {"lat": 30.7385, "lng": 76.7765},
            {"lat": 30.7398, "lng": 76.7790},
            {"lat": 30.7375, "lng": 76.7810},
            {"lat": 30.7362, "lng": 76.7785}
        ]
    },
    {
        "parcel_id": "P-1028",
        "ulpin": "IN-PB-CHD-0001028",
        "survey_no": "1028",
        "khata_no": "KH-843",
        "location": "Sector 17, Chandigarh",
        "location_id": "chandigarh",
        "state": "Punjab / UT",
        "district": "Chandigarh",
        "tehsil": "Chandigarh Central",
        "rural_urban": "Urban",
        "original_area": 0.23,
        "original_unit": "Acre",
        "standardized_area": 950.00,
        "standardized_unit": "m²",
        "area_display": "950.00 m²",
        "original_area_display": "0.23 Acre",
        "land_use": "Residential",
        "zoning": "Residential (R-2)",
        "jurisdiction": "Chandigarh",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 30.7365,
        "centroid_lng": 76.7830,
        "scenario": "MORTGAGE_LIEN",
        "scenario_display": "Registered Mortgage / Bank Lien",
        "sentinel_available": False,
        "owner": {"name": "Balwinder Singh", "relation": "s/o Ajaib Singh", "share": "100%"},
        "bp": {"id": "PJB/BP/2023/442", "status": "Approved", "floors": "G + 2", "date": "18 Aug 2023"},
        "enc": {"status": "Active", "inst": "State Bank of India", "amt": "₹ 38,00,000", "noc": True, "ref": "SBI-CHD-MORT-2023-11"},
        "tax": {"id": "PT-CHD-2024-8903", "status": "Paid", "paid": "₹ 15,200", "date": "14 May 2024"},
        "ut": {"elec": "Connected", "water": "Connected", "sewer": "Connected", "gas": "Connected"},
        "coords": [
            {"lat": 30.7368, "lng": 76.7820},
            {"lat": 30.7378, "lng": 76.7835},
            {"lat": 30.7362, "lng": 76.7845},
            {"lat": 30.7352, "lng": 76.7830}
        ]
    },

    # ── 2. Delhi (3 Parcels) ──────────────────────────────────────────────────
    {
        "parcel_id": "P-1101",
        "ulpin": "IN-DL-DEL-0001101",
        "survey_no": "CP-BLK-B-04",
        "khata_no": "KH-DEL-101",
        "location": "Connaught Place, New Delhi",
        "location_id": "delhi",
        "state": "Delhi",
        "district": "New Delhi Central",
        "tehsil": "Chanakyapuri",
        "rural_urban": "Urban",
        "original_area": 2571.0,
        "original_unit": "sq_yards",
        "standardized_area": 2150.00,
        "standardized_unit": "m²",
        "area_display": "2,150.00 m²",
        "original_area_display": "2,571 sq. yards",
        "land_use": "Commercial",
        "zoning": "Commercial (C-2)",
        "jurisdiction": "Delhi",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 28.6315,
        "centroid_lng": 77.2167,
        "scenario": "TAX_CASE",
        "scenario_display": "Property Tax Compliance Case",
        "sentinel_available": False,
        "owner": {"name": "Regal Holdings Pvt. Ltd.", "relation": "Corp", "share": "100%"},
        "bp": {"id": "NDMC/BP/2021/98", "status": "Approved", "floors": "G + 4", "date": "12 Mar 2021"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-NDMC-2024-0019", "status": "Under Review", "paid": "₹ 1,45,000", "date": "20 Jun 2024"},
        "ut": {"elec": "Connected", "water": "Connected", "sewer": "Connected", "gas": "Connected"},
        "coords": _make_box_polygon(28.6315, 77.2167)
    },
    {
        "parcel_id": "P-1102",
        "ulpin": "IN-DL-DEL-0001102",
        "survey_no": "DDA-DWK-12-88",
        "khata_no": "KH-DEL-102",
        "location": "Sector 12, Dwarka, New Delhi",
        "location_id": "delhi",
        "state": "Delhi",
        "district": "South West Delhi",
        "tehsil": "Dwarka",
        "rural_urban": "Urban",
        "original_area": 1016.0,
        "original_unit": "sq_yards",
        "standardized_area": 850.00,
        "standardized_unit": "m²",
        "area_display": "850.00 m²",
        "original_area_display": "1,016 sq. yards",
        "land_use": "Residential",
        "zoning": "Residential (R-3)",
        "jurisdiction": "Delhi",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 28.5921,
        "centroid_lng": 77.0460,
        "scenario": "MORTGAGE_LIEN",
        "scenario_display": "Registered Mortgage / Bank Lien",
        "sentinel_available": False,
        "owner": {"name": "Vikramaditya Saxena", "relation": "s/o O. P. Saxena", "share": "100%"},
        "bp": {"id": "DDA/BP/2022/411", "status": "Approved", "floors": "Stilt + 4", "date": "15 Sep 2022"},
        "enc": {"status": "Active", "inst": "Punjab National Bank", "amt": "₹ 62,00,000", "noc": True, "ref": "PNB-DWK-2022-81"},
        "tax": {"id": "PT-MCD-2024-8119", "status": "Paid", "paid": "₹ 24,600", "date": "10 Jul 2024"},
        "ut": {"elec": "Connected", "water": "Connected", "sewer": "Connected", "gas": "Connected"},
        "coords": _make_box_polygon(28.5921, 77.0460)
    },
    {
        "parcel_id": "P-1103",
        "ulpin": "IN-DL-DEL-0001103",
        "survey_no": "ROH-SEC9-402",
        "khata_no": "KH-DEL-103",
        "location": "Sector 9, Rohini, New Delhi",
        "location_id": "delhi",
        "state": "Delhi",
        "district": "North West Delhi",
        "tehsil": "Rohini",
        "rural_urban": "Urban",
        "original_area": 1698.0,
        "original_unit": "sq_yards",
        "standardized_area": 1420.00,
        "standardized_unit": "m²",
        "area_display": "1,420.00 m²",
        "original_area_display": "1,698 sq. yards",
        "land_use": "Residential",
        "zoning": "Residential (R-2)",
        "jurisdiction": "Delhi",
        "status": "Under Review",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 28.7112,
        "centroid_lng": 77.1214,
        "scenario": "DISPUTED",
        "scenario_display": "Boundary Demarcation Dispute",
        "sentinel_available": False,
        "owner": {"name": "Suresh Chand Gupta", "relation": "s/o R. L. Gupta", "share": "50%"},
        "bp": {"id": "MCD/BP/2023/091", "status": "Pending", "floors": "G + 3", "date": "11 Oct 2023"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-MCD-2024-4421", "status": "Paid", "paid": "₹ 19,800", "date": "05 Aug 2024"},
        "ut": {"elec": "Connected", "water": "Connected", "sewer": "Connected", "gas": "Available Nearby"},
        "coords": _make_box_polygon(28.7112, 77.1214)
    },

    # ── 3. Bengaluru (3 Parcels) ──────────────────────────────────────────────
    {
        "parcel_id": "P-1201",
        "ulpin": "IN-KA-BLR-0001201",
        "survey_no": "SY-44/2-WHF",
        "khata_no": "KH-KA-501",
        "location": "Whitefield Main Road, Bengaluru",
        "location_id": "bengaluru",
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "tehsil": "Bengaluru East",
        "rural_urban": "Urban",
        "original_area": 1.11,
        "original_unit": "Acre",
        "standardized_area": 4500.00,
        "standardized_unit": "m²",
        "area_display": "4,500.00 m²",
        "original_area_display": "1.11 Acre",
        "land_use": "Commercial/IT",
        "zoning": "Hi-Tech IT Zone (IT-1)",
        "jurisdiction": "Karnataka",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 12.9698,
        "centroid_lng": 77.7499,
        "scenario": "CLEAN_PARCEL",
        "scenario_display": "Clean Verified Title",
        "sentinel_available": False,
        "owner": {"name": "Innova Cyber Infrastructure Ltd.", "relation": "Corp", "share": "100%"},
        "bp": {"id": "BBMP/BP/2022/1904", "status": "Approved", "floors": "2B + G + 8", "date": "19 May 2022"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-BBMP-2024-9912", "status": "Paid", "paid": "₹ 1,85,000", "date": "14 Apr 2024"},
        "ut": {"elec": "BESCOM High Tension Connected", "water": "BWSSB Connected", "sewer": "Connected", "gas": "Connected"},
        "coords": _make_box_polygon(12.9698, 77.7499)
    },
    {
        "parcel_id": "P-1202",
        "ulpin": "IN-KA-BLR-0001202",
        "survey_no": "SY-18/1-KRM",
        "khata_no": "KH-KA-502",
        "location": "4th Block, Koramangala, Bengaluru",
        "location_id": "bengaluru",
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "tehsil": "Bengaluru South",
        "rural_urban": "Urban",
        "original_area": 0.27,
        "original_unit": "Acre",
        "standardized_area": 1100.00,
        "standardized_unit": "m²",
        "area_display": "1,100.00 m²",
        "original_area_display": "0.27 Acre",
        "land_use": "Residential",
        "zoning": "Residential (R-2)",
        "jurisdiction": "Karnataka",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 12.9344,
        "centroid_lng": 77.6288,
        "scenario": "ENCUMBERED_PARCEL",
        "scenario_display": "Active Encumbrance Recorded",
        "sentinel_available": False,
        "owner": {"name": "Siddharth Nambiar", "relation": "s/o K. V. Nambiar", "share": "100%"},
        "bp": {"id": "BBMP/BP/2023/701", "status": "Approved", "floors": "G + 3", "date": "08 Feb 2023"},
        "enc": {"status": "Active", "inst": "ICICI Bank Ltd.", "amt": "₹ 95,00,000", "noc": True, "ref": "ICICI-BLR-KRM-2023-04"},
        "tax": {"id": "PT-BBMP-2024-4102", "status": "Paid", "paid": "₹ 32,400", "date": "22 Jun 2024"},
        "ut": {"elec": "Connected", "water": "BWSSB Connected", "sewer": "Connected", "gas": "Available Nearby"},
        "coords": _make_box_polygon(12.9344, 77.6288)
    },
    {
        "parcel_id": "P-1203",
        "ulpin": "IN-KA-BLR-0001203",
        "survey_no": "SY-89/3-ELC",
        "khata_no": "KH-KA-503",
        "location": "Electronic City Phase 1, Bengaluru",
        "location_id": "bengaluru",
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "tehsil": "Anekal",
        "rural_urban": "Urban",
        "original_area": 0.79,
        "original_unit": "Acre",
        "standardized_area": 3200.00,
        "standardized_unit": "m²",
        "area_display": "3,200.00 m²",
        "original_area_display": "0.79 Acre",
        "land_use": "Industrial/Tech",
        "zoning": "Industrial (IND-2)",
        "jurisdiction": "Karnataka",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 12.8452,
        "centroid_lng": 77.6602,
        "scenario": "INFRASTRUCTURE_GAP",
        "scenario_display": "Civic Infrastructure Feasibility Review",
        "sentinel_available": False,
        "owner": {"name": "Apex Embedded Solutions Ltd.", "relation": "Corp", "share": "100%"},
        "bp": {"id": "BBMP/BP/2023/1102", "status": "Approved", "floors": "G + 5", "date": "14 Nov 2023"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-BBMP-2024-7781", "status": "Paid", "paid": "₹ 88,000", "date": "12 Jul 2024"},
        "ut": {"elec": "Connected", "water": "Pending Network Connection", "sewer": "Connected", "gas": "N/A"},
        "coords": _make_box_polygon(12.8452, 77.6602)
    },

    # ── 4. Mumbai (3 Parcels) ─────────────────────────────────────────────────
    {
        "parcel_id": "P-1301",
        "ulpin": "IN-MH-MUM-0001301",
        "survey_no": "CTS-1482/BND",
        "khata_no": "KH-MH-201",
        "location": "Turner Road, Bandra West, Mumbai",
        "location_id": "mumbai",
        "state": "Maharashtra",
        "district": "Mumbai Suburban",
        "tehsil": "Andheri",
        "rural_urban": "Urban",
        "original_area": 16.3,
        "original_unit": "guntha",
        "standardized_area": 1650.00,
        "standardized_unit": "m²",
        "area_display": "1,650.00 m²",
        "original_area_display": "16.3 Guntha",
        "land_use": "Mixed Use",
        "zoning": "Commercial/Residential (MU-1)",
        "jurisdiction": "Maharashtra",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 19.0596,
        "centroid_lng": 72.8295,
        "scenario": "BUILDING_APPROVAL",
        "scenario_display": "Municipal Building Sanction Active",
        "sentinel_available": False,
        "owner": {"name": "Horizon Realty LLP", "relation": "Partnership", "share": "100%"},
        "bp": {"id": "MCGM/BP/2023/8812", "status": "Approved", "floors": "2B + G + 14", "date": "29 Nov 2023"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-MCGM-2024-1142", "status": "Paid", "paid": "₹ 1,12,000", "date": "18 May 2024"},
        "ut": {"elec": "Adani Electricity Connected", "water": "MCGM Water Connected", "sewer": "Connected", "gas": "Mahanagar Gas Connected"},
        "coords": _make_box_polygon(19.0596, 72.8295)
    },
    {
        "parcel_id": "P-1302",
        "ulpin": "IN-MH-MUM-0001302",
        "survey_no": "CTS-892/AND",
        "khata_no": "KH-MH-202",
        "location": "MIDC Central Road, Andheri East, Mumbai",
        "location_id": "mumbai",
        "state": "Maharashtra",
        "district": "Mumbai Suburban",
        "tehsil": "Andheri",
        "rural_urban": "Urban",
        "original_area": 23.7,
        "original_unit": "guntha",
        "standardized_area": 2400.00,
        "standardized_unit": "m²",
        "area_display": "2,400.00 m²",
        "original_area_display": "23.7 Guntha",
        "land_use": "Commercial",
        "zoning": "Commercial (C-1)",
        "jurisdiction": "Maharashtra",
        "status": "Under Review",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 19.1197,
        "centroid_lng": 72.8722,
        "scenario": "OWNERSHIP_REVIEW",
        "scenario_display": "Multi-Party Share Mutation Review",
        "sentinel_available": False,
        "owner": {"name": "Pravin Shah & Sons", "relation": "HUF", "share": "100%"},
        "bp": {"id": "MCGM/BP/2022/4411", "status": "Approved", "floors": "G + 7", "date": "16 Aug 2022"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-MCGM-2024-8821", "status": "Paid", "paid": "₹ 96,500", "date": "11 Jun 2024"},
        "ut": {"elec": "Connected", "water": "Connected", "sewer": "Connected", "gas": "Connected"},
        "coords": _make_box_polygon(19.1197, 72.8722)
    },
    {
        "parcel_id": "P-1303",
        "ulpin": "IN-MH-MUM-0001303",
        "survey_no": "CTS-512/KRL",
        "khata_no": "KH-MH-203",
        "location": "LBS Marg, Kurla West, Mumbai",
        "location_id": "mumbai",
        "state": "Maharashtra",
        "district": "Mumbai Suburban",
        "tehsil": "Kurla",
        "rural_urban": "Urban",
        "original_area": 19.3,
        "original_unit": "guntha",
        "standardized_area": 1950.00,
        "standardized_unit": "m²",
        "area_display": "1,950.00 m²",
        "original_area_display": "19.3 Guntha",
        "land_use": "Commercial",
        "zoning": "Commercial (C-2)",
        "jurisdiction": "Maharashtra",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 19.0688,
        "centroid_lng": 72.8890,
        "scenario": "TAX_CASE",
        "scenario_display": "Property Tax Compliance Case",
        "sentinel_available": False,
        "owner": {"name": "National Warehousing Corp", "relation": "Corp", "share": "100%"},
        "bp": {"id": "MCGM/BP/2021/301", "status": "Approved", "floors": "G + 3", "date": "04 Oct 2021"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-MCGM-2024-5501", "status": "Under Review", "paid": "₹ 74,000", "date": "19 Jul 2024"},
        "ut": {"elec": "Connected", "water": "Connected", "sewer": "Connected", "gas": "N/A"},
        "coords": _make_box_polygon(19.0688, 72.8890)
    },

    # ── 5. Jaipur (3 Parcels) ─────────────────────────────────────────────────
    {
        "parcel_id": "P-2001",
        "ulpin": "IN-RJ-JPR-0002001",
        "survey_no": "KH-842/JPR",
        "khata_no": "KH-RJ-301",
        "location": "Madhyam Marg, Mansarovar, Jaipur",
        "location_id": "jaipur",
        "state": "Rajasthan",
        "district": "Jaipur",
        "tehsil": "Jaipur",
        "rural_urban": "Urban",
        "original_area": 0.73,
        "original_unit": "bigha",
        "standardized_area": 1850.00,
        "standardized_unit": "m²",
        "area_display": "1,850.00 m²",
        "original_area_display": "0.73 Bigha",
        "land_use": "Commercial",
        "zoning": "Heritage Corridor Buffer (C-H)",
        "jurisdiction": "Rajasthan",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 26.8524,
        "centroid_lng": 75.7673,
        "scenario": "RESTRICTION_BUFFER",
        "scenario_display": "Statutory Environmental / Heritage Buffer",
        "sentinel_available": False,
        "owner": {"name": "Mahaveer Prasad Sharma", "relation": "s/o G. D. Sharma", "share": "100%"},
        "bp": {"id": "JDA/BP/2023/1109", "status": "Approved", "floors": "G + 2 (Height Restricted to 12m)", "date": "21 Dec 2023"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-NNJ-2024-6019", "status": "Paid", "paid": "₹ 28,400", "date": "29 Jun 2024"},
        "ut": {"elec": "Connected", "water": "PHED Connected", "sewer": "Connected", "gas": "Available Nearby"},
        "coords": _make_box_polygon(26.8524, 75.7673)
    },
    {
        "parcel_id": "P-2002",
        "ulpin": "IN-RJ-JPR-0002002",
        "survey_no": "KH-912/JPR",
        "khata_no": "KH-RJ-302",
        "location": "Subhash Marg, C-Scheme, Jaipur",
        "location_id": "jaipur",
        "state": "Rajasthan",
        "district": "Jaipur",
        "tehsil": "Jaipur",
        "rural_urban": "Urban",
        "original_area": 0.51,
        "original_unit": "bigha",
        "standardized_area": 1280.00,
        "standardized_unit": "m²",
        "area_display": "1,280.00 m²",
        "original_area_display": "0.51 Bigha",
        "land_use": "Residential",
        "zoning": "Residential (R-2)",
        "jurisdiction": "Rajasthan",
        "status": "Under Review",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 26.9088,
        "centroid_lng": 75.8012,
        "scenario": "OWNERSHIP_REVIEW",
        "scenario_display": "Multi-Party Share Mutation Review",
        "sentinel_available": False,
        "owner": {"name": "Rajendra Singh Rathore & Co-owners", "relation": "Joint", "share": "50% each"},
        "bp": {"id": "JDA/BP/2024/041", "status": "Under Review", "floors": "G + 2", "date": "14 Jan 2024"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-NNJ-2024-3310", "status": "Paid", "paid": "₹ 18,900", "date": "12 Jul 2024"},
        "ut": {"elec": "Connected", "water": "Connected", "sewer": "Connected", "gas": "Connected"},
        "coords": _make_box_polygon(26.9088, 75.8012)
    },
    {
        "parcel_id": "P-2003",
        "ulpin": "IN-RJ-JPR-0002003",
        "survey_no": "KH-1102/STP",
        "khata_no": "KH-RJ-303",
        "location": "RIICO Industrial Area, Sitapura, Jaipur",
        "location_id": "jaipur",
        "state": "Rajasthan",
        "district": "Jaipur",
        "tehsil": "Sanganer",
        "rural_urban": "Urban",
        "original_area": 1.50,
        "original_unit": "bigha",
        "standardized_area": 3800.00,
        "standardized_unit": "m²",
        "area_display": "3,800.00 m²",
        "original_area_display": "1.50 Bigha",
        "land_use": "Industrial",
        "zoning": "Industrial (IND-1)",
        "jurisdiction": "Rajasthan",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 26.7788,
        "centroid_lng": 75.8340,
        "scenario": "CLEAN_PARCEL",
        "scenario_display": "Clean Verified Title",
        "sentinel_available": False,
        "owner": {"name": "Ametek Precision Tools Ltd.", "relation": "Corp", "share": "100%"},
        "bp": {"id": "RIICO/BP/2022/88", "status": "Approved", "floors": "G + 1", "date": "09 Sep 2022"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-RIICO-2024-114", "status": "Paid", "paid": "₹ 54,000", "date": "04 May 2024"},
        "ut": {"elec": "High Tension Connected", "water": "Connected", "sewer": "Connected", "gas": "N/A"},
        "coords": _make_box_polygon(26.7788, 75.8340)
    },

    # ── 6. Ahmedabad (2 Parcels) ──────────────────────────────────────────────
    {
        "parcel_id": "P-1401",
        "ulpin": "IN-GJ-AHM-0001401",
        "survey_no": "RS-481/SGH",
        "khata_no": "KH-GJ-401",
        "location": "S.G. Highway, Thaltej, Ahmedabad",
        "location_id": "ahmedabad",
        "state": "Gujarat",
        "district": "Ahmedabad",
        "tehsil": "Ghatlodiya",
        "rural_urban": "Urban",
        "original_area": 1.11,
        "original_unit": "bigha",
        "standardized_area": 2800.00,
        "standardized_unit": "m²",
        "area_display": "2,800.00 m²",
        "original_area_display": "1.11 Bigha",
        "land_use": "Commercial",
        "zoning": "Commercial (C-1)",
        "jurisdiction": "Gujarat",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 23.0511,
        "centroid_lng": 72.5122,
        "scenario": "CLEAN_PARCEL",
        "scenario_display": "Clean Verified Title",
        "sentinel_available": False,
        "owner": {"name": "Patel Infrastructure Consortium", "relation": "Partnership", "share": "100%"},
        "bp": {"id": "AMC/BP/2023/1842", "status": "Approved", "floors": "G + 9", "date": "14 Oct 2023"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-AMC-2024-9021", "status": "Paid", "paid": "₹ 82,400", "date": "12 Jun 2024"},
        "ut": {"elec": "Torrent Power Connected", "water": "AMC Water Connected", "sewer": "Connected", "gas": "Adani Gas Connected"},
        "coords": _make_box_polygon(23.0511, 72.5122)
    },
    {
        "parcel_id": "P-1402",
        "ulpin": "IN-GJ-AHM-0001402",
        "survey_no": "RS-219/BDK",
        "khata_no": "KH-GJ-402",
        "location": "Sindhu Bhavan Marg, Bodakdev, Ahmedabad",
        "location_id": "ahmedabad",
        "state": "Gujarat",
        "district": "Ahmedabad",
        "tehsil": "Daskroi",
        "rural_urban": "Urban",
        "original_area": 0.53,
        "original_unit": "bigha",
        "standardized_area": 1350.00,
        "standardized_unit": "m²",
        "area_display": "1,350.00 m²",
        "original_area_display": "0.53 Bigha",
        "land_use": "Residential",
        "zoning": "Residential (R-2)",
        "jurisdiction": "Gujarat",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 23.0392,
        "centroid_lng": 72.5080,
        "scenario": "CLEAN_PARCEL",
        "scenario_display": "Clean Verified Title",
        "sentinel_available": False,
        "owner": {"name": "Mehul J. Adani", "relation": "s/o J. K. Adani", "share": "100%"},
        "bp": {"id": "AMC/BP/2022/902", "status": "Approved", "floors": "G + 3", "date": "18 Jan 2022"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-AMC-2024-4112", "status": "Paid", "paid": "₹ 31,500", "date": "08 Jul 2024"},
        "ut": {"elec": "Torrent Power Connected", "water": "Connected", "sewer": "Connected", "gas": "Connected"},
        "coords": _make_box_polygon(23.0392, 72.5080)
    },

    # ── 7. Lucknow (2 Parcels) ────────────────────────────────────────────────
    {
        "parcel_id": "P-1501",
        "ulpin": "IN-UP-LKO-0001501",
        "survey_no": "GATA-891/GMT",
        "khata_no": "KH-UP-501",
        "location": "Vibhuti Khand, Gomti Nagar, Lucknow",
        "location_id": "lucknow",
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "tehsil": "Lucknow Sadar",
        "rural_urban": "Urban",
        "original_area": 0.83,
        "original_unit": "bigha",
        "standardized_area": 2100.00,
        "standardized_unit": "m²",
        "area_display": "2,100.00 m²",
        "original_area_display": "0.83 Bigha",
        "land_use": "Commercial",
        "zoning": "Commercial (C-1)",
        "jurisdiction": "Uttar Pradesh",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 26.8722,
        "centroid_lng": 81.0028,
        "scenario": "BUILDING_APPROVAL",
        "scenario_display": "Municipal Building Sanction Active",
        "sentinel_available": False,
        "owner": {"name": "Awadh Commercial Enclave Ltd.", "relation": "Corp", "share": "100%"},
        "bp": {"id": "LDA/BP/2023/512", "status": "Approved", "floors": "G + 4", "date": "24 Aug 2023"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-LMC-2024-7712", "status": "Paid", "paid": "₹ 41,200", "date": "14 May 2024"},
        "ut": {"elec": "MVVNL Connected", "water": "Jal Sansthan Connected", "sewer": "Connected", "gas": "Green Gas Connected"},
        "coords": _make_box_polygon(26.8722, 81.0028)
    },
    {
        "parcel_id": "P-1502",
        "ulpin": "IN-UP-LKO-0001502",
        "survey_no": "GATA-441/HZG",
        "khata_no": "KH-UP-502",
        "location": "Mahatma Gandhi Marg, Hazratganj, Lucknow",
        "location_id": "lucknow",
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "tehsil": "Lucknow Sadar",
        "rural_urban": "Urban",
        "original_area": 0.57,
        "original_unit": "bigha",
        "standardized_area": 1450.00,
        "standardized_unit": "m²",
        "area_display": "1,450.00 m²",
        "original_area_display": "0.57 Bigha",
        "land_use": "Commercial Heritage",
        "zoning": "Heritage Conservation Zone (C-H)",
        "jurisdiction": "Uttar Pradesh",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 26.8520,
        "centroid_lng": 80.9460,
        "scenario": "RESTRICTION_BUFFER",
        "scenario_display": "Statutory Environmental / Heritage Buffer",
        "sentinel_available": False,
        "owner": {"name": "Begum Fatima Trust", "relation": "Trust", "share": "100%"},
        "bp": {"id": "LDA/BP/2022/108", "status": "Approved with Heritage Constraints", "floors": "G + 1", "date": "11 Apr 2022"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-LMC-2024-3011", "status": "Paid", "paid": "₹ 26,500", "date": "29 Jun 2024"},
        "ut": {"elec": "Connected", "water": "Connected", "sewer": "Connected", "gas": "Available Nearby"},
        "coords": _make_box_polygon(26.8520, 80.9460)
    },

    # ── 8. Hyderabad (2 Parcels) ──────────────────────────────────────────────
    {
        "parcel_id": "P-1601",
        "ulpin": "IN-TG-HYD-0001601",
        "survey_no": "SY-64/1-MAD",
        "khata_no": "KH-TG-601",
        "location": "Cyber Towers Road, Madhapur, Hyderabad",
        "location_id": "hyderabad",
        "state": "Telangana",
        "district": "Rangareddy",
        "tehsil": "Serilingampally",
        "rural_urban": "Urban",
        "original_area": 1.04,
        "original_unit": "acre",
        "standardized_area": 4200.00,
        "standardized_unit": "m²",
        "area_display": "4,200.00 m²",
        "original_area_display": "1.04 Acre",
        "land_use": "Commercial/IT",
        "zoning": "Hi-Tech Commercial Zone (IT-1)",
        "jurisdiction": "Telangana",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 17.4504,
        "centroid_lng": 78.3808,
        "scenario": "CLEAN_PARCEL",
        "scenario_display": "Clean Verified Title",
        "sentinel_available": False,
        "owner": {"name": "Deccan Cyber Infotech Ltd.", "relation": "Corp", "share": "100%"},
        "bp": {"id": "GHMC/BP/2022/944", "status": "Approved", "floors": "3B + G + 11", "date": "12 Aug 2022"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-GHMC-2024-5512", "status": "Paid", "paid": "₹ 1,72,000", "date": "16 Jul 2024"},
        "ut": {"elec": "TSSPDCL Dedicated Connected", "water": "HMWSSB Connected", "sewer": "Connected", "gas": "Bhagyanagar Gas Connected"},
        "coords": _make_box_polygon(17.4504, 78.3808)
    },
    {
        "parcel_id": "P-1602",
        "ulpin": "IN-TG-HYD-0001602",
        "survey_no": "SY-112/GCB",
        "khata_no": "KH-TG-602",
        "location": "Outer Ring Road, Gachibowli, Hyderabad",
        "location_id": "hyderabad",
        "state": "Telangana",
        "district": "Rangareddy",
        "tehsil": "Serilingampally",
        "rural_urban": "Urban",
        "original_area": 0.43,
        "original_unit": "acre",
        "standardized_area": 1750.00,
        "standardized_unit": "m²",
        "area_display": "1,750.00 m²",
        "original_area_display": "0.43 Acre",
        "land_use": "Mixed Use",
        "zoning": "Mixed Use (MU-2)",
        "jurisdiction": "Telangana",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 17.4411,
        "centroid_lng": 78.3490,
        "scenario": "MORTGAGE_LIEN",
        "scenario_display": "Registered Mortgage / Bank Lien",
        "sentinel_available": False,
        "owner": {"name": "K. Venkat Rao", "relation": "s/o K. N. Rao", "share": "100%"},
        "bp": {"id": "GHMC/BP/2023/1402", "status": "Approved", "floors": "G + 4", "date": "03 Jun 2023"},
        "enc": {"status": "Active", "inst": "Axis Bank Ltd.", "amt": "₹ 78,00,000", "noc": True, "ref": "AXIS-HYD-GCB-2023-19"},
        "tax": {"id": "PT-GHMC-2024-8841", "status": "Paid", "paid": "₹ 38,500", "date": "09 Jun 2024"},
        "ut": {"elec": "Connected", "water": "HMWSSB Connected", "sewer": "Connected", "gas": "Available Nearby"},
        "coords": _make_box_polygon(17.4411, 78.3490)
    },

    # ── 9. Chennai (2 Parcels) ────────────────────────────────────────────────
    {
        "parcel_id": "P-1701",
        "ulpin": "IN-TN-CHN-0001701",
        "survey_no": "TS-48/SHL",
        "khata_no": "KH-TN-701",
        "location": "Rajiv Gandhi Salai (OMR), Sholinganallur, Chennai",
        "location_id": "chennai",
        "state": "Tamil Nadu",
        "district": "Chennai",
        "tehsil": "Sholinganallur",
        "rural_urban": "Urban",
        "original_area": 38750.0,
        "original_unit": "sq_feet",
        "standardized_area": 3600.00,
        "standardized_unit": "m²",
        "area_display": "3,600.00 m²",
        "original_area_display": "38,750 sq. ft.",
        "land_use": "Commercial/IT",
        "zoning": "IT Corridor Corridor (IT-2)",
        "jurisdiction": "Tamil Nadu",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 12.8988,
        "centroid_lng": 80.2280,
        "scenario": "INFRASTRUCTURE_GAP",
        "scenario_display": "Civic Infrastructure Feasibility Review",
        "sentinel_available": False,
        "owner": {"name": "Coromandel Tech Parks Ltd.", "relation": "Corp", "share": "100%"},
        "bp": {"id": "CMDA/BP/2023/1021", "status": "Approved", "floors": "2B + G + 9", "date": "17 Sep 2023"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-GCC-2024-9102", "status": "Paid", "paid": "₹ 1,24,000", "date": "24 Apr 2024"},
        "ut": {"elec": "TANGEDCO Connected", "water": "CMWSSB Meter Connection", "sewer": "Under Augmentation Review", "gas": "N/A"},
        "coords": _make_box_polygon(12.8988, 80.2280)
    },
    {
        "parcel_id": "P-1702",
        "ulpin": "IN-TN-CHN-0001702",
        "survey_no": "TS-104/TNG",
        "khata_no": "KH-TN-702",
        "location": "North Usman Road, T. Nagar, Chennai",
        "location_id": "chennai",
        "state": "Tamil Nadu",
        "district": "Chennai",
        "tehsil": "Guindy",
        "rural_urban": "Urban",
        "original_area": 16146.0,
        "original_unit": "sq_feet",
        "standardized_area": 1500.00,
        "standardized_unit": "m²",
        "area_display": "1,500.00 m²",
        "original_area_display": "16,146 sq. ft.",
        "land_use": "Commercial",
        "zoning": "Commercial (C-1)",
        "jurisdiction": "Tamil Nadu",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 13.0418,
        "centroid_lng": 80.2340,
        "scenario": "TAX_CASE",
        "scenario_display": "Property Tax Compliance Case",
        "sentinel_available": False,
        "owner": {"name": "Subramanian Silk Emporium", "relation": "Partnership", "share": "100%"},
        "bp": {"id": "GCC/BP/2022/411", "status": "Approved", "floors": "G + 4", "date": "08 Jun 2022"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-GCC-2024-3319", "status": "Paid", "paid": "₹ 48,000", "date": "15 May 2024"},
        "ut": {"elec": "Connected", "water": "CMWSSB Connected", "sewer": "Connected", "gas": "Available Nearby"},
        "coords": _make_box_polygon(13.0418, 80.2340)
    },

    # ── 10. Pune (2 Parcels) ──────────────────────────────────────────────────
    {
        "parcel_id": "P-4001",
        "ulpin": "IN-MH-PUN-0004001",
        "survey_no": "GAT-112/HIN",
        "khata_no": "KH-MH-801",
        "location": "Phase 1, Rajiv Gandhi Infotech Park, Hinjawadi, Pune",
        "location_id": "pune",
        "state": "Maharashtra",
        "district": "Pune",
        "tehsil": "Mulshi",
        "rural_urban": "Urban",
        "original_area": 30.6,
        "original_unit": "guntha",
        "standardized_area": 3100.00,
        "standardized_unit": "m²",
        "area_display": "3,100.00 m²",
        "original_area_display": "30.6 Guntha",
        "land_use": "Commercial/IT",
        "zoning": "Industrial/IT (IT-1)",
        "jurisdiction": "Maharashtra",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 18.5912,
        "centroid_lng": 73.7389,
        "scenario": "CLEAN_PARCEL",
        "scenario_display": "Clean Verified Title",
        "sentinel_available": False,
        "owner": {"name": "Kalyani Tech Parks Ltd.", "relation": "Corp", "share": "100%"},
        "bp": {"id": "PMRDA/BP/2022/1908", "status": "Approved", "floors": "2B + G + 7", "date": "19 Dec 2022"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-PMRDA-2024-9912", "status": "Paid", "paid": "₹ 1,08,000", "date": "14 Apr 2024"},
        "ut": {"elec": "MSEDCL Connected", "water": "MIDC Water Connected", "sewer": "Connected", "gas": "Maharashtra Natural Gas Connected"},
        "coords": _make_box_polygon(18.5912, 73.7389)
    },
    {
        "parcel_id": "P-4002",
        "ulpin": "IN-MH-PUN-0004002",
        "survey_no": "GAT-48/KTH",
        "khata_no": "KH-MH-802",
        "location": "Paud Road, Kothrud, Pune",
        "location_id": "pune",
        "state": "Maharashtra",
        "district": "Pune",
        "tehsil": "Haveli",
        "rural_urban": "Urban",
        "original_area": 12.3,
        "original_unit": "guntha",
        "standardized_area": 1250.00,
        "standardized_unit": "m²",
        "area_display": "1,250.00 m²",
        "original_area_display": "12.3 Guntha",
        "land_use": "Residential",
        "zoning": "Residential (R-2)",
        "jurisdiction": "Maharashtra",
        "status": "Under Review",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 18.5074,
        "centroid_lng": 73.8077,
        "scenario": "DISPUTED",
        "scenario_display": "Boundary Demarcation Dispute",
        "sentinel_available": False,
        "owner": {"name": "Shrikant G. Deshpande", "relation": "s/o G. K. Deshpande", "share": "100%"},
        "bp": {"id": "PMC/BP/2023/419", "status": "Under Review", "floors": "G + 3", "date": "04 Oct 2023"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-PMC-2024-2201", "status": "Paid", "paid": "₹ 22,100", "date": "18 Jul 2024"},
        "ut": {"elec": "Connected", "water": "Connected", "sewer": "Connected", "gas": "Connected"},
        "coords": _make_box_polygon(18.5074, 73.8077)
    },

    # ── 11. Varanasi (3 Parcels) ──────────────────────────────────────────────
    {
        "parcel_id": "P-3001",
        "ulpin": "IN-UP-VNS-0003001",
        "survey_no": "KH-148/VNS",
        "khata_no": "KH-UP-901",
        "location": "Mauza Dafi, Ganga Riverfront, Varanasi",
        "location_id": "varanasi",
        "state": "Uttar Pradesh",
        "district": "Varanasi",
        "tehsil": "Varanasi Sadar",
        "rural_urban": "Rural",
        "original_area": 1.12,
        "original_unit": "bigha",
        "standardized_area": 2850.00,
        "standardized_unit": "m²",
        "area_display": "2,850.00 m²",
        "original_area_display": "1.12 Bigha",
        "land_use": "Agricultural/Riverfront",
        "zoning": "Ganga Riverfront Buffer (ENV-1)",
        "jurisdiction": "Uttar Pradesh",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 25.2678,
        "centroid_lng": 83.0045,
        "scenario": "RESTRICTION_BUFFER",
        "scenario_display": "Statutory Environmental / Heritage Buffer",
        "sentinel_available": False,
        "owner": {"name": "Ram Ratan Yadav", "relation": "s/o Bhola Yadav", "share": "100%"},
        "bp": {"id": "VDA/BP/2021/04", "status": "Restricted (Zero Permanent Development)", "floors": "N/A", "date": "14 Mar 2021"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-VNN-2024-1102", "status": "Exempted (Rural Agri)", "paid": "₹ 0", "date": "10 Apr 2024"},
        "ut": {"elec": "UPPCL Rural Feeder Connected", "water": "Tubewell Source", "sewer": "Septic System", "gas": "N/A"},
        "coords": _make_box_polygon(25.2678, 83.0045)
    },
    {
        "parcel_id": "P-3002",
        "ulpin": "IN-UP-VNS-0003002",
        "survey_no": "KH-210/RMG",
        "khata_no": "KH-UP-902",
        "location": "Mauza Ramnagar Rural, Varanasi",
        "location_id": "varanasi",
        "state": "Uttar Pradesh",
        "district": "Varanasi",
        "tehsil": "Varanasi Sadar",
        "rural_urban": "Rural",
        "original_area": 1.62,
        "original_unit": "bigha",
        "standardized_area": 4100.00,
        "standardized_unit": "m²",
        "area_display": "4,100.00 m²",
        "original_area_display": "1.62 Bigha",
        "land_use": "Agricultural",
        "zoning": "Agricultural Zone (AGRI-1)",
        "jurisdiction": "Uttar Pradesh",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 25.2812,
        "centroid_lng": 83.0310,
        "scenario": "CLEAN_PARCEL",
        "scenario_display": "Clean Verified Title",
        "sentinel_available": False,
        "owner": {"name": "Chandrama Prasad Maurya", "relation": "s/o Kashi Maurya", "share": "100%"},
        "bp": {"id": "VDA/BP/2023/18", "status": "Agricultural Shed Approved", "floors": "G", "date": "09 Jun 2023"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-VNN-2024-1103", "status": "Exempted", "paid": "₹ 0", "date": "11 May 2024"},
        "ut": {"elec": "Connected", "water": "Canal Irrigation Link", "sewer": "N/A", "gas": "N/A"},
        "coords": _make_box_polygon(25.2812, 83.0310)
    },
    {
        "parcel_id": "P-3003",
        "ulpin": "IN-UP-VNS-0003003",
        "survey_no": "KH-88/SRN",
        "khata_no": "KH-UP-903",
        "location": "Mauza Sarnath Heritage Buffer, Varanasi",
        "location_id": "varanasi",
        "state": "Uttar Pradesh",
        "district": "Varanasi",
        "tehsil": "Varanasi Sadar",
        "rural_urban": "Rural",
        "original_area": 0.75,
        "original_unit": "bigha",
        "standardized_area": 1900.00,
        "standardized_unit": "m²",
        "area_display": "1,900.00 m²",
        "original_area_display": "0.75 Bigha",
        "land_use": "Archaeological Buffer",
        "zoning": "Monument Regulated Area (ARCH-1)",
        "jurisdiction": "Uttar Pradesh",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 25.3812,
        "centroid_lng": 83.0225,
        "scenario": "RESTRICTION_BUFFER",
        "scenario_display": "Statutory Environmental / Heritage Buffer",
        "sentinel_available": False,
        "owner": {"name": "Dharmarajika Monastery Trust", "relation": "Trust", "share": "100%"},
        "bp": {"id": "ASI/NOC/2022/94", "status": "Regulated (No Construction within 100m)", "floors": "N/A", "date": "18 Nov 2022"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-VNN-2024-8841", "status": "Exempted", "paid": "₹ 0", "date": "12 Mar 2024"},
        "ut": {"elec": "Connected", "water": "Tubewell", "sewer": "Septic System", "gas": "N/A"},
        "coords": _make_box_polygon(25.3812, 83.0225)
    },

    # ── 12. Anand (2 Parcels) ─────────────────────────────────────────────────
    {
        "parcel_id": "P-1901",
        "ulpin": "IN-GJ-AND-0001901",
        "survey_no": "RS-88/MOG",
        "khata_no": "KH-GJ-1901",
        "location": "Mauza Mogar, Dairy Belt, Anand",
        "location_id": "anand",
        "state": "Gujarat",
        "district": "Anand",
        "tehsil": "Anand Rural",
        "rural_urban": "Rural",
        "original_area": 2.05,
        "original_unit": "bigha",
        "standardized_area": 5200.00,
        "standardized_unit": "m²",
        "area_display": "5,200.00 m²",
        "original_area_display": "2.05 Bigha",
        "land_use": "Agricultural Dairy",
        "zoning": "Cooperative Agricultural Zone (AGRI-D)",
        "jurisdiction": "Gujarat",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 22.5320,
        "centroid_lng": 72.9510,
        "scenario": "CLEAN_PARCEL",
        "scenario_display": "Clean Verified Title",
        "sentinel_available": False,
        "owner": {"name": "Tribhuvandas Dairy Co-op Society", "relation": "Society", "share": "100%"},
        "bp": {"id": "ADA/BP/2021/80", "status": "Dairy Farm Facility Approved", "floors": "G", "date": "14 Aug 2021"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-ANND-2024-101", "status": "Paid", "paid": "₹ 8,400", "date": "18 May 2024"},
        "ut": {"elec": "MGVCL Agri-Feeder Connected", "water": "Canal Feed", "sewer": "N/A", "gas": "Bio-Gas Linked"},
        "coords": _make_box_polygon(22.5320, 72.9510)
    },
    {
        "parcel_id": "P-1902",
        "ulpin": "IN-GJ-AND-0001902",
        "survey_no": "RS-142/CHK",
        "khata_no": "KH-GJ-1902",
        "location": "Mauza Chikhodra, Anand",
        "location_id": "anand",
        "state": "Gujarat",
        "district": "Anand",
        "tehsil": "Anand",
        "rural_urban": "Rural",
        "original_area": 1.34,
        "original_unit": "bigha",
        "standardized_area": 3400.00,
        "standardized_unit": "m²",
        "area_display": "3,400.00 m²",
        "original_area_display": "1.34 Bigha",
        "land_use": "Agricultural",
        "zoning": "Agricultural (AGRI-1)",
        "jurisdiction": "Gujarat",
        "status": "Under Review",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 22.5788,
        "centroid_lng": 72.9840,
        "scenario": "OWNERSHIP_REVIEW",
        "scenario_display": "Multi-Party Share Mutation Review",
        "sentinel_available": False,
        "owner": {"name": "Dineshbhai Somabhai Patel", "relation": "s/o Somabhai Patel", "share": "100%"},
        "bp": {"id": "ADA/BP/2023/12", "status": "Farm Store Approved", "floors": "G", "date": "08 Feb 2023"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-ANND-2024-419", "status": "Paid", "paid": "₹ 5,200", "date": "19 Jun 2024"},
        "ut": {"elec": "MGVCL Connected", "water": "Tubewell", "sewer": "N/A", "gas": "N/A"},
        "coords": _make_box_polygon(22.5788, 72.9840)
    },

    # ── 13. Shimla (2 Parcels) ────────────────────────────────────────────────
    {
        "parcel_id": "P-1801",
        "ulpin": "IN-HP-SML-0001801",
        "survey_no": "KH-411/JKH",
        "khata_no": "KH-HP-1801",
        "location": "Jakhoo Hill Ridge, Shimla",
        "location_id": "shimla",
        "state": "Himachal Pradesh",
        "district": "Shimla",
        "tehsil": "Shimla Urban",
        "rural_urban": "Mountain",
        "original_area": 1.89,
        "original_unit": "bigha",
        "standardized_area": 1600.00,
        "standardized_unit": "m²",
        "area_display": "1,600.00 m²",
        "original_area_display": "1.89 Bigha",
        "land_use": "Mountain Forest Buffer",
        "zoning": "Steep Slope Eco Buffer (SLOPE-1)",
        "jurisdiction": "Himachal Pradesh",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 31.1012,
        "centroid_lng": 77.1820,
        "scenario": "RESTRICTION_BUFFER",
        "scenario_display": "Statutory Environmental / Heritage Buffer",
        "sentinel_available": False,
        "owner": {"name": "Himachal Eco Conservation Society", "relation": "NGO", "share": "100%"},
        "bp": {"id": "TCP-HP/2021/08", "status": "Prohibited (Steep Gradient Slope > 35°)", "floors": "N/A", "date": "11 May 2021"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-SMC-2024-911", "status": "Exempted", "paid": "₹ 0", "date": "12 Apr 2024"},
        "ut": {"elec": "Connected", "water": "Gravity Spring Feed", "sewer": "N/A", "gas": "N/A"},
        "coords": _make_box_polygon(31.1012, 77.1820)
    },
    {
        "parcel_id": "P-1802",
        "ulpin": "IN-HP-SML-0001802",
        "survey_no": "KH-198/MLL",
        "khata_no": "KH-HP-1802",
        "location": "Near Mall Road Upper Ridge, Shimla",
        "location_id": "shimla",
        "state": "Himachal Pradesh",
        "district": "Shimla",
        "tehsil": "Shimla Urban",
        "rural_urban": "Mountain",
        "original_area": 1.16,
        "original_unit": "bigha",
        "standardized_area": 980.00,
        "standardized_unit": "m²",
        "area_display": "980.00 m²",
        "original_area_display": "1.16 Bigha",
        "land_use": "Commercial Heritage",
        "zoning": "Hill Town Commercial (HILL-C)",
        "jurisdiction": "Himachal Pradesh",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 31.1064,
        "centroid_lng": 77.1718,
        "scenario": "PLANNING_REVIEW",
        "scenario_display": "Statutory Planning Review",
        "sentinel_available": False,
        "owner": {"name": "Kailash Chand Verma", "relation": "s/o Devi Ram Verma", "share": "100%"},
        "bp": {"id": "SMC/BP/2023/118", "status": "Approved with Height Cap 9.5m", "floors": "G + 1 + Attic", "date": "19 Oct 2023"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-SMC-2024-4412", "status": "Paid", "paid": "₹ 18,200", "date": "08 Jun 2024"},
        "ut": {"elec": "HPSEBL Connected", "water": "SMC Water Supply Connected", "sewer": "Connected", "gas": "Available Nearby"},
        "coords": _make_box_polygon(31.1064, 77.1718)
    },

    # ── 14. Solan (2 Parcels) ─────────────────────────────────────────────────
    {
        "parcel_id": "P-1803",
        "ulpin": "IN-HP-SOL-0001803",
        "survey_no": "KH-512/BRG",
        "khata_no": "KH-HP-1803",
        "location": "Barog Bypass Road, Solan",
        "location_id": "solan",
        "state": "Himachal Pradesh",
        "district": "Solan",
        "tehsil": "Solan",
        "rural_urban": "Mountain",
        "original_area": 2.60,
        "original_unit": "bigha",
        "standardized_area": 2200.00,
        "standardized_unit": "m²",
        "area_display": "2,200.00 m²",
        "original_area_display": "2.60 Bigha",
        "land_use": "Residential/Hill",
        "zoning": "Hilly Residential (HILL-R)",
        "jurisdiction": "Himachal Pradesh",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 30.8992,
        "centroid_lng": 77.0810,
        "scenario": "PLANNING_REVIEW",
        "scenario_display": "Statutory Planning Review",
        "sentinel_available": False,
        "owner": {"name": "Lt. Col. Jaswant Singh (Retd.)", "relation": "s/o Amar Singh", "share": "100%"},
        "bp": {"id": "TCP-SOL/2023/409", "status": "Approved with Retaining Wall Mandate", "floors": "G + 2", "date": "29 Nov 2023"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-MC-SOL-2024-309", "status": "Paid", "paid": "₹ 14,800", "date": "17 Jul 2024"},
        "ut": {"elec": "HPSEBL Connected", "water": "IPH Department Connected", "sewer": "Septic System Approved", "gas": "N/A"},
        "coords": _make_box_polygon(30.8992, 77.0810)
    },
    {
        "parcel_id": "P-1804",
        "ulpin": "IN-HP-SOL-0001804",
        "survey_no": "KH-298/CHM",
        "khata_no": "KH-HP-1804",
        "location": "National Highway 5 Corridor, Chambaghat, Solan",
        "location_id": "solan",
        "state": "Himachal Pradesh",
        "district": "Solan",
        "tehsil": "Solan",
        "rural_urban": "Mountain",
        "original_area": 2.07,
        "original_unit": "bigha",
        "standardized_area": 1750.00,
        "standardized_unit": "m²",
        "area_display": "1,750.00 m²",
        "original_area_display": "2.07 Bigha",
        "land_use": "Commercial Transit",
        "zoning": "Highway Commercial (HILL-T)",
        "jurisdiction": "Himachal Pradesh",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 30.9142,
        "centroid_lng": 77.1088,
        "scenario": "INFRASTRUCTURE_GAP",
        "scenario_display": "Civic Infrastructure Feasibility Review",
        "sentinel_available": False,
        "owner": {"name": "Himalayan Logistics & Cold Chain", "relation": "Corp", "share": "100%"},
        "bp": {"id": "TCP-SOL/2022/99", "status": "Approved", "floors": "G + 2", "date": "04 Oct 2022"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-MC-SOL-2024-811", "status": "Paid", "paid": "₹ 24,000", "date": "11 May 2024"},
        "ut": {"elec": "Connected", "water": "IPH Connection Pending Flow Augmentation", "sewer": "Connected", "gas": "N/A"},
        "coords": _make_box_polygon(30.9142, 77.1088)
    },

    # ── 15. Kochi (2 Parcels) ─────────────────────────────────────────────────
    {
        "parcel_id": "P-5001",
        "ulpin": "IN-KL-KOC-0005001",
        "survey_no": "RS-89/MND",
        "khata_no": "KH-KL-5001",
        "location": "Marine Drive Waterfront Promenade, Kochi",
        "location_id": "kochi",
        "state": "Kerala",
        "district": "Ernakulam",
        "tehsil": "Kanayannur",
        "rural_urban": "Coastal",
        "original_area": 51.8,
        "original_unit": "cent",
        "standardized_area": 2100.00,
        "standardized_unit": "m²",
        "area_display": "2,100.00 m²",
        "original_area_display": "51.8 Cent",
        "land_use": "Commercial Waterfront",
        "zoning": "Coastal Regulation Zone (CRZ-II)",
        "jurisdiction": "Kerala",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 9.9812,
        "centroid_lng": 76.2750,
        "scenario": "RESTRICTION_BUFFER",
        "scenario_display": "Statutory Environmental / Heritage Buffer",
        "sentinel_available": False,
        "owner": {"name": "Malabar Maritime Properties Ltd.", "relation": "Corp", "share": "100%"},
        "bp": {"id": "KCZMA/BP/2023/14", "status": "Approved with KCZMA Coastal Clearance", "floors": "G + 3", "date": "18 Jul 2023"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-COK-2024-9112", "status": "Paid", "paid": "₹ 52,000", "date": "29 Jun 2024"},
        "ut": {"elec": "KSEB Substation Link", "water": "Kerala Water Authority Connected", "sewer": "Connected", "gas": "Indian Oil Adani Gas Connected"},
        "coords": _make_box_polygon(9.9812, 76.2750)
    },
    {
        "parcel_id": "P-5002",
        "ulpin": "IN-KL-KOC-0005002",
        "survey_no": "RS-142/VLP",
        "khata_no": "KH-KL-5002",
        "location": "ICTT Terminal Corridor, Vallarpadam, Kochi",
        "location_id": "kochi",
        "state": "Kerala",
        "district": "Ernakulam",
        "tehsil": "Kanayannur",
        "rural_urban": "Coastal",
        "original_area": 93.9,
        "original_unit": "cent",
        "standardized_area": 3800.00,
        "standardized_unit": "m²",
        "area_display": "3,800.00 m²",
        "original_area_display": "93.9 Cent",
        "land_use": "Port Logistics",
        "zoning": "Port Utility Easement (PORT-E)",
        "jurisdiction": "Kerala",
        "status": "Verified",
        "sync_status": "Source Verified",
        "data_freshness": "Current",
        "centroid_lat": 9.9980,
        "centroid_lng": 76.2520,
        "scenario": "INFRASTRUCTURE_GAP",
        "scenario_display": "Civic Infrastructure Feasibility Review",
        "sentinel_available": False,
        "owner": {"name": "Cochin International Freight Carriers", "relation": "Partnership", "share": "100%"},
        "bp": {"id": "CPT/BP/2022/90", "status": "Approved", "floors": "G + 1 Logistics Shed", "date": "14 Nov 2022"},
        "enc": {"status": "Clear"},
        "tax": {"id": "PT-COK-2024-4419", "status": "Paid", "paid": "₹ 64,000", "date": "10 May 2024"},
        "ut": {"elec": "KSEB Connected", "water": "KWA Bulk Connection", "sewer": "Connected", "gas": "High-Pressure Gas Corridor Easement Active"},
        "coords": _make_box_polygon(9.9980, 76.2520)
    }
]

LOCATION_CONFIG = {
    "chandigarh": {
        "prefix": "P-10", "start_idx": 29, "ulpin_prefix": "IN-PB-CHD-00010",
        "state": "Punjab / UT", "jurisdiction": "Chandigarh", "district": "Chandigarh", "tehsil": "Chandigarh Central",
        "loc_label": "Sector 17, Chandigarh", "unit": "Acre", "factor": 4046.86,
        "owners": ["Simranjit Singh", "Gurinder Kaur", "Harpreet Verma", "Chandigarh Real Estate Ltd", "Manjit Singh Brar", "Rajinder Paul", "Sunita Sharma", "Daljit Sandhu", "Kuldeep Kaur", "Amarjit Singh", "Jaswinder Singh", "Pritam Enterprises"]
    },
    "delhi": {
        "prefix": "P-11", "start_idx": 4, "ulpin_prefix": "IN-DL-DEL-00011",
        "state": "Delhi", "jurisdiction": "Delhi", "district": "New Delhi", "tehsil": "Chanakyapuri",
        "loc_label": "Connaught Place / Barakhamba, Delhi", "unit": "Sq.Yd", "factor": 0.836127,
        "owners": ["Rakesh Aggarwal", "Pooja Malhotra", "Sunil Goel & Bros", "Vikram Batra", "Anjali Mehra", "DDA Allottee Trust", "Sanjay Kapoor", "Vandana Gupta", "Rohit Tandon", "Ashok Singhal", "Deepak Chopra", "Kavita Sethi", "Rajeev Mittal"]
    },
    "bengaluru": {
        "prefix": "P-12", "start_idx": 4, "ulpin_prefix": "IN-KA-BLR-00012",
        "state": "Karnataka", "jurisdiction": "Karnataka", "district": "Bengaluru Urban", "tehsil": "Bengaluru South",
        "loc_label": "Whitefield / Tech Park Corridor, Bengaluru", "unit": "Guntha", "factor": 101.17,
        "owners": ["Suresh Babu", "Narayana Murthy K.", "Venkatesh Rao", "Brigade Tech Ventures", "Lakshmi Bai", "Prashanth Gowda", "Radha Krishna", "Anand Swaminathan", "Bhoomi Developers LLP", "Sujatha Reddy", "Kiran Kumar M.", "Girish Hegde", "Siddhartha Enterprises"]
    },
    "mumbai": {
        "prefix": "P-13", "start_idx": 4, "ulpin_prefix": "IN-MH-MUM-00013",
        "state": "Maharashtra", "jurisdiction": "Maharashtra", "district": "Mumbai Suburban", "tehsil": "Andheri",
        "loc_label": "Andheri East / MIDC Corridor, Mumbai", "unit": "Sq.Mtr", "factor": 1.0,
        "owners": ["Mahesh Shah", "Pradeep Kadam", "Godrej Properties Consortium", "Nilesh Patkar", "Smita Deshmukh", "Hiten Thakkar", "Ramesh Solanki", "Kishore Chitre", "Prakash Wagle", "Meena Bhansali", "Jitendra Parekh", "Shilpa Sawant", "MMRDA Development Hub"]
    },
    "ahmedabad": {
        "prefix": "P-14", "start_idx": 3, "ulpin_prefix": "IN-GJ-AHM-00014",
        "state": "Gujarat", "jurisdiction": "Gujarat", "district": "Ahmedabad", "tehsil": "Daskroi",
        "loc_label": "SG Highway / Thaltej, Ahmedabad", "unit": "Sq.Mtr", "factor": 1.0,
        "owners": ["Chirag Patel", "Bhavin Shah", "Pravinbhai Prajapati", "Adani Township Ltd", "Hasmukh Vora", "Jayshreeben Dave", "Kalpesh Trivedi", "Manish Mehta", "Dinesh Zala", "Kinjalben Modi", "Haresh Parmar", "Gaurav Dholakia", "Jayantilal & Sons", "Mukesh Somani"]
    },
    "lucknow": {
        "prefix": "P-15", "start_idx": 3, "ulpin_prefix": "IN-UP-LKO-00015",
        "state": "Uttar Pradesh", "jurisdiction": "Uttar Pradesh", "district": "Lucknow", "tehsil": "Lucknow Sadar",
        "loc_label": "Gomti Nagar Extension, Lucknow", "unit": "Bigha", "factor": 2529.28,
        "owners": ["Ram Kishore Yadav", "Shashi Bhushan Tripathi", "Awadh Construction Corp", "Neeraj Shukla", "Pushpa Devi Verma", "Santosh Kumar Mishra", "Alok Srivastava", "Rekha Pandey", "Kamleshwar Singh", "Sunita Awasthi", "Manoj Rawat", "Pratibha Tiwari", "Dharmendra Chauhan", "Vipin Bihari Lal"]
    },
    "hyderabad": {
        "prefix": "P-16", "start_idx": 3, "ulpin_prefix": "IN-TG-HYD-00016",
        "state": "Telangana", "jurisdiction": "Telangana", "district": "Hyderabad", "tehsil": "Secunderabad",
        "loc_label": "HITEC City / Madhapur, Hyderabad", "unit": "Sq.Yd", "factor": 0.836127,
        "owners": ["K. Venkat Reddy", "Ch. Madhava Rao", "Cybercity Infrastructure Ltd", "B. Srinivas Goud", "P. Anasuya Devi", "G. Naresh Kumar", "T. Subba Rao", "S. Lavanya", "M. Mallikarjun", "Y. Chandrasekhar", "V. Vijaya Lakshmi", "D. Ramana Murthy", "A. Ravi Teja", "N. Sravan Kumar"]
    },
    "chennai": {
        "prefix": "P-17", "start_idx": 3, "ulpin_prefix": "IN-TN-CHN-00017",
        "state": "Tamil Nadu", "jurisdiction": "Tamil Nadu", "district": "Chennai", "tehsil": "Egmore",
        "loc_label": "OMR / Taramani IT Corridor, Chennai", "unit": "Ground", "factor": 222.967,
        "owners": ["S. Soundararajan", "K. Meenakshi Sundaram", "TIDEL Park Ancillary Trust", "V. Selvakumar", "R. Revathi Ammal", "M. Palanivelu", "N. Karthikeyan", "A. Jayaraman", "S. Balamurugan", "D. Thenmozhi", "P. Vasanth Kumar", "E. Arumugam", "G. Vijayaraghavan", "C. Thangavel"]
    },
    "shimla": {
        "prefix": "P-18", "start_idx": 5, "ulpin_prefix": "IN-HP-SML-00018",
        "state": "Himachal Pradesh", "jurisdiction": "Himachal Pradesh", "district": "Shimla", "tehsil": "Shimla Urban",
        "loc_label": "Mall Road / Chotta Shimla, Shimla", "unit": "Biswa", "factor": 41.8,
        "owners": ["Prem Lal Thakur", "Gian Chand Sharma", "Himachal Tourism Board", "Kanta Devi", "Surinder Singh Verma", "Bipin Bihari Joshi", "Tara Chand Chauhan", "Mohan Lal Negi", "Sunita Rana", "Devender Kumar", "Rajeshwar Sen", "Anita Sood", "Virender Guleria", "Tek Chand Kashyap"]
    },
    "solan": {
        "prefix": "P-18", "start_idx": 50, "ulpin_prefix": "IN-HP-SOL-00018",
        "state": "Himachal Pradesh", "jurisdiction": "Himachal Pradesh", "district": "Solan", "tehsil": "Solan",
        "loc_label": "Chambaghat / Industrial Belt, Solan", "unit": "Bigha", "factor": 800.0,
        "owners": ["Jagdish Chandra", "Hemant Kumar Sharma", "Shoolini Pharma Hub", "Manmohan Singh", "Sushma Devi", "Dina Nath", "Vikas Panwar", "Rattan Lal", "Bhupinder Singh", "Meena Thakur", "Yogesh Attri", "Kishore Sen", "Kamla Kaushal", "Tilak Raj"]
    },
    "anand": {
        "prefix": "P-19", "start_idx": 3, "ulpin_prefix": "IN-GJ-AND-00019",
        "state": "Gujarat", "jurisdiction": "Gujarat", "district": "Anand", "tehsil": "Anand",
        "loc_label": "Amul Dairy Road / Vallabh Vidyanagar, Anand", "unit": "Vigha", "factor": 2378.0,
        "owners": ["Tribhuvandas Patel", "Amul Cooperative Federation", "Ramanbhai Solanki", "Kantibhai Makwana", "Dineshbhai Rabari", "Shardaben Vaghela", "Bharatbhai Chauhan", "Girishbhai Zala", "Nileshbhai Barot", "Minaben Parmar", "Ashokbhai Desai", "Rohitbhai Rohit", "Lalitbhai Thakor", "Ketanbhai Suthar"]
    },
    "jaipur": {
        "prefix": "P-20", "start_idx": 4, "ulpin_prefix": "IN-RJ-JPR-00020",
        "state": "Rajasthan", "jurisdiction": "Rajasthan", "district": "Jaipur", "tehsil": "Jaipur",
        "loc_label": "JDA Scheme / Malviya Nagar, Jaipur", "unit": "Sq.Yd", "factor": 0.836127,
        "owners": ["Gopal Singh Rathore", "Bhairon Singh Shekhawat", "Pink City Developers", "Kailash Chand Meena", "Shanti Devi Sharma", "Mahaveer Prasad Jain", "Satyanarayan Saini", "Ghanshyam Gurjar", "Bhagwan Sahai", "Kamlesh Kumar", "Om Prakash Kumawat", "Ramavtar Verma", "Pushpendra Singh"]
    },
    "varanasi": {
        "prefix": "P-30", "start_idx": 4, "ulpin_prefix": "IN-UP-VNS-00030",
        "state": "Uttar Pradesh", "jurisdiction": "Uttar Pradesh", "district": "Varanasi", "tehsil": "Varanasi Sadar",
        "loc_label": "Shivpur / Cantt Corridor, Varanasi", "unit": "Biswa", "factor": 126.46,
        "owners": ["Pandit Shiv Kumar Shastri", "Kashi Vishwanath Trust Enclave", "Ram Janam Maurya", "Kanhaiya Lal Gupta", "Durga Prasad Bind", "Santosh Kumar Chaubey", "Vimla Devi Pandey", "Radhey Shyam Patel", "Gauri Shankar Mishra", "Bachchu Lal Yadav", "Brij Mohan Tiwari", "Prakash Chandra Srivastava", "Laxmi Narayan Seth"]
    },
    "pune": {
        "prefix": "P-40", "start_idx": 3, "ulpin_prefix": "IN-MH-PUN-00040",
        "state": "Maharashtra", "jurisdiction": "Maharashtra", "district": "Pune", "tehsil": "Haveli",
        "loc_label": "Hinjawadi IT Corridor / Wakad, Pune", "unit": "Guntha", "factor": 101.17,
        "owners": ["Balasaheb Patil", "Vitthalrao Jagtap", "Magarpatta Tech Horizon", "Sambhaji Gaikwad", "Sunandabai More", "Dattatraya Shinde", "Anandrao Kadam", "Pandurang Babar", "Chandrakant Phadtare", "Shrikant Deshmukh", "Nitin Khutwad", "Sudhir Bhalerao", "Archana Chavan", "Yuvraj Bhosale"]
    },
    "kochi": {
        "prefix": "P-50", "start_idx": 3, "ulpin_prefix": "IN-KL-KOC-00050",
        "state": "Kerala", "jurisdiction": "Kerala", "district": "Ernakulam", "tehsil": "Kanayannur",
        "loc_label": "Kakkanad / Infopark Expressway, Kochi", "unit": "Cent", "factor": 40.4686,
        "owners": ["K. P. Kurian", "Thomas Varghese", "Cochin Tech Venture Trust", "Abdul Rahman K.", "Mary Varghese", "Suresh Menon", "Mathew Joseph", "Biju Varghese", "Radhakrishnan Nair", "Shaji George", "Anitha Mohan", "Babychan Paul", "Vinod Kumar P.", "Valsala Kumari"]
    },
    "gurugram": {
        "prefix": "P-60", "start_idx": 1, "ulpin_prefix": "IN-HR-GGM-00060",
        "state": "Haryana", "jurisdiction": "Haryana", "district": "Gurugram", "tehsil": "Gurugram",
        "loc_label": "Cyber City / Golf Course Rd, Gurugram", "unit": "Sq.Yd", "factor": 0.836127,
        "owners": ["Rajiv Bajaj", "Ananya Singhania", "DLF Horizon Ltd", "Vikramaditya Roy", "Deepak Talwar", "Priya Chawla", "Tarun Khanna", "Meera Oberoi", "Sunil Munjal", "Rohit Bhargava", "Kavita Goel", "Manish Goenka"]
    },
    "amritsar": {
        "prefix": "P-61", "start_idx": 1, "ulpin_prefix": "IN-PB-ASR-00061",
        "state": "Punjab", "jurisdiction": "Punjab", "district": "Amritsar", "tehsil": "Amritsar-I",
        "loc_label": "Ranjit Avenue / Heritage Belt, Amritsar", "unit": "Marla", "factor": 25.29,
        "owners": ["Harpreet Singh Gill", "Maninder Kaur", "Golden City Infra", "Bikramjeet Singh", "Davinder Sandhu", "Simrat Chahal", "Gurpartap Dhillon", "Jasleen Pannu", "Karamjit Randhawa", "Navjot Brar", "Sukhdev Bajwa", "Inderpreet Sekhon"]
    },
    "kolkata": {
        "prefix": "P-62", "start_idx": 1, "ulpin_prefix": "IN-WB-KOL-00062",
        "state": "West Bengal", "jurisdiction": "West Bengal", "district": "North 24 Parganas", "tehsil": "Bidhannagar",
        "loc_label": "New Town / Salt Lake Sector V, Kolkata", "unit": "Kottah", "factor": 66.89,
        "owners": ["Subhashis Banerjee", "Aparna Sen", "Bengal Ambuja Trust", "Debashis Mukherjee", "Swagata Roy", "Anirban Bhattacharya", "Mousumi Ganguly", "Sourav Chatterjee", "Rina Bose", "Kalyan Ghosh", "Indranil Dutta", "Sampa Chakraborty"]
    },
    "bhopal": {
        "prefix": "P-63", "start_idx": 1, "ulpin_prefix": "IN-MP-BHP-00063",
        "state": "Madhya Pradesh", "jurisdiction": "Madhya Pradesh", "district": "Bhopal", "tehsil": "Huzur",
        "loc_label": "Arera Colony / MP Nagar, Bhopal", "unit": "Sq.Mtr", "factor": 1.0,
        "owners": ["Dharmendra Tiwari", "Rashmi Chouhan", "Bhojpal Township Ltd", "Alok Saxena", "Nirmala Jain", "Sanjay Malviya", "Kamal Kant Sharma", "Preeti Shrivastava", "Vinod Raghuwanshi", "Deepika Gour", "Pramod Patel", "Mamta Pandey"]
    },
    "indore": {
        "prefix": "P-64", "start_idx": 1, "ulpin_prefix": "IN-MP-IND-00064",
        "state": "Madhya Pradesh", "jurisdiction": "Madhya Pradesh", "district": "Indore", "tehsil": "Indore",
        "loc_label": "Super Corridor / Vijay Nagar, Indore", "unit": "Sq.Ft", "factor": 0.092903,
        "owners": ["Gaurav Agrawal", "Pooja Khandelwal", "Malwa Tech Enclave", "Yogesh Patidar", "Kavita Rathi", "Sunil Kasliwal", "Bhupendra Hardia", "Jyoti Chordia", "Naveen Porwal", "Shweta Tongia", "Manish Jhanwar", "Reena Sethi"]
    },
    "patna": {
        "prefix": "P-65", "start_idx": 1, "ulpin_prefix": "IN-BR-PAT-00065",
        "state": "Bihar", "jurisdiction": "Bihar", "district": "Patna", "tehsil": "Patna Sadar",
        "loc_label": "Bailey Road / Ganga Pathway, Patna", "unit": "Katha", "factor": 126.46,
        "owners": ["Narendra Prasad Singh", "Sunita Kumari", "Magadh Real Estate", "Brajesh Kumar", "Anita Sinha", "Chandan Mishra", "Abhishek Tiwari", "Sarita Devi", "Ranjan Pandey", "Punam Jha", "Sanjay Keshri", "Archana Verma"]
    },
    "bhubaneswar": {
        "prefix": "P-66", "start_idx": 1, "ulpin_prefix": "IN-OD-BBI-00066",
        "state": "Odisha", "jurisdiction": "Odisha", "district": "Khordha", "tehsil": "Bhubaneswar",
        "loc_label": "Infocity / Chandrasekharpur, Bhubaneswar", "unit": "Decimal", "factor": 40.4686,
        "owners": ["Debabrata Mohanty", "Minati Patnaik", "Kalinga Infotech Trust", "Soumya Ranjan Das", "Pratap Jena", "Tanushree Nayak", "Subrat Behera", "Itishree Samal", "Bibhuti Tripathy", "Manasvi Sahoo", "Bikash Pradhan", "Namrata Roul"]
    },
    "dehradun": {
        "prefix": "P-67", "start_idx": 1, "ulpin_prefix": "IN-UK-DDN-00067",
        "state": "Uttarakhand", "jurisdiction": "Uttarakhand", "district": "Dehradun", "tehsil": "Dehradun",
        "loc_label": "Rajpur Road / Doon Valley, Dehradun", "unit": "Bigha", "factor": 800.0,
        "owners": ["Virendra Singh Rawat", "Meenakshi Joshi", "Garhwal Eco Developers", "Anurag Negi", "Kiran Bisht", "Pradeep Thapa", "Harish Chandra Pant", "Neelam Semwal", "Sohan Lal Uniyal", "Divya Chauhan", "Rajender Nautiyal", "Geeta Bhatt"]
    },
    "guwahati": {
        "prefix": "P-68", "start_idx": 1, "ulpin_prefix": "IN-AS-GHY-00068",
        "state": "Assam", "jurisdiction": "Assam", "district": "Kamrup Metropolitan", "tehsil": "Dispur",
        "loc_label": "GS Road / Brahmaputra Riverside, Guwahati", "unit": "Bigha", "factor": 1337.8,
        "owners": ["Bhupen Hazarika Trust", "Pranab Barua", "Assam Tea Estates Ltd", "Ranjit Gogoi", "Mridula Saikia", "Deepjyoti Kalita", "Partha Sarathi Bora", "Anupama Medhi", "Himangshu Deka", "Monoj Phukan", "Barnali Goswami", "Debajit Sarma"]
    },
    "panaji": {
        "prefix": "P-69", "start_idx": 1, "ulpin_prefix": "IN-GA-PAN-00069",
        "state": "Goa", "jurisdiction": "Goa", "district": "North Goa", "tehsil": "Tiswadi",
        "loc_label": "Miramar Coastal Belt, Panaji", "unit": "Sq.Mtr", "factor": 1.0,
        "owners": ["Antonio Fernandes", "Maria D'Souza", "Goa Coastal Hospitality LLP", "Joao Pinto", "Fatima Alvares", "Francisco Pereira", "Sunita Naik", "Ramesh Kamat", "Bernardo Sequeira", "Carmelita Noronha", "Sachin Kenkre", "Lourdes Coutinho"]
    }
}

SCENARIOS_CYCLE = [
    ("CLEAN_PARCEL", "Clean Verified Title", "Commercial", "Commercial (C-1)"),
    ("PLANNING_REVIEW", "Statutory Planning Review", "Mixed Use", "Commercial / Residential"),
    ("MORTGAGE_LIEN", "Registered Mortgage / Bank Lien", "Residential", "Residential (R-2)"),
    ("ENCUMBERED_PARCEL", "Active Encumbrance Recorded", "Commercial", "Commercial (C-2)"),
    ("TAX_CASE", "Property Tax Compliance Case", "Commercial", "Commercial (C-1)"),
    ("DISPUTED", "Boundary Demarcation Dispute", "Agricultural", "Green / Agricultural"),
    ("RESTRICTION_BUFFER", "Statutory Environmental / Heritage Buffer", "Special / Buffer", "Eco-Sensitive Buffer"),
    ("INFRASTRUCTURE_GAP", "Civic Infrastructure Feasibility Review", "Industrial", "Light Industrial"),
    ("BUILDING_APPROVAL", "Municipal Building Sanction Active", "Residential", "Group Housing (GH-3)"),
    ("OWNERSHIP_REVIEW", "Multi-Party Share Mutation Review", "Residential", "Residential (R-1)")
]

def _build_all_demo_parcels(initial_parcels):
    parcels = list(initial_parcels)
    parcels_by_loc = {}
    for p in parcels:
        parcels_by_loc.setdefault(p["location_id"], []).append(p)

    loc_entities = {l["id"]: l for l in DEMO_LOCATIONS_DATA}

    for loc_id, cfg in LOCATION_CONFIG.items():
        existing = parcels_by_loc.get(loc_id, [])
        needed = 16 - len(existing)
        if needed <= 0:
            continue

        loc_ent = loc_entities[loc_id]
        base_lat = loc_ent["lat"]
        base_lng = loc_ent["lng"]

        for i in range(needed):
            p_num = cfg["start_idx"] + i
            if loc_id == "solan":
                parcel_id = f"P-{p_num}"
                ulpin = f"{cfg['ulpin_prefix']}{p_num:04d}"
            else:
                parcel_id = f"{cfg['prefix']}{p_num:02d}"
                ulpin = f"{cfg['ulpin_prefix']}{p_num:02d}"

            slot = len(existing) + i
            row = (slot // 4) - 1.5
            col = (slot % 4) - 1.5
            c_lat = round(base_lat + (row * 0.0032), 6)
            c_lng = round(base_lng + (col * 0.0038), 6)
            coords = _make_box_polygon(c_lat, c_lng, dlat=0.0009, dlng=0.0011)

            scen_key, scen_disp, land_use, zoning = SCENARIOS_CYCLE[i % len(SCENARIOS_CYCLE)]
            owner_name = cfg["owners"][i % len(cfg["owners"])]
            
            orig_area = round(0.25 + (i * 0.08), 2)
            std_area = round(orig_area * cfg["factor"], 2)

            bp = None
            if i % 2 == 0:
                bp = {
                    "id": f"BP/{loc_id.upper()[:3]}/{2023+i%2}/{100+i}",
                    "status": "Approved" if i % 4 != 0 else "Under Scrutiny",
                    "floors": f"G + {2 + (i%3)}",
                    "date": f"{10+i} Mar 2024"
                }

            enc = None
            if scen_key == "MORTGAGE_LIEN":
                enc = {"status": "Active", "inst": "State Bank of India", "amt": f"₹ {35 + i*5},00,000", "noc": True, "ref": f"MORT-SBI-{p_num}"}
            elif scen_key == "ENCUMBERED_PARCEL":
                enc = {"status": "Active", "inst": "Punjab National Bank", "amt": f"₹ {25 + i*4},00,000", "noc": False, "ref": f"ENC-PNB-{p_num}"}
            else:
                enc = {"status": "Clear"}

            tax = {
                "id": f"PT-{loc_id.upper()[:3]}-2024-{4000+p_num}",
                "status": "Pending" if scen_key == "TAX_CASE" else "Paid",
                "paid": f"₹ {12000 + i*850}",
                "date": f"{5+i} Jul 2024"
            }

            ut = {
                "elec": "Connected" if i % 5 != 0 else "Feasibility Pending",
                "water": "Connected" if i % 4 != 0 else "Pipeline Extension Required",
                "sewer": "Connected" if i % 3 != 0 else "Septic Tank",
                "gas": "Available Nearby"
            }

            p_dict = {
                "parcel_id": parcel_id,
                "ulpin": ulpin,
                "survey_no": f"{p_num}/DEMO",
                "khata_no": f"KH-{600 + p_num}",
                "location": cfg["loc_label"],
                "location_id": loc_id,
                "state": cfg["state"],
                "district": cfg["district"],
                "tehsil": cfg["tehsil"],
                "rural_urban": loc_ent["urban_rural"],
                "original_area": orig_area,
                "original_unit": cfg["unit"],
                "standardized_area": std_area,
                "standardized_unit": "m²",
                "area_display": f"{std_area:,.2f} m²",
                "original_area_display": f"{orig_area} {cfg['unit']}",
                "land_use": land_use,
                "zoning": zoning,
                "jurisdiction": cfg["jurisdiction"],
                "status": "Under Review" if "REVIEW" in scen_key or "DISPUTE" in scen_key else "Verified",
                "sync_status": "Source Verified",
                "data_freshness": "Current",
                "centroid_lat": c_lat,
                "centroid_lng": c_lng,
                "scenario": scen_key,
                "scenario_display": scen_disp,
                "sentinel_available": False,
                "owner": {"name": owner_name, "relation": "s/o Legal Representative", "share": "100%"},
                "coords": coords
            }
            if bp:
                p_dict["bp"] = bp
            if enc:
                p_dict["enc"] = enc
            if tax:
                p_dict["tax"] = tax
            if ut:
                p_dict["ut"] = ut

            parcels.append(p_dict)
    return parcels

DEMO_PARCELS_DATA = _build_all_demo_parcels(INITIAL_CURATED_PARCELS)

# Populate polygon/coords alias for all parcels
for _p in DEMO_PARCELS_DATA:
    if "coords" in _p and "polygon" not in _p:
        _p["polygon"] = _p["coords"]
    elif "polygon" in _p and "coords" not in _p:
        _p["coords"] = _p["polygon"]

# Quick Lookups
DEMO_LOCATIONS_BY_ID = {loc["id"]: loc for loc in DEMO_LOCATIONS_DATA}
DEMO_PARCELS_BY_ULPIN = {p["ulpin"]: p for p in DEMO_PARCELS_DATA}
DEMO_PARCELS_BY_ID = {p["parcel_id"]: p for p in DEMO_PARCELS_DATA}

def get_demo_locations(
    state: Optional[str] = None,
    urban_rural: Optional[str] = None,
    location: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Retrieve demo locations with optional filtering."""
    results = []
    for loc in DEMO_LOCATIONS_DATA:
        if state and state.lower() not in loc["state"].lower():
            continue
        if urban_rural and urban_rural.lower() != loc["urban_rural"].lower():
            continue
        if location and location.lower() not in loc["name"].lower() and location.lower() != loc["id"]:
            continue
        
        # Count parcels for this location
        ulpins = [p["ulpin"] for p in DEMO_PARCELS_DATA if p["location_id"] == loc["id"]]
        
        results.append({
            "id": loc["id"],
            "location_id": loc["id"],
            "name": loc["name"],
            "state": loc["state"],
            "jurisdiction": loc["jurisdiction"],
            "lat": loc["lat"],
            "lng": loc["lng"],
            "urban_rural": loc["urban_rural"],
            "parcel_count": len(ulpins),
            "sample_ulpins": ulpins,
            "description": loc["description"],
            "is_demo": True,
            "sentinel_available": loc["sentinel_available"]
        })
    return results

def get_demo_parcels(
    location: Optional[str] = None,
    state: Optional[str] = None,
    urban_rural: Optional[str] = None,
    scenario: Optional[str] = None,
    ulpin: Optional[str] = None,
    parcel_id: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Retrieve demo parcels with comprehensive filtering."""
    results = []
    for p in DEMO_PARCELS_DATA:
        if location and location.lower() != p["location_id"] and location.lower() not in p["location"].lower():
            continue
        if state and state.lower() not in p["state"].lower():
            continue
        if urban_rural and urban_rural.lower() != p["rural_urban"].lower():
            continue
        if scenario and scenario.upper() != p["scenario"]:
            continue
        if ulpin and ulpin.upper() not in p["ulpin"].upper():
            continue
        if parcel_id and parcel_id.upper() not in p["parcel_id"].upper():
            continue
            
        results.append(p)
    return results

def get_demo_parcel_by_ulpin(ulpin: str) -> Optional[Dict[str, Any]]:
    """Retrieve detailed demo parcel by canonical ULPIN or parcel_id."""
    clean = ulpin.strip()
    return DEMO_PARCELS_BY_ULPIN.get(clean) or DEMO_PARCELS_BY_ID.get(clean)

def search_demo_catalog(query: str) -> List[Dict[str, Any]]:
    """Global query search across demo catalogue."""
    q = query.strip().lower()
    matches = []
    for p in DEMO_PARCELS_DATA:
        if (
            q in p["ulpin"].lower() or
            q in p["parcel_id"].lower() or
            q in p["location"].lower() or
            q in p["state"].lower() or
            q in p["scenario"].lower() or
            q in p["rural_urban"].lower() or
            q in p["land_use"].lower()
        ):
            matches.append({
                "type": "Demo Parcel",
                "parcel_id": p["parcel_id"],
                "ulpin": p["ulpin"],
                "location": p["location"],
                "state": p["state"],
                "urban_rural": p["rural_urban"],
                "scenario": p["scenario"],
                "scenario_display": p["scenario_display"],
                "description": f"{p['land_use']} parcel in {p['location']} ({p['area_display']}) demonstrating {p['scenario_display']}.",
                "is_demo": True
            })
    return matches

# Export convenience aliases
DEMO_LOCATIONS = DEMO_LOCATIONS_DATA
DEMO_PARCELS = DEMO_PARCELS_DATA
