import Link from "next/link";
import { VENDOR_APP_URL } from "@/lib/brand";

// What customers can book in phase 1 (PRD §3).
const BOOKING_TYPES = [
  {
    title: "Group tours",
    body: "Join a fixed-date trip and book just your seats. Naran, Hunza, Skardu and more.",
    unit: "Per seat",
  },
  {
    title: "Private tours",
    body: "The whole trip for your family or friends, on the dates you choose.",
    unit: "Per group",
  },
  {
    title: "Cars and vans",
    body: "Corolla to Prado, Hiace to Grand Cabin. With a driver or self-drive.",
    unit: "Per day or trip",
  },
  {
    title: "Coasters and buses",
    body: "Move a big group, a school trip or a wedding party in one booking.",
    unit: "Per vehicle",
  },
];

const PROMISES = [
  {
    title: "Verified operators",
    body: "Every vendor is checked by our team before they can list a single trip.",
  },
  {
    title: "Reviews from real travellers",
    body: "Only people who completed a trip can review it.",
  },
  {
    title: "Clear cancellation rules",
    body: "See exactly what you get back before you book, not after.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-sand-200 bg-gradient-to-b from-sand-100 to-sand-50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="text-sm font-medium uppercase tracking-wider text-brand-700">
            Tours and transport across Pakistan
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            Book the whole trip in one place. The tour, the seats, the bus.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-stone-600">
            Compare trips from verified tour operators, read real reviews, and book a seat, a private
            tour or a vehicle without chasing anyone on WhatsApp.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-lg bg-brand-700 px-5 py-3 text-sm font-medium text-white hover:bg-brand-800"
            >
              Create a free account
            </Link>
            <a
              href={VENDOR_APP_URL}
              className="rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-900 hover:bg-stone-50"
            >
              I run a tour company
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold text-stone-900">What you can book</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BOOKING_TYPES.map((type) => (
            <div key={type.title} className="rounded-2xl border border-sand-200 bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-brand-700">{type.unit}</p>
              <h3 className="mt-2 text-lg font-semibold text-stone-900">{type.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{type.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-sand-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-3">
          {PROMISES.map((promise) => (
            <div key={promise.title}>
              <h3 className="font-semibold text-stone-900">{promise.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{promise.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl bg-brand-800 px-6 py-12 text-white sm:px-12">
          <h2 className="text-2xl font-semibold">Run tours or rent out vehicles?</h2>
          <p className="mt-3 max-w-xl text-brand-100">
            List your packages, fill seats, manage bookings and reply to reviews from one dashboard.
          </p>
          <a
            href={VENDOR_APP_URL}
            className="mt-8 inline-block rounded-lg bg-white px-5 py-3 text-sm font-medium text-brand-800 hover:bg-brand-50"
          >
            Become a vendor
          </a>
        </div>
      </section>
    </main>
  );
}
