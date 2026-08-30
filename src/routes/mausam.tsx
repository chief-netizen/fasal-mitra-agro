import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CloudRain, Droplets, Sun, TriangleAlert, Loader2, Sprout } from "lucide-react";
import { AppShell, Card, SectionLabel } from "@/components/AppShell";

export const Route = createFileRoute("/mausam")({
  head: () => ({
    meta: [
      { title: "मौसम आधारित फ़सल सलाह — AgriConnect" },
      {
        name: "description",
        content:
          "14 दिन के मौसम पूर्वानुमान और मिट्टी के आधार पर सही फ़सल, जोखिम और सिंचाई योजना।",
      },
      { property: "og:title", content: "मौसम आधारित फ़सल सलाह — AgriConnect" },
      {
        property: "og:description",
        content: "अगले 14 दिनों के मौसम के अनुसार फ़सल चुनाव और सिंचाई की योजना।",
      },
    ],
  }),
  component: MausamPage,
});

const forecast = [
  { d: "सोम", t: 34, r: 0 },
  { d: "मंगल", t: 33, r: 5 },
  { d: "बुध", t: 31, r: 40 },
  { d: "गुरु", t: 29, r: 75 },
  { d: "शुक्र", t: 28, r: 60 },
  { d: "शनि", t: 30, r: 20 },
  { d: "रवि", t: 32, r: 10 },
];

const crops = [
  { name: "धान (स्वर्णा सब-1)", yield: "उच्च", note: "जलभराव सहनशील — बारिश के अनुकूल" },
  { name: "अरहर (दाल)", yield: "मध्यम", note: "कम पानी, मिट्टी में नाइट्रोजन बढ़ाती है" },
  { name: "मक्का (हाइब्रिड)", yield: "मध्यम", note: "अच्छी निकासी वाले खेत में ही लगाएँ" },
];

function MausamPage() {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  function generate() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setReady(true);
    }, 1400);
  }

  return (
    <AppShell title="मौसम व फ़सल सलाह" subtitle="वाराणसी, उ.प्र. · खरीफ़ मौसम">
      <Card className="flex items-center gap-4">
        <Sun className="h-10 w-10 text-warning" />
        <div>
          <p className="text-2xl font-semibold">34°C</p>
          <p className="text-xs text-muted-foreground">आर्द्रता 78% · हवा 9 किमी/घं</p>
        </div>
        <span className="ml-auto text-right text-[11px] text-muted-foreground">
          स्रोत:
          <br />
          Open-Meteo / IMD
        </span>
      </Card>

      <Card>
        <SectionLabel>7 दिन का पूर्वानुमान</SectionLabel>
        <div className="mt-3 flex justify-between">
          {forecast.map((f) => (
            <div key={f.d} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground">{f.d}</span>
              {f.r > 30 ? (
                <CloudRain className="h-4 w-4 text-primary" />
              ) : (
                <Sun className="h-4 w-4 text-warning" />
              )}
              <span className="text-[11px] font-medium">{f.t}°</span>
              <span className="text-[9px] text-muted-foreground">{f.r}%</span>
            </div>
          ))}
        </div>
      </Card>

      {!ready && (
        <button
          onClick={generate}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sprout className="h-4 w-4" />}
          {loading ? "सलाह तैयार हो रही है…" : "मेरे खेत के लिए सलाह पाएँ"}
        </button>
      )}

      {ready && (
        <>
          <SectionLabel>अभी बोने योग्य शीर्ष 3 फ़सलें</SectionLabel>
          {crops.map((c, i) => (
            <Card key={c.name} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.note}</p>
                <p className="mt-1 text-[11px] text-success">अपेक्षित उपज: {c.yield}</p>
              </div>
            </Card>
          ))}

          <Card className="space-y-2 border-warning/40 bg-warning/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-warning-foreground">
              <TriangleAlert className="h-4 w-4" /> जोखिम चेतावनी
            </div>
            <p className="text-xs text-warning-foreground">
              गुरु–शुक्र को भारी वर्षा (75%) — निचले खेतों में जलभराव का खतरा। जल निकासी नाली साफ़
              करें और यूरिया का छिड़काव टालें।
            </p>
          </Card>

          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-primary" />
              <SectionLabel>7 दिन की सिंचाई योजना</SectionLabel>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• सोम–मंगल: हल्की सिंचाई (2 सेमी), सुबह के समय</li>
              <li>• बुध–शुक्र: सिंचाई बंद — वर्षा पर्याप्त</li>
              <li>• शनि: खेत से अतिरिक्त पानी निकालें</li>
              <li>• रवि: आवश्यकता अनुसार 3 सेमी सिंचाई</li>
            </ul>
          </Card>

          <p className="text-center text-[10px] text-muted-foreground">
            मिट्टी स्वास्थ्य कार्ड उपलब्ध नहीं — सलाह केवल मौसम आधारित
          </p>
        </>
      )}
    </AppShell>
  );
}
