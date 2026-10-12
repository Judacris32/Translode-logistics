import { lanes } from "./cities";
import { formatNaira } from "./money";
import { trucks, type ServiceType } from "./rates";

const cheapestLane = lanes.reduce((a, b) => (a.perKgKobo < b.perKgKobo ? a : b));

export type ServiceId = ServiceType | "sea" | "warehousing";

export type Service = {
  id: ServiceId;
  name: string;
  line: string;
  body: string;
  /** True when the price calculator can price it on the spot. */
  instant: boolean;
  /** What the button says. */
  action: string;
  photo: { src: string; alt: string; position: string };
  facts: { label: string; value: string }[];
  carries: string[];
  included: string[];
};

export const services: Service[] = [
  {
    id: "courier",
    name: "Courier",
    line: "Parcels and documents, door to door.",
    body: "We collect from your shop, office or house. It rides the overnight truck between our depots and is handed over at the other end by our own staff. Book before noon and we collect the same day.",
    instant: true,
    action: "Price a parcel",
    photo: {
      src: "/images/courier.jpg",
      alt: "A Translode courier in a navy uniform hands a carton to a customer at her front door, his van open behind him",
      position: "68% 50%",
    },
    facts: [
      { label: "Takes", value: "Up to 70 kg a parcel" },
      { label: "Arrives", value: "Same day in the city, 1 to 3 days between cities" },
      { label: "Costs", value: `From ${formatNaira(200_000)} within one city` },
    ],
    carries: [
      "Online orders and shop stock",
      "Documents, cheque books and certificates",
      "Phones, laptops and accessories",
      "Fabric, clothes and shoes",
    ],
    included: [
      "Pickup from your door",
      "A waybill number by SMS the moment we collect",
      "A call before delivery",
      "Cover up to ₦50,000 on every parcel, more if you declare the value",
    ],
  },
  {
    id: "haulage",
    name: "Haulage",
    line: "Full truckloads between cities.",
    body: "You book the whole truck and it carries only your goods. We load at your warehouse or at the port, strap and count with you, and the driver checks in at every stop until he offloads.",
    instant: true,
    action: "Price a truckload",
    photo: {
      src: "/images/haulage.jpg",
      alt: "A loader in a hard hat tightens a ratchet strap around a wrapped pallet beside an open truck",
      position: "45% 40%",
    },
    facts: [
      { label: "Takes", value: "5, 15 or 30 tonnes, or a 40ft container" },
      { label: "Arrives", value: "Lagos to Kano in two to three days" },
      { label: "Costs", value: `From ${formatNaira(trucks["5t"].minimumKobo)} a trip` },
    ],
    carries: [
      "Cement, rods and building materials",
      "Bagged grain, flour and farm produce",
      "Containers out of Apapa and Tin Can",
      "Factory goods to distributors",
    ],
    included: [
      "A truck matched to the load, with tarpaulin and straps",
      "Loading and offloading counted with you and signed",
      "Check-ins from the road on your waybill",
      "Goods-in-transit insurance on the declared value",
    ],
  },
  {
    id: "freight",
    name: "Air freight",
    line: "Cargo out of Nigeria by air.",
    body: "We collect, pack for the flight, prepare the export papers and clear it at the airport. At the other end our agent sees it through customs and delivers to the door.",
    instant: true,
    action: "Price an air shipment",
    photo: {
      src: "/images/air-freight.jpg",
      alt: "Ground crew load netted cargo pallets through the side door of a freighter aircraft at sunset",
      position: "58% 50%",
    },
    facts: [
      { label: "Takes", value: "5 kg to 1,000 kg a booking" },
      { label: "Arrives", value: `${cheapestLane.city} in ${cheapestLane.days.replace(" working days", "")} working days, London in 3 to 5` },
      { label: "Costs", value: `From ${formatNaira(cheapestLane.perKgKobo)} a kg` },
    ],
    carries: ["Foodstuff for family abroad", "Fabric, hair and fashion orders", "Samples and trade goods", "Personal effects"],
    included: [
      "Pickup anywhere in Lagos, Abuja or Port Harcourt",
      "Export documents and airport handling",
      "Customs clearance at the destination",
      "Delivery to the door abroad",
    ],
  },
  {
    id: "sea",
    name: "Sea freight",
    line: "Containers in and out of Lagos ports.",
    body: "Bring in a full container or share one with other importers. We book the space, work through the paperwork with you, clear at Apapa or Tin Can, and truck it to your warehouse ourselves.",
    instant: false,
    action: "Ask for a sea freight price",
    photo: {
      src: "/images/sea-freight.jpg",
      alt: "A gantry crane lifts a container off a loaded ship at the quay as the sun sets over the port",
      position: "55% 50%",
    },
    facts: [
      { label: "Takes", value: "20ft and 40ft containers, or a share of one" },
      { label: "Arrives", value: "Guangzhou to Lagos in about 35 to 45 days" },
      { label: "Costs", value: "Priced per shipment, within one working day" },
    ],
    carries: [
      "Machinery and spare parts",
      "Electronics and household goods in bulk",
      "Raw materials for factories",
      "Vehicles and heavy equipment",
    ],
    included: [
      "Space booked with the shipping line",
      "Form M and PAAR paperwork prepared with you",
      "Clearing at Apapa or Tin Can",
      "Delivery from the port on our own trucks",
    ],
  },
  {
    id: "warehousing",
    name: "Warehousing",
    line: "Storage and dispatch from our Mile 2 depot.",
    body: "Keep your stock with us and send from it as orders come in. We receive and count your goods, shelve them, pack each order and hand it straight to our own couriers.",
    instant: false,
    action: "Ask about storage",
    photo: {
      src: "/images/warehousing.jpg",
      alt: "A forklift moves a wrapped pallet down a racked warehouse aisle while a supervisor checks stock on a tablet",
      position: "45% 50%",
    },
    facts: [
      { label: "Takes", value: "From one pallet to a whole bay" },
      { label: "Arrives", value: "Orders packed the day they come in" },
      { label: "Costs", value: "Per pallet, per week. Priced on request" },
    ],
    carries: [
      "Stock for online shops",
      "Imported goods waiting for distribution",
      "Seasonal and overflow stock",
      "Goods held for collection",
    ],
    included: [
      "Goods counted in and counted out",
      "A stock report whenever you ask",
      "Order packing and labelling",
      "Guarded, covered and insured storage",
    ],
  },
];

/** Where a service's button goes: the calculator if it can be priced now, otherwise the contact form. */
export const serviceHref = (s: Service) => (s.instant ? `/quote?service=${s.id}` : `/contact?topic=${s.id}`);
