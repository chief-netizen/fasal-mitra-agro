import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Loader2, Check, Paperclip, AlertCircle, Volume2 } from "lucide-react";
import { AppShell, Card, SectionLabel } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { useAgri } from "@/lib/agri-store";
import { generateClaimFormPDF } from "@/lib/pdf-generator";

export const Route = createFileRoute("/bima")({
  head: () => ({
    meta: [
      { title: "बीमा व सरकारी योजना दस्तावेज़ — AgriConnect" },
      {
        name: "description",
        content:
          "PMFBY और पशुपालन योजनाओं के लिए दस्तावेज़ सूची, दावा सारांश और पात्रता — अपने आप तैयार।",
      },
      { property: "og:title", content: "बीमा व सरकारी योजना — AgriConnect" },
      {
        property: "og:description",
        content: "रोग निदान और मौसम डेटा से अपने आप बनता दावा दस्तावेज़।",
      },
    ],
  }),
  component: BimaPage,
});

const schemes = [
  { id: "pmfby", label: "PMFBY (फ़सल बीमा)" },
  { id: "ah", label: "पशुपालन योजना" },
  { id: "state", label: "राज्य आपदा राहत" },
] as const;

const requiredDocs = {
  pmfby: [
    {
      label: "Aadhaar card / farmer ID",
      note: "Primary identity proof and beneficiary record.",
      hi: "आधार कार्ड / किसान पहचान",
      hiNote: "मुख्य पहचान प्रमाण और लाभार्थी रिकॉर्ड।",
    },
    {
      label: "Khatauni / land records",
      note: "Proof of the registered cultivated land parcel.",
      hi: "खसरा/खतौनी / भूमि रिकॉर्ड",
      hiNote: "कृषि भूमि के स्वामित्व और क्षेत्र प्रमाण।",
    },
    {
      label: "Bank passbook first page",
      note: "Account number, IFSC, and account holder name.",
      hi: "बैंक पासबुक का पहला पृष्ठ",
      hiNote: "खाता नंबर, IFSC और खातेधारक का नाम।",
    },
    {
      label: "Sowing certificate",
      note: "Farmer declaration or village certificate for the crop season.",
      hi: "बुवाई प्रमाण पत्र",
      hiNote: "फसल सीज़न के लिए ग्राम/पटवारी प्रमाण।",
    },
    {
      label: "Geo-tagged crop damage photo",
      note: "Current field condition with date and location.",
      hi: "जियो-टैग फ़सल क्षति फोटो",
      hiNote: "तारीख और स्थान सहित खेत की वर्तमान स्थिति।",
    },
    {
      label: "AgriConnect diagnosis report",
      note: "AI-generated disease detection and confidence score.",
      hi: "AgriConnect निदान रिपोर्ट",
      hiNote: "एआई द्वारा बनाई गई रोग पहचान और विश्वास स्तर।",
    },
  ],
  ah: [
    {
      label: "Animal ID / tag certificate",
      note: "RFID or QR tag, breed, and ownership details.",
      hi: "पशु ID / टैग प्रमाण",
      hiNote: "RFID या QR टैग, नस्ल और मालिकाना जानकारी।",
    },
    {
      label: "Vaccination history",
      note: "Latest vaccination record and veterinary treatment notes.",
      hi: "टीकाकरण इतिहास",
      hiNote: "पिछला टीकाकरण और पशुचिकित्सा नोट्स।",
    },
    {
      label: "Field or shed photo",
      note: "Animal condition photographs and shelter details.",
      hi: "खेत/शेड फोटो",
      hiNote: "पशु की स्थिति और आवास की फोटो।",
    },
    {
      label: "Bank passbook",
      note: "For claim credit and scheme payout.",
      hi: "बैंक पासबुक",
      hiNote: "दावा भुगतान के लिए बैंक विवरण।",
    },
    {
      label: "Veterinary certificate",
      note: "Signed illness report or treatment verification.",
      hi: "पशुचिकित्सा प्रमाण पत्र",
      hiNote: "रोग रिपोर्ट या उपचार सत्यापन।",
    },
  ],
  state: [
    {
      label: "Aadhaar and state ID",
      note: "Identity proof for disaster-relief approval.",
      hi: "आधार और राज्य पहचान",
      hiNote: "आपदा राहत अनुमोदन के लिए पहचान पत्र।",
    },
    {
      label: "Crop loss declaration",
      note: "Loss estimate with area, crop type, and date of damage.",
      hi: "फसल नुकसान घोषणा",
      hiNote: "क्षेत्र, फसल प्रकार और क्षति तिथि सहित नुकसान विवरण।",
    },
    {
      label: "Weather and field evidence",
      note: "Rainfall, flood, or pest impact notes with supporting photos.",
      hi: "मौसम और खेत का प्रमाण",
      hiNote: "बारिश, बाढ़ या कीट प्रभाव का दस्तावेज और फोटो।",
    },
    {
      label: "Village / gram panchayat certificate",
      note: "Verification of damage from local authority.",
      hi: "ग्राम पंचायत / गाँव प्रमाण पत्र",
      hiNote: "स्थानीय अधिकारी से क्षति सत्यापन।",
    },
    {
      label: "Bank details",
      note: "Account information for disbursement.",
      hi: "बैंक विवरण",
      hiNote: "वितरण के लिए खाता जानकारी।",
    },
  ],
} as const;

function BimaPage() {
  const { language } = useLanguage();
  const { cases } = useAgri();
  const [scheme, setScheme] = useState<(typeof schemes)[number]["id"]>("pmfby");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [guiding, setGuiding] = useState(false);
  const latest = cases[0];

  const content =
    language === "en"
      ? {
          title: "Insurance and scheme documents",
          subtitle: "Prepared from recorded events",
          button: "Generate claim form",
          loading: "Preparing documents…",
          choose: "Choose scheme",
          evidence: "Attached evidence",
          auto: "AI claim readiness",
          ready: "Claim draft ready",
          toolkit: "Insurance toolkit",
          toolkitText: "Keep these documents ready before filing the claim.",
          voice: "Hear instructions",
          voiceActive: "Playing guidance…",
          schemeText: {
            pmfby: "PMFBY — likely eligible for notified crop loss",
            ah: "Livestock support — eligible after vet verification",
            state: "State disaster relief — pending local review",
          },
          review: "Recommended next steps",
          required: "Required documents",
          summary: "Claim summary",
          tips: "Checklist to submit at the office",
          note: "Please complete missing bank IFSC and policy number before submission.",
        }
      : {
          title: "बीमा व योजना दस्तावेज़",
          subtitle: "दर्ज घटनाओं से अपने आप तैयार",
          button: "दावा दस्तावेज़ बनाएँ",
          loading: "दस्तावेज़ बन रहे हैं…",
          choose: "योजना चुनें",
          evidence: "जुड़ा हुआ प्रमाण",
          auto: "AI दावा तैयारी",
          ready: "दावा ड्राफ़्ट तैयार",
          toolkit: "बीमा टूलकिट",
          toolkitText: "दावा दर्ज करने से पहले ये दस्तावेज़ तैयार रखें।",
          voice: "निर्देश सुनें",
          voiceActive: "निर्देश सुन रहा है…",
          schemeText: {
            pmfby: "PMFBY — संभावित पात्र (स्थानीयकृत आपदा खंड, अधिसूचित फ़सल)",
            ah: "पशुपालन योजना — पशु चिकित्सक सत्यापन के बाद पात्र",
            state: "राज्य आपदा राहत — स्थानीय समीक्षा लंबित",
          },
          review: "अनुशंसित अगले कदम",
          required: "आवश्यक दस्तावेज़",
          summary: "दावा सारांश",
          tips: "कार्यालय में जमा करने के लिए चेकलिस्ट",
          note: "कृपया जमा करने से पहले बैंक IFSC और बीमा पॉलिसी नंबर पूरा करें।",
        };

  function generate() {
    if (!latest) return;

    setLoading(true);
    setReady(false);

    // Simulate processing
    setTimeout(async () => {
      const schemeEligibilityText = {
        en: {
          pmfby: "PMFBY — likely eligible for notified crop loss under localized disaster clause",
          ah: "Livestock Support — eligible after veterinary verification",
          state: "State Disaster Relief — under review for rain-related damage",
        },
        hi: {
          pmfby: "PMFBY — अधिसूचित आपदा खंड के तहत संभावित पात्र",
          ah: "पशुपालन योजना — पशु चिकित्सक सत्यापन के बाद पात्र",
          state: "राज्य आपदा राहत — वर्षा-जनित क्षति के अंतर्गत समीक्षा योग्य",
        },
      };

      const claimSummaryText = {
        en: `Date ${new Date().toLocaleDateString("en-IN")} — farmer Ram Lal Yadav has submitted a crop loss declaration for 1.2 hectares under scheme ${scheme.toUpperCase()}. AI diagnosis confirms ${latest.disease ?? "crop disease"} with ${Math.round((latest.confidence ?? 0) * 100)}% confidence. Weather risk is recorded as 75% and the geo-tagged evidence is attached. The final claim draft is ready for submission to the agricultural office.`,
        hi: `दिनांक ${new Date().toLocaleDateString("hi-IN")} को रामलाल यादव द्वारा योजना ${scheme === "pmfby" ? "PMFBY" : scheme === "ah" ? "पशुपालन" : "राज्य आपदा राहत"} के तहत 1.2 हेक्टेयर की फ़सल के लिए दावा ड्राफ़्ट तैयार किया गया है। AI द्वारा ${latest.disease ?? "रोग"} की पुष्टि ${Math.round((latest.confidence ?? 0) * 100)}% विश्वास के साथ हुई है। मौसम से संबंधित 75% जोखिम और जियो-टैग फोटो संलग्न हैं। दावा फार्म कृषि कार्यालय में जमा के लिए तैयार है।`,
      };

      // Generate PDF with claim data
      try {
        await generateClaimFormPDF({
          scheme,
          farmerName: "Ram Lal Yadav",
          landRecord: "214/3",
          district: "Varanasi, UP",
          disease: latest.disease ?? "Crop disease",
          confidence: latest.confidence ?? 0,
          area: "1.2",
          language,
          date: new Date(),
          weatherInfo: "4–6 days heavy rain (75%)",
          requiredDocs: docs,
          claimSummary: claimSummaryText[language],
          attachedFiles: 3,
          schemeEligibility: schemeEligibilityText[language][scheme],
        });
      } catch (error) {
        console.error("Error generating PDF:", error);
      }

      setLoading(false);
      setReady(true);
    }, 1000);
  }

  function playVoiceGuide() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const docList = requiredDocs[scheme]
      .map((doc) => (language === "en" ? doc.label : doc.hi))
      .join(", ");

    const message =
      language === "en"
        ? `For your ${scheme.toUpperCase()} claim, please keep these ready: ${docList}. Also have your Aadhaar card, land details, bank passbook, and diagnosis report available before submission.`
        : `आपके ${scheme === "pmfby" ? "PMFBY" : scheme === "ah" ? "पशुपालन" : "राज्य आपदा राहत"} दावे के लिए कृपया ये दस्तावेज़ तैयार रखें: ${docList}। साथ में आधार कार्ड, भूमि विवरण, बैंक पासबुक और निदान रिपोर्ट भी रखें।`;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = language === "en" ? "en-IN" : "hi-IN";
    utterance.onend = () => setGuiding(false);
    setGuiding(true);
    window.speechSynthesis.speak(utterance);
  }

  const docs = requiredDocs[scheme];
  const claimProgress = latest
    ? Math.min(99, Math.round((latest.confidence + 0.25) * 100))
    : 0;

  return (
    <AppShell title={content.title} subtitle={content.subtitle}>
      <Card className="space-y-2">
        <SectionLabel>{content.choose}</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {schemes.map((s) => (
            <button
              key={s.id}
              onClick={() => setScheme(s.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                scheme === s.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <SectionLabel>{content.toolkit}</SectionLabel>
          <button
            type="button"
            onClick={playVoiceGuide}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2 py-1 text-[10px] text-secondary-foreground"
          >
            <Volume2 className="h-3.5 w-3.5" />
            {guiding ? content.voiceActive : content.voice}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">{content.toolkitText}</p>
        <div className="space-y-2">
          {docs.map((doc, index) => (
            <div key={doc.label} className="flex items-start gap-2 rounded-lg bg-muted/50 p-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                {index + 1}
              </span>
              <div>
                <p className="text-xs font-medium text-foreground">
                  {language === "en" ? doc.label : doc.hi}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {language === "en" ? doc.note : doc.hiNote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <SectionLabel>{content.auto}</SectionLabel>
        <div className="flex items-center justify-between text-xs">
          <span>{content.ready}</span>
          <span className="font-semibold text-primary">{claimProgress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${claimProgress}%` }} />
        </div>
        <p className="text-[11px] text-muted-foreground">
          {content.schemeText[scheme]}
        </p>
      </Card>

      <Card className="space-y-1.5 text-xs">
        <SectionLabel>{content.evidence}</SectionLabel>
        <p>• {language === "en" ? "Disease report" : "रोग रिपोर्ट"}: {latest?.disease ?? "—"} ({latest ? Math.round(latest.confidence * 100) : 0}%)</p>
        <p>• {language === "en" ? "Geo-tagged photo" : "जियो-टैग फोटो"}: {latest?.district ?? "—"}</p>
        <p>• {language === "en" ? "Weather record" : "मौसम रिकॉर्ड"}: 4–6 days heavy rain (75%)</p>
        <p>• {language === "en" ? "Farmer" : "किसान"}: रामलाल यादव · {language === "en" ? "Land record" : "खसरा संख्या"} 214/3 · 1.2 hectare</p>
      </Card>

      <button
        onClick={generate}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
        {loading ? content.loading : content.button}
      </button>

      {ready && (
        <>
          <Card className="space-y-2">
            <SectionLabel>{content.required}</SectionLabel>
            {docs.map((doc, idx) => (
              <p key={doc.label} className="flex items-start gap-2 text-xs">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                <span>
                  {idx + 1}. {language === "en" ? doc.label : doc.hi}
                </span>
              </p>
            ))}
          </Card>

          <Card className="space-y-2">
            <SectionLabel>{content.summary}</SectionLabel>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {language === "en"
                ? `Date ${new Date().toLocaleDateString("en-IN")} — farmer Ram Lal Yadav has submitted a crop loss declaration for 1.2 hectares. AI diagnosis confirms ${latest?.disease ?? "crop disease"} with ${latest ? Math.round(latest.confidence * 100) : 0}% confidence. Weather risk is recorded as 75% and the geo-tagged evidence is attached. The final claim draft is ready for office submission.`
                : `दिनांक ${new Date().toLocaleDateString("hi-IN")} को रामलाल यादव द्वारा 1.2 हेक्टेयर की फ़सल के लिए दावा ड्राफ़्ट तैयार किया गया है। AI द्वारा ${latest?.disease ?? "रोग"} की पुष्टि ${latest ? Math.round(latest.confidence * 100) : 0}% विश्वास के साथ हुई है। मौसम से संबंधित 75% जोखिम और जियो-टैग फोटो संलग्न हैं। दावा फार्म कार्यालय जमा के लिए तैयार है।`}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-primary">
              <Paperclip className="h-3.5 w-3.5" /> {language === "en" ? "2 supporting files attached" : "2 सहायक फ़ाइलें संलग्न"}
            </div>
          </Card>

          <Card className="space-y-2">
            <SectionLabel>{content.tips}</SectionLabel>
            <p className="text-xs">
              <span className="font-medium">PMFBY</span> — {language === "en" ? "likely eligible for notified crop loss" : "संभावित पात्र (अधिसूचित फ़सल क्षति)"}
            </p>
            <p className="text-xs">
              <span className="font-medium">{language === "en" ? "State relief" : "राज्य आपदा राहत"}</span> — {language === "en" ? "review under rain-related damage rules" : "वर्षा-जनित क्षति के अंतर्गत समीक्षा योग्य"}
            </p>
            <p className="flex items-start gap-2 rounded-lg bg-accent/50 p-2 text-[11px] text-accent-foreground">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {content.note}
            </p>
          </Card>
        </>
      )}
    </AppShell>
  );
}
