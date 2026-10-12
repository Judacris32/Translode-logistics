"use server";

import { estimate, type ServiceType, type TruckSize } from "@/lib/rates";
import { publicClient, supabaseConfigured } from "@/lib/supabase/public";

export type QuoteFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "sent"; demo: boolean; name: string };

const text = (form: FormData, key: string, max = 200) => String(form.get(key) ?? "").trim().slice(0, max);

export async function requestQuote(_prev: QuoteFormState, form: FormData): Promise<QuoteFormState> {
  const service = text(form, "service") as ServiceType;
  const origin = text(form, "origin");
  const destination = text(form, "destination");
  const weightKg = Number(text(form, "weightKg")) || undefined;
  const truck = (text(form, "truck") || undefined) as TruckSize | undefined;
  const fullName = text(form, "fullName", 120);
  const phone = text(form, "phone", 30);
  const email = text(form, "email", 160);
  const notes = text(form, "notes", 1000);

  if (!["courier", "haulage", "freight"].includes(service)) {
    return { status: "error", message: "Choose a service first." };
  }
  if (fullName.length < 2) return { status: "error", message: "Enter your name so we know who to ask for." };
  if (phone.replace(/\D/g, "").length < 10) {
    return { status: "error", message: "Enter a phone number we can reach you on, with all its digits." };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "That email address is missing something. Check it, or leave it blank." };
  }

  // Never trust a price sent from the browser. Work it out again here.
  const result = estimate({ service, origin, destination, weightKg, truck });
  if (!result.ok) return { status: "error", message: result.error };

  const firstName = fullName.split(" ")[0];
  if (!supabaseConfigured) return { status: "sent", demo: true, name: firstName };

  const { error } = await publicClient()
    .from("quote_requests")
    .insert({
      service,
      origin_city: origin,
      destination_city: destination,
      weight_grams: service === "haulage" ? null : Math.round((weightKg ?? 0) * 1000),
      truck_size: service === "haulage" ? (truck ?? "15t") : null,
      estimate_kobo: result.totalKobo,
      full_name: fullName,
      phone,
      email: email || null,
      notes: notes || null,
    });

  if (error) {
    console.error("quote_requests insert failed:", error.message);
    return {
      status: "error",
      message: "We could not save your request just now. Send it again, or call the depot and we will take it by phone.",
    };
  }
  return { status: "sent", demo: false, name: firstName };
}
