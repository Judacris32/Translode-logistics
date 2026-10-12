"use client";

import { useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ArrowRight, Bike, CircleCheck, Clock, Plane, Truck, type LucideIcon } from "lucide-react";
import { requestQuote, type QuoteFormState } from "@/app/quote/actions";
import { cityNames, gateways, lanes } from "@/lib/cities";
import { formatNaira } from "@/lib/money";
import { estimate, serviceLabels, trucks, type ServiceType, type TruckSize } from "@/lib/rates";
import { site } from "@/lib/site";

const serviceMeta: Record<ServiceType, { icon: LucideIcon; help: string }> = {
  courier: { icon: Bike, help: "Parcels and documents up to 70 kg, door to door." },
  haulage: { icon: Truck, help: "A whole truck for your goods, between two cities." },
  freight: { icon: Plane, help: "Cargo flown out of Nigeria and delivered abroad." },
};

const defaults: Record<ServiceType, { origin: string; destination: string }> = {
  courier: { origin: "Lagos", destination: "Abuja" },
  haulage: { origin: "Lagos", destination: "Kano" },
  freight: { origin: "Lagos", destination: "London" },
};

const initialState: QuoteFormState = { status: "idle" };
const ring = "has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-amber";

export function QuoteForm({ initialService }: { initialService: ServiceType }) {
  const [service, setService] = useState<ServiceType>(initialService);
  const [origin, setOrigin] = useState(defaults[initialService].origin);
  const [destination, setDestination] = useState(defaults[initialService].destination);
  const [weight, setWeight] = useState(initialService === "freight" ? "25" : "5");
  const [truck, setTruck] = useState<TruckSize>("15t");
  const [state, action] = useFormState(requestQuote, initialState);

  const origins = service === "freight" ? [...gateways] : cityNames;
  const destinations = service === "freight" ? lanes.map((l) => l.city) : cityNames;

  const result = useMemo(
    () => estimate({ service, origin, destination, weightKg: Number(weight), truck }),
    [service, origin, destination, weight, truck],
  );

  function chooseService(next: ServiceType) {
    setService(next);
    setOrigin(defaults[next].origin);
    setDestination(defaults[next].destination);
    setWeight(next === "freight" ? "25" : "5");
  }

  if (state.status === "sent") {
    return (
      <div className="card mx-auto flex max-w-[44rem] flex-col gap-5 !rounded-3xl p-8 !shadow-lift sm:flex-row sm:p-10" role="status">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-good-50 text-good">
          <CircleCheck size={30} aria-hidden />
        </span>
        <div>
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">Request sent. Thank you, {state.name}.</h2>
          <p className="mt-3 text-lg text-slate">
            The depot will call you to confirm the price and agree a pickup time. We are open {site.hours}.
          </p>
          {state.demo && (
            <p className="mt-4 rounded-xl bg-mist px-4 py-3 text-sm text-slate">
              This is a demo site, so your request was checked but not sent to anyone.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="grid items-start gap-6 lg:grid-cols-[1fr_24rem] lg:gap-8">
      <div className="card !rounded-3xl p-6 !shadow-lift sm:p-9">
        <fieldset>
          <legend className="h-card">
            <StepNo n={1} />
            What are you sending?
          </legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {(Object.keys(serviceLabels) as ServiceType[]).map((s) => {
              const Icon = serviceMeta[s].icon;
              const on = service === s;
              return (
                <label
                  key={s}
                  className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 ${ring} ${
                    on ? "border-brand-700 bg-brand-50 shadow-card" : "border-line bg-white hover:border-brand-200"
                  }`}
                >
                  <input type="radio" name="service" value={s} checked={on} onChange={() => chooseService(s)} className="sr-only" />
                  <span className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${on ? "bg-brand-700 text-white" : "bg-brand-50 text-brand-700"}`}>
                    <Icon size={21} aria-hidden />
                  </span>
                  <span className="mt-3 block text-lg font-bold">{serviceLabels[s]}</span>
                  <span className="mt-0.5 block text-sm text-slate">{serviceMeta[s].help}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-10 border-t border-dashed border-line pt-9">
          <legend className="h-card float-left w-full">
            <StepNo n={2} />
            Where is it going?
          </legend>
          <div className="clear-both grid gap-5 pt-5 sm:grid-cols-2">
            <div>
              <label htmlFor="origin" className="label mb-1.5 block">
                {service === "freight" ? "Flying from" : "Collect from"}
              </label>
              <select id="origin" name="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} className="input font-semibold">
                {origins.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="destination" className="label mb-1.5 block">
                Deliver to
              </label>
              <select
                id="destination"
                name="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="input font-semibold"
              >
                {destinations.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="mt-10 border-t border-dashed border-line pt-9">
          <legend className="h-card float-left w-full">
            <StepNo n={3} />
            {service === "haulage" ? "Which truck?" : "How heavy is it?"}
          </legend>
          {service === "haulage" ? (
            <div className="clear-both grid gap-3 pt-5">
              {(Object.keys(trucks) as TruckSize[]).map((t) => (
                <label
                  key={t}
                  className={`flex cursor-pointer items-center gap-3.5 rounded-2xl border-2 px-4 py-3.5 transition-colors ${ring} ${
                    truck === t ? "border-brand-700 bg-brand-50" : "border-line bg-white hover:border-brand-200"
                  }`}
                >
                  <input type="radio" name="truck" value={t} checked={truck === t} onChange={() => setTruck(t)} className="h-4 w-4 accent-brand-700" />
                  <span className="font-semibold">{trucks[t].label}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="clear-both max-w-[15rem] pt-5">
              <label htmlFor="weightKg" className="label mb-1.5 block">
                Weight in kilograms
              </label>
              <div className="relative">
                <input
                  id="weightKg"
                  name="weightKg"
                  type="number"
                  inputMode="decimal"
                  min="0.1"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="input num !pr-12 !text-lg"
                />
                <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-slate">
                  kg
                </span>
              </div>
              <p className="mt-2 text-sm text-slate">Not sure? Guess. We weigh it at pickup.</p>
            </div>
          )}
        </fieldset>

        <fieldset className="mt-10 border-t border-dashed border-line pt-9">
          <legend className="h-card float-left w-full">
            <StepNo n={4} />
            Who should the depot call?
          </legend>
          <div className="clear-both grid gap-5 pt-5 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="label mb-1.5 block">
                Your name
              </label>
              <input id="fullName" name="fullName" type="text" required autoComplete="name" className="input" />
            </div>
            <div>
              <label htmlFor="phone" className="label mb-1.5 block">
                Phone number
              </label>
              <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="0803 000 0000" className="input num" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="label mb-1.5 block">
                Email, if you want the price in writing
              </label>
              <input id="email" name="email" type="email" autoComplete="email" className="input" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="notes" className="label mb-1.5 block">
                Anything we should know
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="What it is, how it is packed, when you need it there"
                className="input !min-h-0 py-3"
              />
            </div>
          </div>
        </fieldset>

        {state.status === "error" && (
          <p role="alert" className="mt-7 rounded-xl border border-bad-200 bg-bad-50 px-5 py-4 font-medium text-bad">
            {state.message}
          </p>
        )}

        <div className="mt-8">
          <SendButton disabled={!result.ok} />
        </div>
      </div>

      {/* The price. Stays beside the form on wide screens. */}
      <aside className="overflow-hidden rounded-3xl border border-line bg-white shadow-lift lg:sticky lg:top-28" aria-live="polite" aria-label="Your price">
        <div className="relative isolate overflow-hidden bg-navy-900 px-7 pb-7 pt-6 text-white">
          <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "radial-gradient(70% 90% at 100% 0%, rgba(253,181,21,0.3), transparent 60%)" }} />
          <p className="text-sm font-semibold text-white/75">
            {serviceLabels[service]}, {origin} to {destination}
          </p>
          {result.ok ? (
            <>
              <p className="num mt-2 text-[2.75rem] font-extrabold leading-none tracking-[-0.03em] text-amber">
                {formatNaira(result.totalKobo, { round: true })}
              </p>
              <p className="mt-3 flex items-center gap-2 text-[0.95rem] text-white/85">
                <Clock size={17} aria-hidden />
                {result.transit}
              </p>
            </>
          ) : (
            <p className="mt-3 text-lg font-semibold">{result.error}</p>
          )}
        </div>

        {result.ok && (
          <div className="px-7 py-6">
            <dl className="space-y-3">
              {result.lines.map((l) => (
                <div key={l.label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-[0.95rem] text-slate">{l.label}</dt>
                  <dd className="num shrink-0">{formatNaira(l.kobo, { round: true })}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 border-t border-dashed border-line pt-4 text-sm text-slate">
              An estimate, rounded up. The final price is set when we weigh and measure at pickup.
            </p>
          </div>
        )}
      </aside>
    </form>
  );
}

function StepNo({ n }: { n: number }) {
  return (
    <span aria-hidden className="num mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 align-[0.1em] text-sm text-amber-700">
      {n}
    </span>
  );
}

function SendButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn btn-amber w-full !min-h-[3.5rem] !px-7 !text-base disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      disabled={disabled || pending}
    >
      {pending ? "Sending request" : "Send request"}
      <ArrowRight size={19} aria-hidden />
    </button>
  );
}
