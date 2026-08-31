import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CloudRain, Droplets, Sun, TriangleAlert, Loader2, Sprout } from "lucide-react";
import { AppShell, Card, SectionLabel } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";

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
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const content =
    language === "en"
      ? {
          title: "Weather and crop advice",
          subtitle: "Varanasi, UP · Kharif season",
          button: "Get advice for my field",
          loading: "Preparing advice…",
          forecast: "7-day forecast",
          risk: "Smart weather risk",
          irrigation: "Irrigation plan",
          cropTitle: "Top 3 crops to sow now",
          riskNote:
            "Heavy rain is expected on Thu–Fri. Drain low-lying plots, keep channels open, and postpone nitrogen spray.",
          irrigationPlan: [
            "Mon–Tue: light irrigation (2 cm) during the morning",
            "Wed–Fri: hold irrigation — rainfall is likely enough",
            "Sat: drain extra water from low fields",
            "Sun: irrigate only if the soil moisture drops below 30%",
          ],
          summary: {
            score: "Weather safety score",
            scoreValue: "82/100",
            water: "Recommended water",
            waterValue: "18 mm across 3 days",
            crop: "Best crop match",
            cropValue: "Rice (golden sub-1)",
          },
        }
      : {
          title: "मौसम व फ़सल सलाह",
          subtitle: "वाराणसी, उ.प्र. · खरीफ़ मौसम",
          button: "मेरे खेत के लिए सलाह पाएँ",
          loading: "सलाह तैयार हो रही है…",
          forecast: "7 दिन का पूर्वानुमान",
          risk: "स्मार्ट मौसम जोखिम",
          irrigation: "7 दिन की सिंचाई योजना",
          cropTitle: "अभी बोने योग्य शीर्ष 3 फ़सलें",
          riskNote:
            "गुरु–शुक्र को भारी वर्षा (75%) — निचले खेतों में जलभराव का खतरा। जल निकासी नाली साफ़ करें और यूरिया का छिड़काव टालें।",
          irrigationPlan: [
            "सोम–मंगल: हल्की सिंचाई (2 सेमी), सुबह के समय",
            "बुध–शुक्र: सिंचाई बंद — वर्षा पर्याप्त",
            "शनि: खेत से अतिरिक्त पानी निकालें",
            "रवि: आवश्यकता अनुसार 3 सेमी सिंचाई",
          ],
          summary: {
            score: "मौसम सुरक्षा स्कोर",
            scoreValue: "82/100",
            water: "सिफारिश की गई पानी",
            waterValue: "3 दिनों में 18 मिमी",
            crop: "सबसे सही फसल",
            cropValue: "धान (स्वर्णा सब-1)",
          },
        };

  function generate() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setReady(true);
    }, 1400);
  }

  return (
    <AppShell title={content.title} subtitle={content.subtitle}>
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

      <Card className="space-y-3">
        <SectionLabel>{content.summary.score}</SectionLabel>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-primary/10 p-2">
            <p className="text-[10px] text-muted-foreground">{content.summary.scoreValue}</p>
            <p className="text-xs font-semibold text-primary">{content.summary.score}</p>
          </div>
          <div className="rounded-lg bg-secondary/70 p-2">
            <p className="text-[10px] text-muted-foreground">{content.summary.water}</p>
            <p className="text-xs font-semibold">{content.summary.waterValue}</p>
          </div>
          <div className="rounded-lg bg-accent/60 p-2">
            <p className="text-[10px] text-muted-foreground">{content.summary.crop}</p>
            <p className="text-xs font-semibold">{content.summary.cropValue}</p>
          </div>
        </div>
      </Card>

      <Card>
        <SectionLabel>{content.forecast}</SectionLabel>
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
          {loading ? content.loading : content.button}
        </button>
      )}

      {ready && (
        <>
          <SectionLabel>{content.cropTitle}</SectionLabel>
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
              <TriangleAlert className="h-4 w-4" /> {content.risk}
            </div>
            <p className="text-xs text-warning-foreground">{content.riskNote}</p>
          </Card>

          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-primary" />
              <SectionLabel>{content.irrigation}</SectionLabel>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {content.irrigationPlan.map((item) => (
                <li key={item}>• {item}</li>
              ))}
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
