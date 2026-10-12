export const topics = {
  general: "A general question",
  shipment: "A shipment I have sent",
  sea: "Sea freight",
  warehousing: "Warehousing",
  account: "A monthly business account",
} as const;

export type Topic = keyof typeof topics;

export type ContactFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "sent"; demo: boolean; name: string };
