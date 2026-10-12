"use server";

import { topics, type ContactFormState, type Topic } from "@/lib/contact";
import { publicClient, supabaseConfigured } from "@/lib/supabase/public";
import { normaliseWaybill } from "@/lib/tracking";

const text = (form: FormData, key: string, max: number) => String(form.get(key) ?? "").trim().slice(0, max);

export async function sendMessage(_prev: ContactFormState, form: FormData): Promise<ContactFormState> {
  const topic = text(form, "topic", 20) as Topic;
  const fullName = text(form, "fullName", 120);
  const phone = text(form, "phone", 30);
  const email = text(form, "email", 160);
  const waybillRaw = text(form, "waybill", 30);
  const message = text(form, "message", 2000);

  // A hidden field people never see. Only automated spam fills it in.
  if (text(form, "company_site", 100)) return { status: "sent", demo: true, name: fullName.split(" ")[0] || "there" };

  if (!(topic in topics)) return { status: "error", message: "Choose what your message is about." };
  if (fullName.length < 2) return { status: "error", message: "Enter your name so we know who to ask for." };
  if (phone.replace(/\D/g, "").length < 10) {
    return { status: "error", message: "Enter a phone number we can reach you on, with all its digits." };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "That email address is missing something. Check it, or leave it blank." };
  }
  let waybill: string | null = null;
  if (waybillRaw) {
    waybill = normaliseWaybill(waybillRaw);
    if (!waybill) {
      return { status: "error", message: "That waybill number does not look right. Check it against your SMS, or leave it blank." };
    }
  }
  if (message.length < 10) return { status: "error", message: "Tell us a little more so we can help. A sentence or two is enough." };

  const firstName = fullName.split(" ")[0];
  if (!supabaseConfigured) return { status: "sent", demo: true, name: firstName };

  const { error } = await publicClient()
    .from("contact_messages")
    .insert({ topic, full_name: fullName, phone, email: email || null, waybill, message });

  if (error) {
    console.error("contact_messages insert failed:", error.message);
    return { status: "error", message: "We could not save your message just now. Send it again, or call the depot instead." };
  }
  return { status: "sent", demo: false, name: firstName };
}
