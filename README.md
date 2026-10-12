# Translode Logistics

A portfolio project by JayDev Studio: the website for a fictional Nigerian logistics company that does
courier, haulage and air freight.

This is part 1 of 3.

| Part | What it is | Status |
| --- | --- | --- |
| 1 | Marketing website: six pages, live waybill tracking with a map, price calculator, contact form, database schema | Done (this delivery) |
| 2 | Web dashboard: customer bookings, dispatcher board, admin | Not started |
| 3 | Mobile app (Expo) for customers and drivers | Not started |

## Stack

Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Supabase, Leaflet with OpenStreetMap tiles for the tracking map.

## Run it

```
npm install
npm run dev
```

Open http://localhost:3000. With no Supabase keys the site runs on the sample shipments in
`data/demo.json`, so everything works straight away. Try waybill `TRL-CR-20418836`.

Sample waybills, one for each state a shipment can be in:

| Waybill | Shows |
| --- | --- |
| TRL-CR-20418836 | Courier, out for delivery |
| TRL-HL-77105342 | Haulage, on the road |
| TRL-FR-33920718 | Air freight, in customs |
| TRL-CR-58830127 | Delivered and signed for |
| TRL-CR-91246503 | Delayed |
| TRL-HL-40067219 | Just booked |
| TRL-CR-66372051 | Same-day delivery within Lagos |
| TRL-FR-15589420 | Air freight waiting at the depot |