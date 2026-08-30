# Kisan Mitra

AgriConnect — Master Project Prompt (SIH 2026)

1. One-line Pitch

An AI-powered platform where a farmer uploads a photo of a diseased crop or animal, instantly gets a diagnosis and treatment plan, is placed on a live community map so nearby farmers/NGOs can see and respond to medicine needs, receives weather-driven crop recommendations, tracks livestock health, and gets auto-generated paperwork for crop/animal insurance and government schemes.

2. Problem Statement (use to anchor your pitch to an official PS)

Small and marginal farmers lack timely access to accurate crop/livestock disease diagnosis, localized medicine/resource support, climate-aware crop planning, and the documentation needed to claim insurance or government scheme benefits — leading to yield loss, delayed treatment, and missed compensation.

3. Core Modules

Module A — Crop/Livestock Disease Detection (Image → Diagnosis)

AI Prompt Template (for the vision model call):

You are an agricultural pathologist AI. You will be given an image of a crop leaf/stem/fruit or an animal.
1. Identify the species (crop or livestock type) if not provided.
2. Identify the most likely disease/pest/deficiency, with a confidence score.
3. List 2-3 differential possibilities if confidence is below 80%.
4. Give a treatment plan: recommended medicine/pesticide/vaccine (generic name), dosage, and organic/low-cost alternatives.
5. State urgency level: Low / Medium / High / Outbreak-risk.
6. Output strictly as JSON: {species, disease, confidence, differentials[], treatment{medicine, dosage, organic_alternative}, urgency, region_risk_notes}
Respond only in JSON. Do not include any other text.


Requirements:

Accept photo upload from mobile (with GPS + timestamp metadata).

Support offline capture with sync-when-online.

Support regional language voice narration of the diagnosis (TTS) for low-literacy users.

Module B — Community Help Map

Every diagnosed case (with urgency ≥ Medium) auto-pins on a map, tagged with: disease name, required medicine, quantity needed, farmer contact (opt-in), and status (Open/Fulfilled).

NGOs and nearby farmers can view pins within a radius, filter by disease/medicine, and mark "I can help" (offering medicine, transport, or expert advice).

Cluster detection: if 3+ similar-disease pins appear within a small radius/short time window, auto-escalate to an "Outbreak Alert" broadcast to all farmers in that radius.

Optional fulfillment loop: verified local input-dealers/NGOs can confirm delivery directly in-app.

Module C — Weather-Based Crop Advisory

AI Prompt Template:

You are an agronomy advisor. Given:
- Location (lat/long or district)
- 14-day weather forecast (temp, rainfall, humidity)
- Soil type/soil health card data (if available)
- Season and current/previous crop history
Recommend:
1. Top 3 suitable crops to plant now, ranked by expected yield and climate resilience.
2. Key risks in the forecast window (e.g., waterlogging, heatwave, frost) and mitigation steps.
3. Irrigation schedule suggestion for the next 7 days.
Output as JSON: {recommended_crops[], risks[], irrigation_plan}


Pull real weather forecast via a weather API (e.g., IMD/Open-Meteo).

Combine with soil data where available; degrade gracefully to weather-only if soil data is missing.

Module D — Livestock Tracking

Register livestock with ID/RFID/QR tag, breed, age, vaccination history.

Photo-based livestock disease detection (reuse Module A pipeline with livestock-specific prompt).

Vaccination and deworming reminders (push notification/SMS).

Breeding cycle tracker.

Sync livestock health records to the same community map (for disease outbreaks among animals, e.g., foot-and-mouth alerts).

Lightweight API/webhook so a separate livestock-tracking device or app can push data into AgriConnect (e.g., POST /api/livestock/health-event).

Module E — Insurance & Government Scheme Auto-Documentation

AI Prompt Template:

You are a government-scheme documentation assistant for Indian farmers. Given:
- Farmer profile (name, land records, crop/livestock type)
- Diagnosed disease/damage event (from Module A)
- Weather event data (drought/flood/heatwave dates, from Module C)
- Scheme type requested: PMFBY (crop insurance) / Animal Husbandry Scheme / State scheme
Generate:
1. A checklist of documents/evidence needed for this specific claim.
2. A pre-filled claim summary narrative (factual, based only on provided data — do not invent details).
3. Eligibility flags: which schemes this event likely qualifies for, with the relevant clause/criteria.
Output as JSON: {checklist[], claim_summary, eligible_schemes[]}


Auto-attach the diagnosis report, geotagged photo, and weather data as claim evidence.

Never fabricate farmer data — only use what's captured in-app; flag missing fields for the farmer to fill manually.

4. Suggested Tech Stack

Frontend: React (mobile-first, offline-capable PWA) + regional language support (i18n) + voice input/output.

Backend: Node.js/Express or Django REST Framework.

AI/ML: Vision model (fine-tuned CNN or vision-LLM) for disease detection; LLM for advisory/documentation generation.

Map: Mapbox/Leaflet + geospatial DB (PostGIS) for radius queries and clustering.

Weather: IMD API / Open-Meteo / ISRO Bhuvan for soil-satellite data.

Notifications: SMS/WhatsApp Business API + push notifications for low-connectivity reach.

Livestock hardware (optional, for Hardware track): low-cost RFID/QR tag + BLE/GSM module reporting to the same backend API.

5. Judge-Pleasing Talking Points

Offline-first design for real rural connectivity constraints.

Community-driven outbreak detection (network effect, not just a single-user tool).

Direct tie-in to PMFBY/animal husbandry schemes — shows real deployment and policy alignment, not just a tech demo.

Voice/regional-language accessibility for low-literacy users.

Modular architecture: each module (diagnosis, map, weather, livestock, documentation) can map to a specific official SIH problem statement if needed for alignment.

6. Suggested Demo Flow (for judges)

Farmer uploads a photo → instant diagnosis + treatment shown.

Case appears on live map → simulate an NGO "offering help" in real time.

Show weather-based crop suggestion for the same farmer's location.

Register a livestock entry, simulate a health event, show it sync to the map.

Trigger the insurance/scheme module → show auto-generated claim checklist and summary from the disease + weather data already captured.
 with minimal clean ui and hindi texts

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ce300c4d-57cc-46bc-be3b-5f278c0a9889).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
