import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Loader2, Check, Paperclip, AlertCircle } from "lucide-react";
import { AppShell, Card, SectionLabel } from "@/components/AppShell";
import { useAgri } from "@/lib/agri-store";

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
];

function BimaPage() {
  const { cases } = useAgri();
  const [scheme, setScheme] = useState("pmfby");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const latest = cases[0];

  function generate() {
    setLoading(true);
    setReady(false);
    setTimeout(() => {
      setLoading(false);
      setReady(true);
    }, 1500);
  }

  return (
    <AppShell title="बीमा व योजना दस्तावेज़" subtitle="दर्ज घटनाओं से अपने आप तैयार">
      <Card className="space-y-2">
        <SectionLabel>योजना चुनें</SectionLabel>
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

      <Card className="space-y-1.5 text-xs">
        <SectionLabel>जुड़ा हुआ प्रमाण</SectionLabel>
        <p>• रोग रिपोर्ट: {latest?.disease ?? "—"} ({latest ? Math.round(latest.confidence * 100) : 0}%)</p>
        <p>• जियो-टैग फ़ोटो: {latest?.district ?? "—"}</p>
        <p>• मौसम रिकॉर्ड: 4–6 सितं भारी वर्षा (75%)</p>
        <p>• किसान: रामलाल यादव · खसरा सं. 214/3 · 1.2 हेक्टेयर</p>
      </Card>

      <button
        onClick={generate}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
        {loading ? "दस्तावेज़ बन रहे हैं…" : "दावा दस्तावेज़ बनाएँ"}
      </button>

      {ready && (
        <>
          <Card className="space-y-2">
            <SectionLabel>ज़रूरी दस्तावेज़ों की सूची</SectionLabel>
            {[
              "आधार कार्ड की प्रति",
              "खसरा/खतौनी (भूमि रिकॉर्ड)",
              "बैंक पासबुक का पहला पृष्ठ",
              "बुवाई प्रमाण पत्र (ग्राम प्रधान/पटवारी)",
              "रोग-ग्रस्त फ़सल की जियो-टैग फ़ोटो ✓ संलग्न",
              "AgriConnect निदान रिपोर्ट ✓ संलग्न",
            ].map((d) => (
              <p key={d} className="flex items-start gap-2 text-xs">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> {d}
              </p>
            ))}
          </Card>

          <Card className="space-y-2">
            <SectionLabel>पूर्व-भरा दावा सारांश</SectionLabel>
            <p className="text-xs leading-relaxed text-muted-foreground">
              दिनांक {new Date().toLocaleDateString("hi-IN")} को खसरा सं. 214/3, ग्राम — वाराणसी में
              1.2 हेक्टेयर {latest?.species ?? "धान"} की फ़सल में{" "}
              <span className="font-medium text-foreground">{latest?.disease ?? "रोग"}</span> की
              पुष्टि हुई (AI विश्वास {latest ? Math.round(latest.confidence * 100) : 0}%)। इस अवधि
              में क्षेत्र में 75% संभावना वाली भारी वर्षा दर्ज की गई, जिससे संक्रमण बढ़ा। जियो-टैग
              फ़ोटो एवं निदान रिपोर्ट संलग्न हैं। क्षति का आकलन विभागीय सर्वेक्षण हेतु प्रस्तुत है।
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-primary">
              <Paperclip className="h-3.5 w-3.5" /> 2 प्रमाण फ़ाइलें संलग्न
            </div>
          </Card>

          <Card className="space-y-2">
            <SectionLabel>पात्रता</SectionLabel>
            <p className="text-xs">
              <span className="font-medium">PMFBY</span> — संभावित पात्र (स्थानीयकृत आपदा खंड,
              अधिसूचित फ़सल)
            </p>
            <p className="text-xs">
              <span className="font-medium">राज्य आपदा राहत</span> — वर्षा-जनित क्षति के अंतर्गत
              समीक्षा योग्य
            </p>
            <p className="flex items-start gap-2 rounded-lg bg-accent/50 p-2 text-[11px] text-accent-foreground">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              अधूरी जानकारी: बैंक IFSC और बीमा पॉलिसी नंबर — कृपया स्वयं भरें। कोई भी जानकारी अपने आप
              नहीं गढ़ी गई है।
            </p>
          </Card>
        </>
      )}
    </AppShell>
  );
}
