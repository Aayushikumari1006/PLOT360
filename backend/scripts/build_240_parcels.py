"""
PLOT360 — Generator for authoritative 240 demo parcels (16 parcels × 15 locations).
Preserves existing 37 curated parcels verbatim, generates remainder deterministically.
"""
import sys
import os
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.services.demo_catalog_data import DEMO_LOCATIONS_DATA, DEMO_PARCELS_DATA, SCENARIO_DISPLAY_MAP, _make_box_polygon

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

def generate():
    all_parcels = list(DEMO_PARCELS_DATA)
    parcels_by_loc = {}
    for p in all_parcels:
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

            all_parcels.append(p_dict)

    print(f"Total generated parcels: {len(all_parcels)}")
    from collections import Counter
    c = Counter(p["location_id"] for p in all_parcels)
    print("Parcels per location:", dict(c))
    
    pids = [p["parcel_id"] for p in all_parcels]
    ulpins = [p["ulpin"] for p in all_parcels]
    assert len(pids) == len(set(pids)), f"Duplicate parcel_id found! {len(pids)} vs {len(set(pids))}"
    assert len(ulpins) == len(set(ulpins)), f"Duplicate ulpin found! {len(ulpins)} vs {len(set(ulpins))}"
    assert len(all_parcels) == 240, f"Expected 240 parcels, got {len(all_parcels)}"
    print("VERIFICATION PASSED: 240 unique parcels (16 per location across all 15 locations).")
    return all_parcels

if __name__ == "__main__":
    generate()
