import { createFileRoute } from "@tanstack/react-router";
import { CloudRain, Droplets, Sun, TriangleAlert, Sprout, Wind, Zap } from "lucide-react";
import { AppShell, Card, SectionLabel } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/mausam")({
  head: () => ({
    meta: [
      { title: "मौसम आधारित फ़सल सलाह — AgriConnect" },
      {
        name: "description",
        content: "14 दिन के मौसम पूर्वानुमान और मिट्टी के आधार पर सही फ़सल, जोखिम और सिंचाई योजना।",
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

const temperatureData = [
  { day: "Mon", temp: 34 },
  { day: "Tue", temp: 33 },
  { day: "Wed", temp: 31 },
  { day: "Thu", temp: 29 },
  { day: "Fri", temp: 28 },
  { day: "Sat", temp: 30 },
  { day: "Sun", temp: 32 },
];

const rainfallData = [
  { day: "Mon", rainfall: 10 },
  { day: "Tue", rainfall: 18 },
  { day: "Wed", rainfall: 15 },
  { day: "Thu", rainfall: 32 },
  { day: "Fri", rainfall: 38 },
  { day: "Sat", rainfall: 8 },
  { day: "Sun", rainfall: 5 },
];

const advisories = [
  {
    en: {
      title: "Delay pesticide spraying",
      description:
        "70% simulated rain probability tomorrow would wash off applications. Prefer Saturday's dry window.",
    },
    hi: {
      title: "कीटनाशक छिड़काव टालें",
      description: "कल 70% बारिश होने से दवा बह जाएगी। शनिवार की सूखी खिड़की में छिड़कें।",
    },
    color: "bg-yellow-50 border-yellow-200",
    textColor: "text-yellow-900",
  },
  {
    en: {
      title: "Elevated pest pressure",
      description:
        "Humidity above 85% for 48 hours increases simulated bollworm activity — increase scouting frequency.",
    },
    hi: {
      title: "कीटों का दबाव बढ़ता है",
      description:
        "48 घंटे 85% से अधिक आर्द्रता से सुंडी का प्रकोप बढ़ेगा — नजरों की आवृत्ति बढ़ाएँ।",
    },
    color: "bg-rose-50 border-rose-200",
    textColor: "text-rose-900",
  },
  {
    en: {
      title: "Good irrigation balance",
      description:
        "Soil moisture is adequate in this mock model; skip irrigation for the next 3 days.",
    },
    hi: {
      title: "अच्छा सिंचाई संतुलन",
      description: "मिट्टी की नमी इस माडल में अच्छी है; अगले 3 दिन सिंचाई न करें।",
    },
    color: "bg-cyan-50 border-cyan-200",
    textColor: "text-cyan-900",
  },
];

const cropSuitability = [
  {
    en: "Cotton",
    hi: "कपास",
    en_desc: "Current stage: boll formation (mock)",
    hi_desc: "वर्तमान चरण: बोल निर्माण",
    status: "Suitable",
    en_status: "Suitable",
    hi_status: "उपयुक्त",
  },
  {
    en: "Soybean",
    hi: "सोयाबीन",
    en_desc: "Good moisture window (mock)",
    hi_desc: "अच्छी नमी की खिड़की",
    status: "Suitable",
    en_status: "Suitable",
    hi_status: "उपयुक्त",
  },
  {
    en: "Gram",
    hi: "चना",
    en_desc: "Plan for post-monsoon sowing (mock)",
    hi_desc: "मानसून के बाद बुवाई योजना",
    status: "Moderate",
    en_status: "Moderate",
    hi_status: "मध्यम",
  },
  {
    en: "Wheat",
    hi: "गेहूँ",
    en_desc: "Wait for temperature drop (mock)",
    hi_desc: "तापमान में गिरावट की प्रतीक्षा करें",
    status: "Low",
    en_status: "Low",
    hi_status: "कम",
  },
];

const crops = [
  { name: "धान (स्वर्णा सब-1)", yield: "उच्च", note: "जलभराव सहनशील — बारिश के अनुकूल" },
  { name: "अरहर (दाल)", yield: "मध्यम", note: "कम पानी, मिट्टी में नाइट्रोजन बढ़ाती है" },
  { name: "मक्का (हाइब्रिड)", yield: "मध्यम", note: "अच्छी निकासी वाले खेत में ही लगाएँ" },
];

function MausamPage() {
  const { language } = useLanguage();

  const content =
    language === "en"
      ? {
          title: "Weather & Advisory",
          subtitle: "Simulated forecast and field guidance for Akola",
          today: "TODAY",
          tomorrow: "TOMORROW",
          tempChart: "7-DAY TEMPERATURE (SIMULATED)",
          rainfallChart: "RAINFALL OUTLOOK (MM, SIMULATED)",
          advisories: "ADVISORIES (SIMULATED)",
          cropSuitability: "CROP SUITABILITY (SIMULATED)",
          metrics: {
            temp: "29°C",
            tempLabel: "Humid, partly cloudy",
            humidity: "82%",
            humidityLabel: "Simulated reading",
            rain: "55%",
            rainLabel: "Next 24 hours (mock)",
            wind: "12 km/h",
            windLabel: "Spray caution above 15",
          },
          tomorrowForecast: {
            temp: "31°C",
            condition: "Scattered showers",
            details: "Humidity 86% · Rain 70% · Wind 15 km/h",
          },
          disclaimer:
            "Weather values, rainfall charts and advisories are static mock data for demonstration. Do not use for real spraying, irrigation or sowing decisions.",
        }
      : {
          title: "मौसम व सलाह",
          subtitle: "अकोला के लिए सिम्युलेटेड पूर्वानुमान और खेत सलाह",
          today: "आज",
          tomorrow: "कल",
          tempChart: "7 दिन का तापमान (सिम्युलेटेड)",
          rainfallChart: "वर्षा दृष्टिकोण (मिमी, सिम्युलेटेड)",
          advisories: "सलाह (सिम्युलेटेड)",
          cropSuitability: "फसल उपयुक्तता (सिम्युलेटेड)",
          metrics: {
            temp: "29°C",
            tempLabel: "आर्द्र, आंशिक बादल",
            humidity: "82%",
            humidityLabel: "सिम्युलेटेड रीडिंग",
            rain: "55%",
            rainLabel: "अगले 24 घंटे (माक)",
            wind: "12 किमी/घं",
            windLabel: "15 से ऊपर छिड़काव सावधानी",
          },
          tomorrowForecast: {
            temp: "31°C",
            condition: "बिखरी बारिश",
            details: "आर्द्रता 86% · वर्षा 70% · हवा 15 किमी/घं",
          },
          disclaimer:
            "मौसम मान, वर्षा चार्ट और सलाह प्रदर्शन के लिए स्थिर माक डेटा हैं। वास्तविक छिड़काव, सिंचाई या बुवाई निर्णयों के लिए उपयोग न करें।",
        };

  return (
    <AppShell title={content.title} subtitle={content.subtitle}>
      {/* TODAY - 4 Metric Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {content.today}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Temperature Card */}
          <Card className="flex flex-col items-center gap-2 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Sun className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{content.metrics.temp}</p>
            <p className="text-[10px] text-center text-muted-foreground">
              {content.metrics.tempLabel}
            </p>
          </Card>

          {/* Humidity Card */}
          <Card className="flex flex-col items-center gap-2 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
              <Droplets className="h-5 w-5 text-cyan-600" />
            </div>
            <p className="text-2xl font-bold">{content.metrics.humidity}</p>
            <p className="text-[10px] text-center text-muted-foreground">
              {content.metrics.humidityLabel}
            </p>
          </Card>

          {/* Rain Chance Card */}
          <Card className="flex flex-col items-center gap-2 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <CloudRain className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold">{content.metrics.rain}</p>
            <p className="text-[10px] text-center text-muted-foreground">
              {content.metrics.rainLabel}
            </p>
          </Card>

          {/* Wind Card */}
          <Card className="flex flex-col items-center gap-2 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <Wind className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold">{content.metrics.wind}</p>
            <p className="text-[10px] text-center text-muted-foreground">
              {content.metrics.windLabel}
            </p>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-3">
        {/* Temperature Chart */}
        <Card className="space-y-2">
          <SectionLabel>{content.tempChart}</SectionLabel>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 35]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: "#22c55e", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Rainfall Chart */}
        <Card className="space-y-2">
          <SectionLabel>{content.rainfallChart}</SectionLabel>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={rainfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="rainfall" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Advisories */}
      <div className="space-y-3">
        <SectionLabel>{content.advisories}</SectionLabel>
        <div className="space-y-2">
          {advisories.map((advisory, idx) => {
            const adv = language === "en" ? advisory.en : advisory.hi;
            return (
              <Card key={idx} className={`space-y-1.5 border-2 ${advisory.color}`}>
                <p className={`font-semibold text-sm ${advisory.textColor}`}>{adv.title}</p>
                <p className={`text-xs ${advisory.textColor}`}>{adv.description}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tomorrow */}
      <Card className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {content.tomorrow}
        </h3>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
            <CloudRain className="h-5 w-5 text-cyan-600" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold">{content.tomorrowForecast.temp}</p>
            <p className="text-sm text-muted-foreground">{content.tomorrowForecast.condition}</p>
            <p className="text-xs text-muted-foreground mt-1">{content.tomorrowForecast.details}</p>
          </div>
        </div>
      </Card>

      {/* Crop Suitability */}
      <Card className="space-y-3">
        <SectionLabel>{content.cropSuitability}</SectionLabel>
        <div className="space-y-2">
          {cropSuitability.map((crop, idx) => {
            const name = language === "en" ? crop.en : crop.hi;
            const desc = language === "en" ? crop.en_desc : crop.hi_desc;
            const status = language === "en" ? crop.en_status : crop.hi_status;

            const statusColor =
              crop.status === "Suitable"
                ? "bg-green-100 text-green-700"
                : crop.status === "Moderate"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700";

            return (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 py-2 border-b last:border-b-0"
              >
                <div className="flex items-center gap-2 flex-1">
                  <Sprout className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap ${statusColor}`}
                >
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="flex gap-2 rounded-lg bg-slate-50 p-3 text-xs text-muted-foreground">
        <Zap className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>{content.disclaimer}</p>
      </div>
    </AppShell>
  );
}
