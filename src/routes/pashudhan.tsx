import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QrCode, Syringe, HeartPulse, Plus, Radio } from "lucide-react";
import { AppShell, Card, SectionLabel } from "@/components/AppShell";
import { store, useAgri } from "@/lib/agri-store";

export const Route = createFileRoute("/pashudhan")({
  head: () => ({
    meta: [
      { title: "पशुधन ट्रैकिंग — AgriConnect" },
      {
        name: "description",
        content:
          "RFID/QR टैग से पशु पंजीकरण, टीकाकरण रिमाइंडर, प्रजनन चक्र और रोग की जानकारी एक जगह।",
      },
      { property: "og:title", content: "पशुधन ट्रैकिंग — AgriConnect" },
      {
        property: "og:description",
        content: "पशुओं का स्वास्थ्य रिकॉर्ड, टीकाकरण और रोग अलर्ट।",
      },
    ],
  }),
  component: PashudhanPage,
});

function PashudhanPage() {
  const { animals } = useAgri();
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState("");
  const [species, setSpecies] = useState("गाय");
  const [breed, setBreed] = useState("");

  function add() {
    if (!tag.trim()) return;
    store.addAnimal({
      id: `a-${Date.now()}`,
      tag: tag.trim(),
      species,
      breed: breed.trim() || "मिश्रित",
      ageMonths: 24,
      lastVaccination: "—",
      nextVaccination: "15 दिन बाद देय",
      breeding: "प्रजनन योग्य",
      events: [],
    });
    setTag("");
    setBreed("");
    setOpen(false);
  }

  return (
    <AppShell title="पशुधन रजिस्टर" subtitle={`${animals.length} पशु पंजीकृत`}>
      <Card className="flex gap-3 border-warning/40 bg-warning/10">
        <Syringe className="h-5 w-5 shrink-0 text-warning-foreground" />
        <div className="text-xs text-warning-foreground">
          <p className="font-semibold">टीकाकरण रिमाइंडर</p>
          RFID-UP-1042 (मुर्रा भैंस) — FMD बूस्टर 12 नवं को देय। SMS भेजा गया।
        </div>
      </Card>

      {open ? (
        <Card className="space-y-2">
          <SectionLabel>नया पशु जोड़ें</SectionLabel>
          <input
            className="field"
            placeholder="टैग नंबर (RFID / QR)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <select className="field" value={species} onChange={(e) => setSpecies(e.target.value)}>
            <option>गाय</option>
            <option>भैंस</option>
            <option>बकरी</option>
            <option>भेड़</option>
          </select>
          <input
            className="field"
            placeholder="नस्ल"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={add}
              className="rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground"
            >
              पंजीकृत करें
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-border py-2 text-xs"
            >
              रद्द करें
            </button>
          </div>
        </Card>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> पशु पंजीकृत करें
        </button>
      )}

      {animals.map((a) => (
        <Card key={a.id} className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              <QrCode className="h-4 w-4 text-secondary-foreground" />
            </span>
            <div>
              <p className="text-sm font-semibold">
                {a.species} · {a.breed}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {a.tag} · {a.ageMonths} माह
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <Info k="पिछला टीका" v={a.lastVaccination} />
            <Info k="अगला टीका" v={a.nextVaccination} />
            <Info k="प्रजनन स्थिति" v={a.breeding} />
            <Info k="कुल घटनाएँ" v={String(a.events.length)} />
          </div>

          {a.events.length > 0 && (
            <div className="space-y-1.5 border-t border-border pt-2">
              {a.events.map((e, i) => (
                <p key={i} className="text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">{e.type}</span> — {e.detail}
                  <span className="ml-1 opacity-70">
                    ({e.at} · {e.source})
                  </span>
                </p>
              ))}
            </div>
          )}

          <button
            onClick={() =>
              store.addEvent(a.id, {
                at: "अभी",
                type: "बीमारी",
                detail: "बुखार और भूख न लगना दर्ज — नक्शे पर भेजा गया",
                source: "ऐप",
              })
            }
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary py-2 text-xs font-medium text-secondary-foreground"
          >
            <HeartPulse className="h-4 w-4" /> स्वास्थ्य घटना दर्ज करें
          </button>
        </Card>
      ))}

      <Card className="space-y-1.5 bg-muted/50">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <Radio className="h-4 w-4 text-primary" /> डिवाइस इंटीग्रेशन
        </div>
        <p className="text-[11px] text-muted-foreground">
          बाहरी RFID/GSM टैग सीधे डेटा भेज सकते हैं:
        </p>
        <code className="block rounded-md bg-card px-2 py-1 text-[10px]">
          POST /api/livestock/health-event
        </code>
      </Card>
    </AppShell>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-muted/60 px-2 py-1.5">
      <p className="text-muted-foreground">{k}</p>
      <p className="font-medium text-foreground">{v}</p>
    </div>
  );
}
