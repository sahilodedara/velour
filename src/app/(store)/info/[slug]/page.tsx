import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/config/site";

interface Doc {
  title: string;
  intro: string;
  sections: { h: string; p: string }[];
}

const DOCS: Record<string, Doc> = {
  shipping: {
    title: "Shipping & Delivery",
    intro: "Every VELOUR order is shipped fully insured and presented in our signature packaging.",
    sections: [
      { h: "Complimentary worldwide shipping", p: "All orders ship free of charge with full insurance to over 100 countries. Orders are dispatched within 1–2 business days." },
      { h: "Delivery timeframes", p: "Standard delivery arrives within 3–7 business days. Express courier options are arranged on request via our concierge." },
      { h: "Order tracking", p: "A tracking link is issued the moment your parcel leaves our atelier, viewable any time from your account." },
    ],
  },
  returns: {
    title: "Returns & Exchanges",
    intro: "Should a piece not be quite right, returns are simple and complimentary within 30 days.",
    sections: [
      { h: "30-day returns", p: "Return unworn items in their original condition and packaging within 30 days for a full refund or exchange." },
      { h: "How to return", p: "Request a prepaid return label from your account or our concierge, and drop your parcel at any partner location." },
      { h: "Exceptions", p: "For hygiene reasons, fragrance and pierced jewelry cannot be returned once opened, unless faulty." },
    ],
  },
  contact: {
    title: "Contact Concierge",
    intro: "Our client care team is available seven days a week to assist with styling, sizing and orders.",
    sections: [
      { h: "WhatsApp", p: `Message us any time at ${site.contact.phoneDisplay} for the fastest, most personal service.` },
      { h: "Email", p: `Write to ${site.contact.email} and we will respond within one business day.` },
      { h: "Hours", p: "Monday to Sunday, 9:00–21:00 (GMT)." },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    intro: "Answers to the questions we hear most often.",
    sections: [
      { h: "Are all items authentic?", p: "Every piece is sourced directly from the maison or an authorised partner and is guaranteed authentic." },
      { h: "How does WhatsApp checkout work?", p: "Add pieces to your bag and choose ‘Order on WhatsApp’. We compose a formatted order you confirm and send to our concierge to finalise payment and delivery." },
      { h: "Do you offer gift wrapping?", p: "All orders arrive beautifully boxed. Add a handwritten note at no charge via the concierge." },
    ],
  },
  about: {
    title: "About VELOUR",
    intro: "VELOUR is an original concept marketplace for modern luxury — a single, considered destination for the world's most coveted houses.",
    sections: [
      { h: "Our philosophy", p: "We believe luxury is the absence of the unnecessary. Everything we present is chosen for craft, longevity and quiet confidence." },
      { h: "The edit", p: "Rather than endless aisles, we curate a focused edit across bags, ready-to-wear, footwear, fragrance, watches and fine jewelry." },
      { h: "Service first", p: "A personal concierge accompanies every client — styling, sizing and sourcing, all a message away." },
    ],
  },
  sustainability: {
    title: "Sustainability",
    intro: "Considered consumption is at the heart of how we operate.",
    sections: [
      { h: "Responsible sourcing", p: "We prioritise houses using recycled metals, responsibly sourced stones and traceable leathers." },
      { h: "Built to last", p: "We champion pieces designed to be repaired, resoled and re-loved — the most sustainable luxury of all." },
      { h: "Mindful packaging", p: "Our packaging is FSC-certified and plastic-free wherever possible." },
    ],
  },
  careers: {
    title: "Careers",
    intro: "We are a small team obsessed with craft, service and detail.",
    sections: [
      { h: "Open roles", p: "We are not actively hiring at this time, but we always welcome exceptional people. Introduce yourself via our concierge." },
      { h: "How we work", p: "Remote-first, design-led, and relentlessly focused on the client experience." },
    ],
  },
  press: {
    title: "Press",
    intro: "For press enquiries, interviews and assets, please get in touch.",
    sections: [
      { h: "Media enquiries", p: `Contact our press office at ${site.contact.email}.` },
      { h: "Brand assets", p: "Logos and approved imagery are available to accredited media on request." },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro: "Your privacy matters. This summary explains how we handle your information.",
    sections: [
      { h: "What we collect", p: "Only what is needed to fulfil your order and improve your experience — contact details, order history and preferences." },
      { h: "How we use it", p: "To process orders, provide service and, with consent, send you previews. We never sell your data." },
      { h: "Your rights", p: "You may request access to, correction of, or deletion of your data at any time via our concierge." },
    ],
  },
  terms: {
    title: "Terms of Service",
    intro: "These terms govern your use of the VELOUR marketplace.",
    sections: [
      { h: "Orders", p: "Orders placed via WhatsApp are confirmed once availability and payment are arranged with our concierge." },
      { h: "Pricing", p: "Prices are shown in the displayed currency and may change without notice. Taxes and duties may apply at delivery." },
      { h: "Intellectual property", p: "All site content, branding and original imagery are the property of VELOUR." },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = DOCS[slug];
  return { title: doc?.title ?? "Information" };
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) notFound();

  return (
    <div className="pt-28 md:pt-36">
      <Container className="max-w-3xl pb-28">
        <Reveal>
          <p className="eyebrow mb-4">VELOUR · Information</p>
          <h1 className="font-display text-4xl md:text-6xl">{doc.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">{doc.intro}</p>
        </Reveal>
        <div className="mt-12 space-y-10">
          {doc.sections.map((s, i) => (
            <Reveal key={s.h} delay={i * 0.05}>
              <div className="border-t border-line pt-8">
                <h2 className="font-display text-2xl">{s.h}</h2>
                <p className="mt-3 leading-relaxed text-ink-soft">{s.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
