import { useSyncExternalStore } from "react";

export type Urgency = "Low" | "Medium" | "High" | "Outbreak-risk";

export type Diagnosis = {
  species: string;
  disease: string;
  confidence: number;
  differentials: string[];
  treatment: { medicine: string; dosage: string; organic_alternative: string };
  urgency: Urgency;
  region_risk_notes: string;
};

export type Case = Diagnosis & {
  id: string;
  kind: "crop" | "livestock";
  createdAt: string;
  farmer: string;
  district: string;
  lat: number;
  lng: number;
  medicine_needed: string;
  quantity: string;
  status: "Open" | "Fulfilled";
  helpers: { name: string; type: string; note: string }[];
  imageUrl?: string;
};

export type Animal = {
  id: string;
  tag: string;
  species: string;
  breed: string;
  ageMonths: number;
  lastVaccination: string;
  nextVaccination: string;
  breeding: string;
  events: { at: string; type: string; detail: string; source: string }[];
};

const seedCases: Case[] = [
  {
    id: "c1",
    kind: "crop",
    createdAt: "आज, 09:12",
    species: "धान",
    disease: "ब्लास्ट रोग (Rice Blast)",
    confidence: 0.91,
    differentials: ["ब्राउन स्पॉट", "शीथ ब्लाइट"],
    treatment: {
      medicine: "Tricyclazole 75% WP",
      dosage: "0.6 ग्राम/लीटर पानी, 10 दिन बाद दोहराएँ",
      organic_alternative: "नीम तेल 3% + स्यूडोमोनास फ्लोरेसेंस छिड़काव",
    },
    urgency: "High",
    region_risk_notes: "नमी अधिक — पड़ोस के खेतों में फैलने का खतरा",
    farmer: "रामलाल यादव",
    district: "वाराणसी, उ.प्र.",
    lat: 25.32,
    lng: 82.97,
    medicine_needed: "Tricyclazole 75% WP",
    quantity: "500 ग्राम",
    status: "Open",
    helpers: [],
  },
  {
    id: "c2",
    kind: "crop",
    createdAt: "आज, 08:40",
    species: "धान",
    disease: "ब्लास्ट रोग (Rice Blast)",
    confidence: 0.87,
    differentials: ["ब्राउन स्पॉट"],
    treatment: {
      medicine: "Tricyclazole 75% WP",
      dosage: "0.6 ग्राम/लीटर पानी",
      organic_alternative: "नीम तेल 3% छिड़काव",
    },
    urgency: "High",
    region_risk_notes: "एक ही ब्लॉक में दूसरा मामला",
    farmer: "सुनीता देवी",
    district: "वाराणसी, उ.प्र.",
    lat: 25.41,
    lng: 83.05,
    medicine_needed: "Tricyclazole 75% WP",
    quantity: "1 किलो",
    status: "Open",
    helpers: [{ name: "किसान सेवा NGO", type: "NGO", note: "दवा उपलब्ध, कल पहुँचाएँगे" }],
  },
  {
    id: "c3",
    kind: "livestock",
    createdAt: "कल, 17:05",
    species: "भैंस",
    disease: "खुरपका-मुँहपका (FMD)",
    confidence: 0.88,
    differentials: ["वेसिकुलर स्टोमेटाइटिस"],
    treatment: {
      medicine: "FMD Vaccine + Oxytetracycline",
      dosage: "पशु चिकित्सक की देखरेख में",
      organic_alternative: "फिटकरी के पानी से मुँह धुलाई, नरम चारा",
    },
    urgency: "Outbreak-risk",
    region_risk_notes: "गाँव के अन्य पशुओं में तेज़ी से फैल सकता है",
    farmer: "मोहन सिंह",
    district: "मिर्ज़ापुर, उ.प्र.",
    lat: 25.13,
    lng: 82.56,
    medicine_needed: "FMD टीका",
    quantity: "20 डोज़",
    status: "Open",
    helpers: [],
  },
  {
    id: "c4",
    kind: "crop",
    createdAt: "2 दिन पहले",
    species: "टमाटर",
    disease: "अगेती झुलसा (Early Blight)",
    confidence: 0.84,
    differentials: ["लेट ब्लाइट", "सेप्टोरिया लीफ स्पॉट"],
    treatment: {
      medicine: "Mancozeb 75% WP",
      dosage: "2 ग्राम/लीटर पानी",
      organic_alternative: "ट्राइकोडर्मा विरिडी घोल",
    },
    urgency: "Medium",
    region_risk_notes: "बारिश के बाद संक्रमण बढ़ सकता है",
    farmer: "अनीता पटेल",
    district: "जौनपुर, उ.प्र.",
    lat: 25.75,
    lng: 82.68,
    medicine_needed: "Mancozeb 75% WP",
    quantity: "1 किलो",
    status: "Fulfilled",
    helpers: [{ name: "बीज भंडार, जौनपुर", type: "डीलर", note: "1 किलो दवा दी गई" }],
  },
];

const seedAnimals: Animal[] = [
  {
    id: "a1",
    tag: "RFID-UP-1042",
    species: "भैंस",
    breed: "मुर्रा",
    ageMonths: 48,
    lastVaccination: "12 मई 2026",
    nextVaccination: "12 नवं 2026",
    breeding: "गाभिन — 5वाँ माह",
    events: [
      {
        at: "कल, 17:05",
        type: "बीमारी",
        detail: "मुँह में छाले, लार गिरना — FMD संदेह",
        source: "ऐप",
      },
      { at: "12 मई", type: "टीकाकरण", detail: "HS + BQ टीका लगाया गया", source: "ऐप" },
    ],
  },
  {
    id: "a2",
    tag: "QR-UP-2213",
    species: "गाय",
    breed: "साहीवाल",
    ageMonths: 30,
    lastVaccination: "02 जून 2026",
    nextVaccination: "02 दिसं 2026",
    breeding: "प्रजनन योग्य",
    events: [
      {
        at: "3 दिन पहले",
        type: "सेंसर",
        detail: "शरीर का तापमान 39.8°C — निगरानी",
        source: "RFID टैग",
      },
    ],
  },
];

type State = { cases: Case[]; animals: Animal[] };

let state: State = { cases: seedCases, animals: seedAnimals };
const listeners = new Set<() => void>();

function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}

export const store = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get: () => state,
  addCase(c: Case) {
    state.cases = [c, ...state.cases];
    emit();
  },
  offerHelp(id: string, helper: { name: string; type: string; note: string }) {
    state.cases = state.cases.map((c) =>
      c.id === id ? { ...c, helpers: [...c.helpers, helper] } : c,
    );
    emit();
  },
  fulfill(id: string) {
    state.cases = state.cases.map((c) => (c.id === id ? { ...c, status: "Fulfilled" } : c));
    emit();
  },
  addAnimal(a: Animal) {
    state.animals = [a, ...state.animals];
    emit();
  },
  addEvent(id: string, ev: Animal["events"][number]) {
    state.animals = state.animals.map((a) =>
      a.id === id ? { ...a, events: [ev, ...a.events] } : a,
    );
    emit();
  },
};

export function useAgri() {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

export const urgencyLabel: Record<Urgency, string> = {
  Low: "कम",
  Medium: "मध्यम",
  High: "अधिक",
  "Outbreak-risk": "महामारी जोखिम",
};

export const urgencyClass: Record<Urgency, string> = {
  Low: "bg-secondary text-secondary-foreground",
  Medium: "bg-accent text-accent-foreground",
  High: "bg-warning/25 text-warning-foreground",
  "Outbreak-risk": "bg-destructive/15 text-destructive",
};

/** Simulated vision-model output (prototype — no real model call). */
export const mockDiagnoses: Diagnosis[] = [
  {
    species: "धान",
    disease: "ब्लास्ट रोग (Rice Blast)",
    confidence: 0.92,
    differentials: ["ब्राउन स्पॉट", "शीथ ब्लाइट", "नाइट्रोजन की कमी"],
    treatment: {
      medicine: "Tricyclazole 75% WP",
      dosage: "0.6 ग्राम/लीटर पानी, 10 दिन बाद दोहराएँ",
      organic_alternative: "नीम तेल 3% + स्यूडोमोनास फ्लोरेसेंस",
    },
    urgency: "High",
    region_risk_notes: "आपके ब्लॉक में पिछले 7 दिनों में 2 और मामले दर्ज",
  },
  {
    species: "धान",
    disease: "ब्राउन स्पॉट (Brown Spot)",
    confidence: 0.85,
    differentials: ["ब्लास्ट रोग", "शीथ ब्लाइट", "मृदा नमक समस्या"],
    treatment: {
      medicine: "Hexaconazole 5% SC",
      dosage: "1 मिली/लीटर पानी, 10-15 दिन बाद दोहराएँ",
      organic_alternative: "बायोफर्टिलाइज़र + फसल अवशेष प्रसंस्करण",
    },
    urgency: "Medium",
    region_risk_notes: "कम नमी वाले खेतों में रोग बढ़ने का खतरा",
  },
  {
    species: "गेहूँ",
    disease: "पीला रस्ट (Yellow Rust)",
    confidence: 0.88,
    differentials: ["लीला रस्ट", "सेप्टोरिया लीफ ब्लाइट", "नाइट्रोजन की कमी"],
    treatment: {
      medicine: "Propiconazole 25% EC",
      dosage: "1 मिली/लीटर पानी, 10 दिन बाद दोहराएँ",
      organic_alternative: "बोर्डो मिश्रण + जल निकासी चेक",
    },
    urgency: "High",
    region_risk_notes: "ठंडी सुबह और अधिक नमी के कारण तेजी से प्रसार",
  },
  {
    species: "टमाटर",
    disease: "अगेती झुलसा (Early Blight)",
    confidence: 0.83,
    differentials: ["पछेती झुलसा", "बैक्टीरियल स्पॉट", "सेप्टोरिया"],
    treatment: {
      medicine: "Mancozeb 75% WP",
      dosage: "2 ग्राम/लीटर पानी, 7-10 दिन बाद दोहराएँ",
      organic_alternative: "ट्राइकोडर्मा + बोर्डो मिश्रण",
    },
    urgency: "Medium",
    region_risk_notes: "बारिश के बाद संक्रमण बढ़ सकता है",
  },
  {
    species: "टमाटर",
    disease: "पछेती झुलसा (Late Blight)",
    confidence: 0.9,
    differentials: ["अगेती झुलसा", "फंगल स्पॉट", "कमीज़न की कमी"],
    treatment: {
      medicine: "Metalaxyl + Mancozeb",
      dosage: "2.5 ग्राम/लीटर पानी, 7 दिन के अंतराल पर",
      organic_alternative: "बोर्डो मिश्रण 1% छिड़काव",
    },
    urgency: "High",
    region_risk_notes: "नम और ठंडी रातें इस रोग को बहुत तेज़ी से फैलाती हैं",
  },
  {
    species: "मक्का",
    disease: "कॉर्न लीफ ब्लाइट (Leaf Blight)",
    confidence: 0.79,
    differentials: ["स्टीग्मा", "आल्टरनेरिया", "कमीज़न की कमी"],
    treatment: {
      medicine: "Azoxystrobin 23% SC",
      dosage: "1 मिली/लीटर पानी",
      organic_alternative: "सिरेंजी + नीम तेल 3%",
    },
    urgency: "Medium",
    region_risk_notes: "आर्द्रता और कम हवा का प्रभाव रोग को बढ़ाता है",
  },
  {
    species: "कपास",
    disease: "लीफ कर्ल (Leaf Curl)",
    confidence: 0.86,
    differentials: ["बीमारी का कारण वायुमंडलीय तनाव", "थ्रिप्स आक्रमण", "सोलर बर्न"],
    treatment: {
      medicine: "Imidacloprid 17.8% SL",
      dosage: "0.5 मिली/लीटर पानी",
      organic_alternative: "बायो-एजेंट और थ्रिप्स ट्रैप",
    },
    urgency: "High",
    region_risk_notes: "कीट नियंत्रण और फसल की स्थिति की नियमित निगरानी जरूरी",
  },
  {
    species: "आलू",
    disease: "कार्ल-पंक्ति (Early Blight / Alternaria)",
    confidence: 0.81,
    differentials: ["पश्च झुलसा", "नमी-जनित फसल क्षति"],
    treatment: {
      medicine: "Chlorothalonil 75% WP",
      dosage: "2 ग्राम/लीटर पानी",
      organic_alternative: "कैल्शियम आधारित मृदा सुधार + नीम तेल",
    },
    urgency: "Medium",
    region_risk_notes: "तापमान में उतार-चढ़ाव और कीट की गतिविधि रोग को बढ़ाती है",
  },
  {
    species: "गाय",
    disease: "खुरपका-मुँहपका (FMD)",
    confidence: 0.89,
    differentials: ["कुंजीनेजिया", "मुंह के घाव", "दंत रोग"],
    treatment: {
      medicine: "FMD टीका + Oxytetracycline",
      dosage: "पशु चिकित्सक की देखरेख में",
      organic_alternative: "फिटकरी के पानी से मुँह धुलाई, नरम चारा",
    },
    urgency: "Outbreak-risk",
    region_risk_notes: "पशुओं को तुरंत अलग करें, दूध अलग रखें, गाँव में निगरानी करें",
  },
  {
    species: "भैंस",
    disease: "मस्तिष्कीय या त्वचा विकृति (Skin Infection)",
    confidence: 0.74,
    differentials: ["लगातार कीट लगना", "आलर्जी", "फ्लाई बाइट"],
    treatment: {
      medicine: "Spray / topical antiseptic under vet guidance",
      dosage: "पशु चिकित्सक की सलाह पर",
      organic_alternative: "साफ़ पानी की धुलाई और ताजे चारे का उपयोग",
    },
    urgency: "Medium",
    region_risk_notes: "त्वचा पर फफोले और खुजली के लक्षण नज़र आते हैं",
  },
];
