import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, HandHeart, CheckCircle2, Phone } from "lucide-react";
import { AppShell, Card, SectionLabel } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { store, urgencyClass, urgencyLabel, useAgri, type Case } from "@/lib/agri-store";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "सहायता नक्शा — AgriConnect" },
      {
        name: "description",
        content:
          "आस-पास के किसानों की दवा की माँग देखिए, मदद कीजिए और महामारी अलर्ट पाइए।",
      },
      { property: "og:title", content: "सहायता नक्शा — AgriConnect" },
      {
        property: "og:description",
        content: "गाँव-स्तर पर दवा की माँग और महामारी अलर्ट का लाइव नक्शा।",
      },
    ],
  }),
  component: MapPage,
});

const BOUNDS = { minLat: 24.9, maxLat: 26.0, minLng: 82.3, maxLng: 83.3 };

function pos(c: Case) {
  const x = ((c.lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = (1 - (c.lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { left: `${Math.min(92, Math.max(6, x))}%`, top: `${Math.min(90, Math.max(8, y))}%` };
}

function MapPage() {
  const { language } = useLanguage();
  const { cases } = useAgri();
  const [filter, setFilter] = useState<"all" | "crop" | "livestock">("all");
  const [selected, setSelected] = useState<string | null>(null);

  const content =
    language === "en"
      ? {
          title: "Community help map",
          subtitle: "Open requests within 10 km",
          all: "All",
          crop: "Crops",
          livestock: "Livestock",
          alert: "Outbreak alert",
          open: "Open requests",
        }
      : {
          title: "समुदाय सहायता नक्शा",
          subtitle: "10 किमी के दायरे में खुली माँगें",
          all: "सभी",
          crop: "फ़सल",
          livestock: "पशु",
          alert: "महामारी अलर्ट",
          open: "खुली माँगें",
        };

  const pins = useMemo(
    () => cases.filter((c) => (filter === "all" ? true : c.kind === filter)),
    [cases, filter],
  );

  const outbreak = useMemo(() => {
    const groups = new Map<string, Case[]>();
    cases
      .filter((c) => c.status === "Open")
      .forEach((c) => groups.set(c.disease, [...(groups.get(c.disease) ?? []), c]));
    return [...groups.entries()].find(
      ([, list]) => list.length >= 2 || list[0]?.urgency === "Outbreak-risk",
    );
  }, [cases]);

  const active = cases.find((c) => c.id === selected);

  return (
    <AppShell title={content.title} subtitle={content.subtitle}>
      {outbreak && (
        <Card className="flex gap-3 border-destructive/30 bg-destructive/5">
          <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-semibold text-destructive">{content.alert}</p>
            <p className="text-xs text-muted-foreground">
              {outbreak[0]} — {outbreak[1].length} मामले पास-पास दर्ज। सभी किसानों को सूचना भेजी गई।
            </p>
          </div>
        </Card>
      )}

      <div className="flex gap-2">
        {(
          [
            ["all", content.all],
            ["crop", content.crop],
            ["livestock", content.livestock],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              filter === k
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative h-64 overflow-hidden rounded-xl border border-border bg-secondary/50">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.9 0.02 140) 1px, transparent 1px), linear-gradient(90deg, oklch(0.9 0.02 140) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute left-[10%] top-[55%] h-1.5 w-[80%] -rotate-6 rounded-full bg-primary/25" />
        <span className="absolute bottom-2 left-3 text-[10px] text-muted-foreground">
          वाराणसी–मिर्ज़ापुर क्षेत्र
        </span>
        {pins.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            style={pos(c)}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            aria-label={c.disease}
          >
            <span
              className={`block h-4 w-4 rounded-full border-2 border-card ${
                c.status === "Fulfilled"
                  ? "bg-success"
                  : c.urgency === "Outbreak-risk" || c.urgency === "High"
                    ? "animate-pulse bg-destructive"
                    : "bg-warning"
              } ${selected === c.id ? "ring-4 ring-primary/30" : ""}`}
            />
          </button>
        ))}
      </div>

      {active && <CaseCard c={active} />}

      <SectionLabel>
        {content.open} ({pins.filter((c) => c.status === "Open").length})
      </SectionLabel>
      {pins.map((c) => (
        <CaseCard key={c.id} c={c} compact onSelect={() => setSelected(c.id)} />
      ))}
    </AppShell>
  );
}

function CaseCard({
  c,
  compact,
  onSelect,
}: {
  c: Case;
  compact?: boolean;
  onSelect?: () => void;
}) {
  return (
    <Card className="space-y-2" >
      <div className="flex items-start justify-between gap-2" onClick={onSelect}>
        <div>
          <p className="text-sm font-semibold">{c.disease}</p>
          <p className="text-xs text-muted-foreground">
            {c.farmer} · {c.district} · {c.createdAt}
          </p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${urgencyClass[c.urgency]}`}>
          {urgencyLabel[c.urgency]}
        </span>
      </div>

      <div className="rounded-lg bg-muted/60 p-2 text-xs">
        <span className="text-muted-foreground">ज़रूरत: </span>
        {c.medicine_needed} — {c.quantity}
      </div>

      {c.helpers.map((h, i) => (
        <p key={i} className="text-[11px] text-success">
          ✓ {h.name} ({h.type}) — {h.note}
        </p>
      ))}

      {!compact && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() =>
              store.offerHelp(c.id, {
                name: "जय किसान NGO",
                type: "NGO",
                note: "दवा और परिवहन उपलब्ध",
              })
            }
            className="flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground"
          >
            <HandHeart className="h-4 w-4" /> मैं मदद कर सकता हूँ
          </button>
          <button
            onClick={() => store.fulfill(c.id)}
            disabled={c.status === "Fulfilled"}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            {c.status === "Fulfilled" ? "पूरा हुआ" : "डिलीवरी पुष्टि"}
          </button>
          <button className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs text-muted-foreground">
            <Phone className="h-3.5 w-3.5" /> संपर्क (किसान की सहमति से)
          </button>
        </div>
      )}
    </Card>
  );
}
