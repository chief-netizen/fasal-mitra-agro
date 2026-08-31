import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, Mic, Volume2, WifiOff, MapPin, Loader2 } from "lucide-react";
import { AppShell, Card, SectionLabel } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { store, mockDiagnoses, urgencyClass, urgencyLabel, type Diagnosis } from "@/lib/agri-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriConnect — फ़सल व पशु रोग जाँच" },
      {
        name: "description",
        content:
          "फ़ोटो से फ़सल और पशु रोग की तुरंत पहचान, इलाज की सलाह, और गाँव के सहायता नक्शे पर मदद की माँग — हिंदी में।",
      },
      { property: "og:title", content: "AgriConnect — फ़सल व पशु रोग जाँच" },
      {
        property: "og:description",
        content: "फ़ोटो अपलोड कीजिए, तुरंत रोग पहचान और इलाज की सलाह पाइए।",
      },
    ],
  }),
  component: DiagnosePage,
});

function DiagnosePage() {
  const { language } = useLanguage();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [posted, setPosted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [pick, setPick] = useState(0);

  const content =
    language === "en"
      ? {
          appTitle: "Crop / livestock check",
          subtitle: "Upload a photo of a leaf, stem, fruit, or animal",
          offline: "Offline mode is on — it will send automatically when the network returns",
          upload: "Take or choose a photo",
          uploadHint: "GPS and timestamp will be added automatically",
          check: "Check now",
          sample: "Sample check",
          scanning: "AI is analyzing the image…",
          identify: "Identification",
          species: "Species",
          treatment: "Treatment",
          medicine: "Medicine",
          dosage: "Dosage",
          organic: "Organic alternative",
          resultLabel: "Confidence level",
          speak: "Listen in English",
          speaking: "Speaking…",
          request: "Request medicine on the help map",
          posted: "Added to map ✓",
          mapTitle: "Support map",
        }
      : {
          appTitle: "फ़सल / पशु की जाँच",
          subtitle: "पत्ती, तना, फल या पशु की फ़ोटो लीजिए",
          offline: "ऑफ़लाइन मोड चालू — नेटवर्क आने पर अपने आप भेजा जाएगा",
          upload: "फ़ोटो खींचें या चुनें",
          uploadHint: "GPS + समय अपने आप जुड़ जाएगा",
          check: "जाँच करें",
          sample: "नमूना जाँच",
          scanning: "AI छवि की जाँच कर रहा है…",
          identify: "पहचान",
          species: "प्रजाति",
          treatment: "इलाज",
          medicine: "दवा",
          dosage: "मात्रा",
          organic: "जैविक विकल्प",
          resultLabel: "विश्वास स्तर",
          speak: "हिंदी में सुनें",
          speaking: "बोल रहा है…",
          request: "सहायता नक्शे पर दवा की माँग डालें",
          posted: "नक्शे पर दर्ज हो गया ✓",
          mapTitle: "सहायता नक्शे पर दवा की माँग डालें",
        };

  function runDiagnosis(imageUrl: string | null) {
    setPreview(imageUrl);
    setResult(null);
    setPosted(false);
    setLoading(true);
    const d = mockDiagnoses[pick % mockDiagnoses.length]!;
    setPick((p) => p + 1);
    setTimeout(() => {
      setResult(d);
      setLoading(false);
    }, 1600);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    runDiagnosis(URL.createObjectURL(f));
  }

  function speak() {
    if (!result || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(
      `${result.species} में ${result.disease} पाया गया है। इलाज: ${result.treatment.medicine}, ${result.treatment.dosage}. जैविक विकल्प: ${result.treatment.organic_alternative}.`,
    );
    u.lang = "hi-IN";
    u.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }

  function postToMap() {
    if (!result) return;
    store.addCase({
      id: `c-${Date.now()}`,
      kind: result.species === "गाय" || result.species === "भैंस" ? "livestock" : "crop",
      createdAt: "अभी",
      farmer: "रामलाल यादव",
      district: "वाराणसी, उ.प्र.",
      lat: 25.36,
      lng: 82.9,
      medicine_needed: result.treatment.medicine,
      quantity: "500 ग्राम",
      status: "Open",
      helpers: [],
      ...(preview ? { imageUrl: preview } : {}),
      ...result,
    });
    setPosted(true);
  }

  return (
    <AppShell title={content.appTitle} subtitle={content.subtitle}>
      <Card className="flex items-center justify-between gap-3 bg-secondary/60">
        <div className="flex items-center gap-2 text-xs text-secondary-foreground">
          <WifiOff className="h-4 w-4" />
          {content.offline}
        </div>
      </Card>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onFile}
      />

      {preview ? (
        <img
          src={preview}
          alt="अपलोड की गई फ़सल/पशु की फ़ोटो"
          className="h-48 w-full rounded-xl border border-border object-cover"
        />
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Camera className="h-8 w-8" />
          <span className="text-sm font-medium">{content.upload}</span>
          <span className="text-[11px]">{content.uploadHint}</span>
        </button>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => fileRef.current?.click()}
          className="rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
        >
          {content.check}
        </button>
        <button
          onClick={() => runDiagnosis(null)}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium"
        >
          <Mic className="h-4 w-4" /> {content.sample}
        </button>
      </div>

      {loading && (
        <Card className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          {content.scanning}
        </Card>
      )}

      {result && (
        <>
          <Card className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <SectionLabel>{content.identify}</SectionLabel>
                <h2 className="mt-1 text-base font-semibold">{result.disease}</h2>
                <p className="text-xs text-muted-foreground">
                  {content.species}: {result.species}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${urgencyClass[result.urgency]}`}
              >
                {urgencyLabel[result.urgency]}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{content.resultLabel}</span>
                <span>{Math.round(result.confidence * 100)}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                <div
                  className="h-1.5 rounded-full bg-primary"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
            </div>

            {result.differentials.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {result.differentials.map((d) => (
                  <span
                    key={d}
                    className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    संभावित: {d}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={speak}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary py-2 text-xs font-medium text-secondary-foreground"
            >
              <Volume2 className="h-4 w-4" />
              {speaking ? content.speaking : content.speak}
            </button>
          </Card>

          <Card className="space-y-2 text-sm">
            <SectionLabel>{content.treatment}</SectionLabel>
            <Row k={content.medicine} v={result.treatment.medicine} />
            <Row k={content.dosage} v={result.treatment.dosage} />
            <Row k={content.organic} v={result.treatment.organic_alternative} />
            <p className="rounded-lg bg-accent/50 p-2 text-[11px] text-accent-foreground">
              {result.region_risk_notes}
            </p>
          </Card>

          <button
            onClick={postToMap}
            disabled={posted}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            <MapPin className="h-4 w-4" />
            {posted ? content.posted : content.request}
          </button>
        </>
      )}
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3 border-b border-border pb-2 last:border-0 last:pb-0">
      <span className="w-24 shrink-0 text-xs text-muted-foreground">{k}</span>
      <span className="text-sm">{v}</span>
    </div>
  );
}
