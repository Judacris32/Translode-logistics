"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ArrowRight, CircleCheck } from "lucide-react";
import { sendMessage } from "@/app/contact/actions";
import { topics, type ContactFormState, type Topic } from "@/lib/contact";
import { site } from "@/lib/site";

const initialState: ContactFormState = { status: "idle" };

const prompts: Record<Topic, string> = {
  general: "What would you like to know?",
  shipment: "What has happened with the shipment?",
  sea: "What are you shipping, from which port, and roughly how much?",
  warehousing: "What do you want to store, how much of it, and for how long?",
  account: "What does your business send, and how often?",
};

export function ContactForm({ initialTopic }: { initialTopic: Topic }) {
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [state, action] = useFormState(sendMessage, initialState);

  if (state.status === "sent") {
    return (
      <div className="flex flex-col gap-5 sm:flex-row" role="status">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-good-50 text-good">
          <CircleCheck size={30} aria-hidden />
        </span>
        <div>
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">Message sent. Thank you, {state.name}.</h2>
          <p className="mt-3 text-lg text-slate">We reply by phone, usually the same working day. We are open {site.hours}.</p>
          {state.demo && (
            <p className="mt-4 rounded-xl bg-mist px-4 py-3 text-sm text-slate">
              This is a demo site, so your message was checked but not sent to anyone.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
      <h2 className="text-2xl font-extrabold tracking-[-0.02em] sm:col-span-2 sm:text-3xl">Send us a message</h2>

      <div className="sm:col-span-2">
        <label htmlFor="topic" className="label mb-1.5 block">
          What is it about?
        </label>
        <select id="topic" name="topic" value={topic} onChange={(e) => setTopic(e.target.value as Topic)} className="input font-semibold">
          {(Object.keys(topics) as Topic[]).map((t) => (
            <option key={t} value={t}>
              {topics[t]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="c-name" className="label mb-1.5 block">
          Your name
        </label>
        <input id="c-name" name="fullName" type="text" required autoComplete="name" className="input" />
      </div>
      <div>
        <label htmlFor="c-phone" className="label mb-1.5 block">
          Phone number
        </label>
        <input id="c-phone" name="phone" type="tel" required autoComplete="tel" placeholder="0803 000 0000" className="input num" />
      </div>
      <div className={topic === "shipment" ? "" : "sm:col-span-2"}>
        <label htmlFor="c-email" className="label mb-1.5 block">
          Email, if you prefer a written reply
        </label>
        <input id="c-email" name="email" type="email" autoComplete="email" className="input" />
      </div>
      {topic === "shipment" && (
        <div>
          <label htmlFor="c-waybill" className="label mb-1.5 block">
            Waybill number
          </label>
          <input id="c-waybill" name="waybill" type="text" autoComplete="off" placeholder={site.sampleWaybill} className="input num uppercase placeholder:font-medium" />
        </div>
      )}

      <div className="sm:col-span-2">
        <label htmlFor="c-message" className="label mb-1.5 block">
          {prompts[topic]}
        </label>
        <textarea id="c-message" name="message" rows={5} required minLength={10} className="input !min-h-0 py-3" />
      </div>

      {/* Hidden from people; catches automated spam. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this empty
          <input name="company_site" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" && (
        <p role="alert" className="rounded-xl border border-bad-200 bg-bad-50 px-5 py-4 font-medium text-bad sm:col-span-2">
          {state.message}
        </p>
      )}

      <div className="sm:col-span-2">
        <SendButton />
      </div>
    </form>
  );
}

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-amber w-full !min-h-[3.5rem] !px-7 !text-base disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
      {pending ? "Sending message" : "Send message"}
      <ArrowRight size={19} aria-hidden />
    </button>
  );
}
