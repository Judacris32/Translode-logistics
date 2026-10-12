import { Package, Search } from "lucide-react";
import { site } from "@/lib/site";

/**
 * A plain GET form, so tracking works even before JavaScript loads
 * and the result page can be bookmarked or sent on WhatsApp.
 */
export function TrackForm({ defaultValue = "", id = "waybill" }: { defaultValue?: string; id?: string }) {
  return (
    <form action="/track" method="get" role="search" className="flex w-full flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <label htmlFor={id} className="sr-only">
          Waybill number
        </label>
        <Package size={21} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate" />
        <input
          id={id}
          name="n"
          type="text"
          required
          defaultValue={defaultValue}
          placeholder={site.sampleWaybill}
          aria-label="Waybill number"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          className="input num !min-h-[3.5rem] !pl-12 !text-lg uppercase shadow-lift placeholder:font-medium"
        />
      </div>
      <button type="submit" className="btn btn-amber !min-h-[3.5rem] shrink-0 !px-6 !text-base">
        <Search size={20} aria-hidden />
        Track shipment
      </button>
    </form>
  );
}
