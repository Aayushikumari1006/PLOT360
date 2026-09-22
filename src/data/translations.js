/**
 * PLOT360 Multilingual Translation Dictionary
 * Comprehensive localizations for English (en), Hindi (hi), Punjabi (pa), and Marathi (mr).
 * Designed for official Land Governance Platform terminology.
 */

export const TRANSLATIONS = {
  en: {
    // Navigation
    'nav.explorer': 'Land Explorer',
    'nav.intelligence': 'Parcel Intelligence',
    'nav.records': 'Governance & Records',
    'nav.planning': 'Planning & Development',
    'nav.citizen': 'Citizen Services',
    'nav.analytics': 'Analytics & AI',
    'nav.integrations': 'Integration Hub',
    'nav.admin': 'Administration & Security',
    'nav.health': 'System / Data Health',
    'nav.presentation': 'Presentation Mode',
    'nav.help': 'Help & Documentation',
    'nav.profile': 'User Profile',

    // Topbar
    'topbar.platformTitle': 'Integrated Land Governance Platform',
    'topbar.jurisdiction': 'Jurisdiction',
    'topbar.location': 'Location',
    'topbar.role': 'Role',
    'topbar.searchPlaceholder': 'Search by ULPIN, Parcel ID, Location, Survey No...',
    'topbar.noResults': 'No results found for "{query}"',
    'topbar.notifications': 'Notifications',
    'topbar.theme': 'Toggle Theme',
    'topbar.device': 'Device View',

    // KPI / Dashboard
    'kpi.parcels': 'Parcels',
    'kpi.parcelsSub': 'Verified in System',
    'kpi.datasets': 'Integrated Datasets',
    'kpi.datasetsSub': 'Cross-Department Linked',
    'kpi.conflicts': 'Data Conflicts',
    'kpi.conflictsSub': 'Flagged for Resolution',
    'kpi.alerts': 'AI / Change Alerts',
    'kpi.alertsSub': 'Temporal Change Detection',
    'kpi.connections': 'Department Connectors',
    'kpi.connectionsSub': 'Simulated API Links Active',

    // Parcel Details & Tabs
    'parcel.tab.overview': 'Overview',
    'parcel.tab.records': 'Land Records (RoR)',
    'parcel.tab.gis': 'Spatial & Cadastral',
    'parcel.tab.planning': 'Planning & Zoning',
    'parcel.tab.tax': 'Revenue & Taxation',
    'parcel.tab.legal': 'Legal & Encumbrance',
    'parcel.tab.utilities': 'Utilities & Infra',
    'parcel.tab.audit': 'Timeline & Audit',

    // Field Labels
    'field.ulpin': 'Unique Land Parcel ID (ULPIN)',
    'field.parcelId': 'Parcel Identifier',
    'field.surveyNo': 'Survey / Khasra No',
    'field.khataNo': 'Khata / Account No',
    'field.standardArea': 'Standardized Area',
    'field.originalArea': 'Revenue Measured Area',
    'field.landUse': 'Current Land Use',
    'field.zoning': 'Zoning Classification',
    'field.status': 'Governance Status',
    'field.verification': 'Verification State',
    'field.owner': 'Recorded Owner',
    'field.share': 'Ownership Share',
    'field.tehsil': 'Tehsil / Taluk',
    'field.district': 'District',
    'field.state': 'State / UT',
    'field.scenario': 'Study Scenario',

    // Status Values & Badges
    'status.verified': 'Verified',
    'status.sourceVerified': 'Source Verified',
    'status.underReview': 'Under Review',
    'status.conflict': 'Conflict Flagged',
    'status.pending': 'Pending Review',
    'status.active': 'Active',
    'status.approved': 'Sanctioned / Approved',
    'status.paid': 'Tax Paid',
    'status.demoTag': 'DEMO / ILLUSTRATIVE DATA',
    'status.sentinelAvailable': 'Active Sentinel-2 Change Analysis',
    'status.sentinelNotAvailable': 'Sentinel-2 Evidence: Not Available',

    // Scenarios
    'scenario.AI_CHANGE_REVIEW': 'AI Temporal Change Review',
    'scenario.CLEAN_PARCEL': 'Clean Verified Title',
    'scenario.PLANNING_REVIEW': 'Statutory Planning Review',
    'scenario.MORTGAGE_LIEN': 'Registered Mortgage / Bank Lien',
    'scenario.ENCUMBERED_PARCEL': 'Active Encumbrance Recorded',
    'scenario.TAX_CASE': 'Property Tax Compliance Case',
    'scenario.DISPUTED': 'Boundary Demarcation Dispute',
    'scenario.RESTRICTION_BUFFER': 'Statutory Environmental / Heritage Buffer',
    'scenario.INFRASTRUCTURE_GAP': 'Civic Infrastructure Feasibility Review',
    'scenario.BUILDING_APPROVAL': 'Municipal Building Sanction Active',
    'scenario.OWNERSHIP_REVIEW': 'Multi-Party Share Mutation Review',

    // GIS Layers & Controls
    'gis.layer.parcels': 'Cadastral Parcels',
    'gis.layer.boundaries': 'Administrative Boundaries',
    'gis.layer.zoning': 'Zoning Master Plan',
    'gis.layer.satellite': 'High-Res Satellite Base',
    'gis.layer.revenue': 'Revenue Survey Grid',
    'gis.layer.utilities': 'Civic Utilities Grid',
    'gis.layer.protected': 'Environmental Buffer Zones',
    'gis.clickToSelect': 'Click any parcel polygon to load dossier',

    // Actions & Buttons
    'action.viewRecords': 'View Land Records',
    'action.checkZoning': 'Check Zoning',
    'action.applyPermission': 'Apply for Permission',
    'action.checkEncumbrance': 'Check Encumbrance',
    'action.generateReport': 'Generate Report',
    'action.verifyField': 'Log Site Inspection',
    'action.auditLedger': 'View Immutable Audit Ledger',
    'action.close': 'Close',
    'action.download': 'Download Dossier',
    'action.filter': 'Filter Results',

    // Truthful Status Phrases
    'msg.loggedAudit': 'Logged to the PLOT360 land audit trail',
    'msg.dataAvailable': 'Data Available',
    'msg.sourceMetadata': 'Source Metadata Available',
    'msg.simulatedConnector': 'Simulated Demo Connector',
    'msg.requiresReview': 'Record Requires Field Review'
  },

  hi: {
    // Navigation
    'nav.explorer': 'भूमि अन्वेषक',
    'nav.intelligence': 'भूखंड प्रज्ञा (पार्सल)',
    'nav.records': 'अभिशासन एवं अभिलेख',
    'nav.planning': 'नियोजन एवं विकास',
    'nav.citizen': 'नागरिक सेवाएं',
    'nav.analytics': 'विश्लेषिकी एवं एआई',
    'nav.integrations': 'एकीकरण केंद्र',
    'nav.admin': 'प्रशासन एवं सुरक्षा',
    'nav.health': 'प्रणाली / डेटा स्वास्थ्य',
    'nav.presentation': 'प्रस्तुति मोड',
    'nav.help': 'सहायता एवं प्रलेखन',
    'nav.profile': 'उपयोगकर्ता प्रोफ़ाइल',

    // Topbar
    'topbar.platformTitle': 'एकीकृत भूमि अभिशासन मंच',
    'topbar.jurisdiction': 'अधिकार क्षेत्र',
    'topbar.location': 'स्थान',
    'topbar.role': 'भूमिका',
    'topbar.searchPlaceholder': 'यूलपिन (ULPIN), भूखंड आईडी, स्थान या खसरा संख्या से खोजें...',
    'topbar.noResults': '"{query}" के लिए कोई परिणाम नहीं मिला',
    'topbar.notifications': 'सूचनाएं',
    'topbar.theme': 'थीम बदलें',
    'topbar.device': 'डिवाइस दृश्य',

    // KPI / Dashboard
    'kpi.parcels': 'भूखंड (पार्सल)',
    'kpi.parcelsSub': 'प्रणाली में सत्यापित',
    'kpi.datasets': 'एकीकृत डेटासेट',
    'kpi.datasetsSub': 'अंतर-विभागीय लिंक्ड',
    'kpi.conflicts': 'डेटा विसंगतियां',
    'kpi.conflictsSub': 'समाधान हेतु चिह्नित',
    'kpi.alerts': 'एआई / परिवर्तन अलर्ट',
    'kpi.alertsSub': 'कालिक उपग्रह परिवर्तन',
    'kpi.connections': 'विभागीय कनेक्टर',
    'kpi.connectionsSub': 'सिम्युलेटेड एपीआई सक्रिय',

    // Parcel Details & Tabs
    'parcel.tab.overview': 'अवलोकन',
    'parcel.tab.records': 'अभिलेख (RoR/जमाबंदी)',
    'parcel.tab.gis': 'स्थानिक एवं कैडस्ट्रल',
    'parcel.tab.planning': 'नियोजन एवं ज़ोनिंग',
    'parcel.tab.tax': 'राजस्व एवं संपत्ति कर',
    'parcel.tab.legal': 'कानूनी एवं भार (ऋण)',
    'parcel.tab.utilities': 'जनोपयोगी सुविधाएं',
    'parcel.tab.audit': 'समयक्रम एवं ऑडिट',

    // Field Labels
    'field.ulpin': 'विशिष्ट भूखंड पहचान संख्या (ULPIN)',
    'field.parcelId': 'भूखंड पहचानकर्ता (ID)',
    'field.surveyNo': 'खसरा / सर्वेक्षण संख्या',
    'field.khataNo': 'खाता / खाता खतौनी',
    'field.standardArea': 'मानकीकृत क्षेत्रफल',
    'field.originalArea': 'राजस्व मापित क्षेत्रफल',
    'field.landUse': 'वर्तमान भूमि उपयोग',
    'field.zoning': 'ज़ोनिंग वर्गीकरण',
    'field.status': 'अभिशासन स्थिति',
    'field.verification': 'सत्यापन स्थिति',
    'field.owner': 'अभिलेखित स्वामी',
    'field.share': 'स्वामित्व अंश',
    'field.tehsil': 'तहसील / तालुका',
    'field.district': 'ज़िला',
    'field.state': 'राज्य / केंद्र शासित प्रदेश',
    'field.scenario': 'अध्ययन परिदृश्य',

    // Status Values & Badges
    'status.verified': 'सत्यापित',
    'status.sourceVerified': 'स्रोत सत्यापित',
    'status.underReview': 'समीक्षाधीन',
    'status.conflict': 'विसंगति चिह्नित',
    'status.pending': 'लंबित',
    'status.active': 'सक्रिय',
    'status.approved': 'स्वीकृत / स्वीकृत नक्शा',
    'status.paid': 'कर भुगतान पूर्ण',
    'status.demoTag': 'डेमो / उदाहरणात्मक डेटा',
    'status.sentinelAvailable': 'सक्रिय सेंटिनल-2 उपग्रह परिवर्तन विश्लेषण',
    'status.sentinelNotAvailable': 'सेंटिनल-2 उपग्रह साक्ष्य: उपलब्ध नहीं',

    // Scenarios
    'scenario.AI_CHANGE_REVIEW': 'एआई कालिक परिवर्तन समीक्षा',
    'scenario.CLEAN_PARCEL': 'सत्यापित स्पष्ट स्वामित्व',
    'scenario.PLANNING_REVIEW': 'सांविधिक नगर नियोजन समीक्षा',
    'scenario.MORTGAGE_LIEN': 'पंजीकृत बंधक / बैंक लियन',
    'scenario.ENCUMBERED_PARCEL': 'सक्रिय भार दर्ज',
    'scenario.TAX_CASE': 'संपत्ति कर अनुपालन मामला',
    'scenario.DISPUTED': 'सीमा सीमांकन विवाद',
    'scenario.RESTRICTION_BUFFER': 'सांविधिक पर्यावरण / धरोहर बफर',
    'scenario.INFRASTRUCTURE_GAP': 'नागरिक अवसंरचना व्यवहार्यता समीक्षा',
    'scenario.BUILDING_APPROVAL': 'नगरपालिका भवन निर्माण स्वीकृति सक्रिय',
    'scenario.OWNERSHIP_REVIEW': 'बहु-पक्षीय अंश नामांतरण समीक्षा',

    // GIS Layers & Controls
    'gis.layer.parcels': 'कैडस्ट्रल भूखंड',
    'gis.layer.boundaries': 'प्रशासनिक सीमाएं',
    'gis.layer.zoning': 'ज़ोनिंग मास्टर प्लान',
    'gis.layer.satellite': 'उच्च-रिज़ॉल्यूशन उपग्रह बेस',
    'gis.layer.revenue': 'राजस्व सर्वेक्षण ग्रिड',
    'gis.layer.utilities': 'जनोपयोगी अवसंरचना',
    'gis.layer.protected': 'पर्यावरण बफर क्षेत्र',
    'gis.clickToSelect': 'डोज़ियर लोड करने के लिए किसी भी भूखंड पर क्लिक करें',

    // Actions & Buttons
    'action.viewRecords': 'भूमि अभिलेख देखें',
    'action.checkZoning': 'ज़ोनिंग जांचें',
    'action.applyPermission': 'अनुमति हेतु आवेदन करें',
    'action.checkEncumbrance': 'भार / ऋण जांचें',
    'action.generateReport': 'रिपोर्ट तैयार करें',
    'action.verifyField': 'साइट निरीक्षण दर्ज करें',
    'action.auditLedger': 'ऑडिट लेजर देखें',
    'action.close': 'बंद करें',
    'action.download': 'डोज़ियर डाउनलोड करें',
    'action.filter': 'परिणाम फ़िल्टर करें',

    // Truthful Status Phrases
    'msg.loggedAudit': 'PLOT360 भूमि ऑडिट ट्रेल में दर्ज किया गया',
    'msg.dataAvailable': 'डेटा उपलब्ध है',
    'msg.sourceMetadata': 'स्रोत मेटाडेटा उपलब्ध है',
    'msg.simulatedConnector': 'सिम्युलेटेड डेमो कनेक्टर',
    'msg.requiresReview': 'अभिलेख को क्षेत्रीय सत्यापन की आवश्यकता है'
  },

  pa: {
    // Navigation
    'nav.explorer': 'ਜ਼ਮੀਨ ਐਕਸਪਲੋਰਰ',
    'nav.intelligence': 'ਪਲਾਟ ਇੰਟੈਲੀਜੈਂਸ (ਪਾਰਸਲ)',
    'nav.records': 'ਗਵਰਨੈਂਸ ਅਤੇ ਰਿਕਾਰਡ',
    'nav.planning': 'ਯੋਜਨਾਬੰਦੀ ਅਤੇ ਵਿਕਾਸ',
    'nav.citizen': 'ਨਾਗਰਿਕ ਸੇਵਾਵਾਂ',
    'nav.analytics': 'ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਏ.ਆਈ.',
    'nav.integrations': 'ਏਕੀਕਰਣ ਹੱਬ',
    'nav.admin': 'ਪ੍ਰਸ਼ਾਸਨ ਅਤੇ ਸੁਰੱਖਿਆ',
    'nav.health': 'ਸਿਸਟਮ / ਡੇਟਾ ਸਿਹਤ',
    'nav.presentation': 'ਪੇਸ਼ਕਾਰੀ ਮੋਡ',
    'nav.help': 'ਸਹਾਇਤਾ ਅਤੇ ਦਸਤਾਵੇਜ਼',
    'nav.profile': 'ਉਪਭੋਗਤਾ ਪ੍ਰੋਫਾਈਲ',

    // Topbar
    'topbar.platformTitle': 'ਏਕੀਕ੍ਰਿਤ ਜ਼ਮੀਨੀ ਪ੍ਰਸ਼ਾਸਨ ਪਲੇਟਫਾਰਮ',
    'topbar.jurisdiction': 'ਅਧਿਕਾਰ ਖੇਤਰ',
    'topbar.location': 'ਸਥਾਨ',
    'topbar.role': 'ਭੂਮਿਕਾ',
    'topbar.searchPlaceholder': 'ਯੂ.ਐਲ.ਪੀ.ਆਈ.ਐਨ, ਪਲਾਟ ਆਈਡੀ, ਸਥਾਨ ਜਾਂ ਖਸਰਾ ਨੰਬਰ ਨਾਲ ਖੋਜੋ...',
    'topbar.noResults': '"{query}" ਲਈ ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ ਮਿਲਿਆ',
    'topbar.notifications': 'ਸੂਚਨਾਵਾਂ',
    'topbar.theme': 'ਥੀਮ ਬਦਲੋ',
    'topbar.device': 'ਡਿਵਾਈਸ ਦ੍ਰਿਸ਼',

    // KPI / Dashboard
    'kpi.parcels': 'ਪਲਾਟ / ਪਾਰਸਲ',
    'kpi.parcelsSub': 'ਸਿਸਟਮ ਵਿੱਚ ਪ੍ਰਮਾਣਿਤ',
    'kpi.datasets': 'ਏਕੀਕ੍ਰਿਤ ਡੇਟਾਸੈਟ',
    'kpi.datasetsSub': 'ਅੰਤਰ-ਵਿਭਾਗੀ ਲਿੰਕਡ',
    'kpi.conflicts': 'ਡੇਟਾ ਵਿਵਾਦ',
    'kpi.conflictsSub': 'ਹੱਲ ਲਈ ਚਿੰਨ੍ਹਿਤ',
    'kpi.alerts': 'ਏ.ਆਈ. ਤਬਦੀਲੀ ਚੇਤਾਵਨੀਆਂ',
    'kpi.alertsSub': 'ਸਮਾਂਬੱਧ ਉਪਗ੍ਰਹਿ ਤਬਦੀਲੀ ਖੋਜ',
    'kpi.connections': 'ਵਿਭਾਗੀ ਕਨੈਕਟਰ',
    'kpi.connectionsSub': 'ਸਿਮੂਲੇਟਡ ਏ.ਪੀ.ਆਈ. ਸਰਗਰਮ',

    // Parcel Details & Tabs
    'parcel.tab.overview': 'ਸੰਖੇਪ ਜਾਣਕਾਰੀ',
    'parcel.tab.records': 'ਜ਼ਮੀਨੀ ਰਿਕਾਰਡ (ਜਮ੍ਹਾਂਬੰਦੀ)',
    'parcel.tab.gis': 'ਸਥਾਨਕ ਅਤੇ ਨਕਸ਼ਾ',
    'parcel.tab.planning': 'ਯੋਜਨਾਬੰਦੀ ਅਤੇ ਜ਼ੋਨਿੰਗ',
    'parcel.tab.tax': 'ਮਾਲੀਆ ਅਤੇ ਜਾਇਦਾਦ ਟੈਕਸ',
    'parcel.tab.legal': 'ਕਾਨੂੰਨੀ ਅਤੇ ਦੇਣਦਾਰੀ/ਰਹਿਣ',
    'parcel.tab.utilities': 'ਨਾਗਰਿਕ ਸਹੂਲਤਾਂ',
    'parcel.tab.audit': 'ਸਮਾਂ-ਰੇਖਾ ਅਤੇ ਆਡਿਟ',

    // Field Labels
    'field.ulpin': 'ਵਿਲੱਖਣ ਜ਼ਮੀਨ ਪਾਰਸਲ ਪਛਾਣ ਨੰਬਰ (ULPIN)',
    'field.parcelId': 'ਪਲਾਟ ਪਛਾਣਕਰਤਾ (ID)',
    'field.surveyNo': 'ਖਸਰਾ / ਸਰਵੇਖਣ ਨੰਬਰ',
    'field.khataNo': 'ਖਾਤਾ / ਖਤੌਨੀ ਨੰਬਰ',
    'field.standardArea': 'ਮਿਆਰੀ ਖੇਤਰਫਲ',
    'field.originalArea': 'ਮਾਲੀਆ ਮਿਣਿਆ ਖੇਤਰਫਲ',
    'field.landUse': 'ਮੌਜੂਦਾ ਜ਼ਮੀਨ ਵਰਤੋਂ',
    'field.zoning': 'ਜ਼ੋਨਿੰਗ ਵਰਗੀਕਰਨ',
    'field.status': 'ਗਵਰਨੈਂਸ ਸਥਿਤੀ',
    'field.verification': 'ਪ੍ਰਮਾਣੀਕਰਨ ਸਥਿਤੀ',
    'field.owner': 'ਦਰਜ ਮਾਲਕ',
    'field.share': 'ਮਾਲਕੀ ਹਿੱਸਾ',
    'field.tehsil': 'ਤਹਿਸੀਲ',
    'field.district': 'ਜ਼ਿਲ੍ਹਾ',
    'field.state': 'ਰਾਜ / ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼',
    'field.scenario': 'ਅਧਿਐਨ ਦ੍ਰਿਸ਼',

    // Status Values & Badges
    'status.verified': 'ਤਸਦੀਕਸ਼ੁਦਾ',
    'status.sourceVerified': 'ਸਰੋਤ ਤਸਦੀਕਸ਼ੁਦਾ',
    'status.underReview': 'ਸਮੀਖਿਆ ਅਧੀਨ',
    'status.conflict': 'ਵਿਵਾਦ ਚਿੰਨ੍ਹਿਤ',
    'status.pending': 'ਬਕਾਇਆ',
    'status.active': 'ਸਰਗਰਮ',
    'status.approved': 'ਮਨਜ਼ੂਰਸ਼ੁਦਾ',
    'status.paid': 'ਟੈਕਸ ਅਦਾ ਕੀਤਾ',
    'status.demoTag': 'ਨਮੂਨਾ / ਡੈਮੋ ਡੇਟਾ',
    'status.sentinelAvailable': 'ਸਰਗਰਮ ਸੈਂਟੀਨਲ-2 ਉਪਗ੍ਰਹਿ ਤਬਦੀਲੀ ਵਿਸ਼ਲੇਸ਼ਣ',
    'status.sentinelNotAvailable': 'ਸੈਂਟੀਨਲ-2 ਉਪਗ੍ਰਹਿ ਸਬੂਤ: ਉਪਲਬਧ ਨਹੀਂ',

    // Scenarios
    'scenario.AI_CHANGE_REVIEW': 'ਏਆਈ ਸਮਾਂਬੱਧ ਤਬਦੀਲੀ ਸਮੀਖਿਆ',
    'scenario.CLEAN_PARCEL': 'ਤਸਦੀਕਸ਼ੁਦਾ ਸਾਫ਼ ਮਾਲਕੀ',
    'scenario.PLANNING_REVIEW': 'ਨਗਰ ਯੋਜਨਾਬੰਦੀ ਸਮੀਖਿਆ',
    'scenario.MORTGAGE_LIEN': 'ਰਜਿਸਟਰਡ ਰਹਿਣ / ਬੈਂਕ ਲੀਅਨ',
    'scenario.ENCUMBERED_PARCEL': 'ਸਰਗਰਮ ਦੇਣਦਾਰੀ ਦਰਜ',
    'scenario.TAX_CASE': 'ਜਾਇਦਾਦ ਟੈਕਸ ਪਾਲਣਾ ਮਾਮਲਾ',
    'scenario.DISPUTED': 'ਹੱਦਬੰਦੀ ਨਿਸ਼ਾਨਦੇਹੀ ਝਗੜਾ',
    'scenario.RESTRICTION_BUFFER': 'ਵਾਤਾਵਰਣ / ਵਿਰਾਸਤੀ ਬਫ਼ਰ ਪਾਬੰਦੀ',
    'scenario.INFRASTRUCTURE_GAP': 'ਨਾਗਰਿਕ ਬੁਨਿਆਦੀ ਢਾਂਚਾ ਸੰਭਾਵਨਾ ਸਮੀਖਿਆ',
    'scenario.BUILDING_APPROVAL': 'ਮਿਊਂਸੀਪਲ ਇਮਾਰਤ ਮਨਜ਼ੂਰੀ ਸਰਗਰਮ',
    'scenario.OWNERSHIP_REVIEW': 'ਸਾਂਝੀ ਮਾਲਕੀ ਇੰਤਕਾਲ ਸਮੀਖਿਆ',

    // GIS Layers & Controls
    'gis.layer.parcels': 'ਕੈਡਸਟਰਲ ਪਲਾਟ',
    'gis.layer.boundaries': 'ਪ੍ਰਸ਼ਾਸਕੀ ਹੱਦਾਂ',
    'gis.layer.zoning': 'ਜ਼ੋਨਿੰਗ ਮਾਸਟਰ ਪਲਾਨ',
    'gis.layer.satellite': 'ਹਾਈ-ਰੈਜ਼ੋਲਿਊਸ਼ਨ ਸੈਟੇਲਾਈਟ',
    'gis.layer.revenue': 'ਮਾਲੀਆ ਸਰਵੇ ਗਰਿੱਡ',
    'gis.layer.utilities': 'ਨਾਗਰਿਕ ਉਪਯੋਗਤਾਵਾਂ',
    'gis.layer.protected': 'ਵਾਤਾਵਰਣ ਬਫਰ ਖੇਤਰ',
    'gis.clickToSelect': 'ਵੇਰਵੇ ਦੇਖਣ ਲਈ ਕਿਸੇ ਵੀ ਪਲਾਟ ਉੱਤੇ ਕਲਿੱਕ ਕਰੋ',

    // Actions & Buttons
    'action.viewRecords': 'ਜ਼ਮੀਨੀ ਰਿਕਾਰਡ ਦੇਖੋ',
    'action.checkZoning': 'ਜ਼ੋਨਿੰਗ ਚੈੱਕ ਕਰੋ',
    'action.applyPermission': 'ਮਨਜ਼ੂਰੀ ਲਈ ਅਰਜ਼ੀ ਦਿਓ',
    'action.checkEncumbrance': 'ਦੇਣਦਾਰੀ / ਰਹਿਣ ਚੈੱਕ ਕਰੋ',
    'action.generateReport': 'ਰਿਪੋਰਟ ਤਿਆਰ ਕਰੋ',
    'action.verifyField': 'ਸਾਈਟ ਨਿਰੀਖਣ ਦਰਜ ਕਰੋ',
    'action.auditLedger': 'ਆਡਿਟ ਲੇਜਰ ਦੇਖੋ',
    'action.close': 'ਬੰਦ ਕਰੋ',
    'action.download': 'ਡਾਊਨਲੋਡ ਕਰੋ',
    'action.filter': 'ਫਿਲਟਰ ਕਰੋ',

    // Truthful Status Phrases
    'msg.loggedAudit': 'PLOT360 ਆਡਿਟ ਟ੍ਰੇਲ ਵਿੱਚ ਦਰਜ ਕੀਤਾ ਗਿਆ',
    'msg.dataAvailable': 'ਡੇਟਾ ਉਪਲਬਧ ਹੈ',
    'msg.sourceMetadata': 'ਸਰੋਤ ਮੈਟਾਡੇਟਾ ਉਪਲਬਧ ਹੈ',
    'msg.simulatedConnector': 'ਸਿਮੂਲੇਟਡ ਡੈਮੋ ਕਨੈਕਟਰ',
    'msg.requiresReview': 'ਰਿਕਾਰਡ ਦੀ ਫੀਲਡ ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ ਹੈ'
  },

  mr: {
    // Navigation
    'nav.explorer': 'जमीन अन्वेषक',
    'nav.intelligence': 'भूखंड बुद्धिमत्ता (पार्सल)',
    'nav.records': 'प्रशासन आणि अभिलेख',
    'nav.planning': 'नियोजन आणि विकास',
    'nav.citizen': 'नागरी सेवा',
    'nav.analytics': 'विश्लेषण आणि एआय',
    'nav.integrations': 'एकीकरण केंद्र',
    'nav.admin': 'प्रशासन आणि सुरक्षा',
    'nav.health': 'प्रणाली / डेटा आरोग्य',
    'nav.presentation': 'सादरीकरण मोड',
    'nav.help': 'मदत आणि दस्तऐवजीकरण',
    'nav.profile': 'वापरकर्ता प्रोफाइल',

    // Topbar
    'topbar.platformTitle': 'एकात्मिक भूमी प्रशासन मंच',
    'topbar.jurisdiction': 'अधिकार क्षेत्र',
    'topbar.location': 'स्थान',
    'topbar.role': 'भूमिका',
    'topbar.searchPlaceholder': 'युलपिन (ULPIN), भूखंड आयडी, स्थान किंवा सर्व्हे क्रमांकाने शोधा...',
    'topbar.noResults': '"{query}" साठी कोणतेही निकाल आढळले नाहीत',
    'topbar.notifications': 'सूचना',
    'topbar.theme': 'थीम बदला',
    'topbar.device': 'डिव्हाइस दृश्य',

    // KPI / Dashboard
    'kpi.parcels': 'भूखंड (पार्सल)',
    'kpi.parcelsSub': 'प्रणालीमध्ये सत्यापित',
    'kpi.datasets': 'एकात्मिक डेटासंच',
    'kpi.datasetsSub': 'आंतर-विभागीय जोडलेले',
    'kpi.conflicts': 'डेटा विसंगती',
    'kpi.conflictsSub': 'निवारणासाठी चिन्हांकित',
    'kpi.alerts': 'एआय बदल सूचना',
    'kpi.alertsSub': 'कालिक उपग्रह बदल शोध',
    'kpi.connections': 'विभागीय कनेक्टर',
    'kpi.connectionsSub': 'सिम्युलेटेड एपीआय सक्रिय',

    // Parcel Details & Tabs
    'parcel.tab.overview': 'आढावा',
    'parcel.tab.records': 'भूमी अभिलेख (७/१२ उतारा)',
    'parcel.tab.gis': 'स्थानिक आणि नकाशा',
    'parcel.tab.planning': 'नियोजन आणि झोनिंग',
    'parcel.tab.tax': 'महसूल आणि मालमत्ता कर',
    'parcel.tab.legal': 'कायदेशीर आणि बोजा (कर्ज)',
    'parcel.tab.utilities': 'नागरी सुविधा',
    'parcel.tab.audit': 'वेळरेषा आणि ऑडिट',

    // Field Labels
    'field.ulpin': 'विशिष्ट भूखंड ओळख क्रमांक (ULPIN)',
    'field.parcelId': 'भूखंड ओळखकर्ता (ID)',
    'field.surveyNo': 'सर्व्हे / गट क्रमांक',
    'field.khataNo': 'खाते क्रमांक',
    'field.standardArea': 'प्रमाणित क्षेत्रफळ',
    'field.originalArea': 'महसूल मोजणी क्षेत्रफळ',
    'field.landUse': 'सद्य जमीन वापर',
    'field.zoning': 'झोनिंग वर्गीकरण',
    'field.status': 'प्रशासन स्थिती',
    'field.verification': 'पडताळणी स्थिती',
    'field.owner': 'नोंदणीकृत मालक',
    'field.share': 'मालकी हिस्सा',
    'field.tehsil': 'तालुका',
    'field.district': 'जिल्हा',
    'field.state': 'राज्य / केंद्रशासित प्रदेश',
    'field.scenario': 'अभ्यास परिस्थिती',

    // Status Values & Badges
    'status.verified': 'सत्यापित',
    'status.sourceVerified': 'स्रोत सत्यापित',
    'status.underReview': 'पुनरावलोकनाधीन',
    'status.conflict': 'विसंगती चिन्हांकित',
    'status.pending': 'प्रलंबित',
    'status.active': 'सक्रिय',
    'status.approved': 'मंजूर बांधकाम परवाना',
    'status.paid': 'कर भरणा पूर्ण',
    'status.demoTag': 'डेमो / उदाहरणात्मक डेटा',
    'status.sentinelAvailable': 'सक्रिय सेंटिनेल-२ उपग्रह बदल विश्लेषण',
    'status.sentinelNotAvailable': 'सेंटिनेल-२ उपग्रह पुरावा: उपलब्ध नाही',

    // Scenarios
    'scenario.AI_CHANGE_REVIEW': 'एआय कालिक बदल पुनरावलोकन',
    'scenario.CLEAN_PARCEL': 'पडताळणी झालेले निर्दोष शीर्षक',
    'scenario.PLANNING_REVIEW': 'वैधानिक नियोजन पुनरावलोकन',
    'scenario.MORTGAGE_LIEN': 'नोंदणीकृत तारण / बँक धारणाधिकार',
    'scenario.ENCUMBERED_PARCEL': 'सक्रिय बोजा नोंदवलेला',
    'scenario.TAX_CASE': 'मालमत्ता कर अनुपालन प्रकरण',
    'scenario.DISPUTED': 'सीमा रेखांकन वाद',
    'scenario.RESTRICTION_BUFFER': 'वैधानिक पर्यावरण / वारसा बफर',
    'scenario.INFRASTRUCTURE_GAP': 'नागरी पायाभूत सुविधा व्यवहार्यता पुनरावलोकन',
    'scenario.BUILDING_APPROVAL': 'नगरपालिका इमारत मंजुरी सक्रिय',
    'scenario.OWNERSHIP_REVIEW': 'बहु-पक्षीय हिस्सा फेरफार पुनरावलोकन',

    // GIS Layers & Controls
    'gis.layer.parcels': 'कॅडस्ट्रल भूखंड',
    'gis.layer.boundaries': 'प्रशासकीय सीमा',
    'gis.layer.zoning': 'झोनिंग मास्टर प्लॅन',
    'gis.layer.satellite': 'उच्च-रिझोल्यूशन उपग्रह तळ',
    'gis.layer.revenue': 'महसूल सर्व्हे ग्रिड',
    'gis.layer.utilities': 'नागरी सुविधा ग्रिड',
    'gis.layer.protected': 'पर्यावरण बफर क्षेत्र',
    'gis.clickToSelect': 'डोसियर उघडण्यासाठी नकाशावरील भूखंडावर क्लिक करा',

    // Actions & Buttons
    'action.viewRecords': 'भूमी अभिलेख पहा',
    'action.checkZoning': 'झोनिंग तपासा',
    'action.applyPermission': 'परवानगीसाठी अर्ज करा',
    'action.checkEncumbrance': 'बोजा / कर्ज तपासा',
    'action.generateReport': 'अहवाल तयार करा',
    'action.verifyField': 'स्थळ पाहणी नोंदवा',
    'action.auditLedger': 'ऑडिट लेजर पहा',
    'action.close': 'बंद करा',
    'action.download': 'डाउनलोड करा',
    'action.filter': 'फिल्टर करा',

    // Truthful Status Phrases
    'msg.loggedAudit': 'PLOT360 भूमी ऑडिट ट्रेलमध्ये नोंदवले गेले',
    'msg.dataAvailable': 'डेटा उपलब्ध आहे',
    'msg.sourceMetadata': 'स्रोत मेटाडेटा उपलब्ध आहे',
    'msg.simulatedConnector': 'सिम्युलेटेड डेमो कनेक्टर',
    'msg.requiresReview': 'अभिलेख स्थळ पडताळणी आवश्यक'
  }
};

/**
 * Translate a key into the target language with fallback to English and parameter replacement.
 * @param {string} lang - 'en' | 'hi' | 'pa' | 'mr'
 * @param {string} key - translation key like 'nav.explorer'
 * @param {Record<string, any>} [params] - optional interpolation parameters
 * @returns {string}
 */
export function translate(lang, key, params = {}) {
  const normLang = (lang === 'pb' ? 'pa' : lang) || 'en';
  const dict = TRANSLATIONS[normLang] || TRANSLATIONS.en;
  let text = dict[key] || TRANSLATIONS.en[key] || key;

  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }
  return text;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', label: 'English (EN)' },
  { code: 'hi', name: 'हिन्दी', label: 'हिन्दी (HI)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', label: 'ਪੰਜਾਬੀ (PA)' },
  { code: 'mr', name: 'मराठी', label: 'मराठी (MR)' }
];
