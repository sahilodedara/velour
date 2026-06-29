import { Container, SectionHeading } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Stars } from "@/components/ui/Stars";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Eleanor V.",
    location: "London",
    rating: 5,
    body: "From the packaging to the leather itself, every detail whispers quality. VELOUR has become the only place I shop for investment pieces.",
  },
  {
    name: "Marco T.",
    location: "Milan",
    rating: 5,
    body: "The concierge styled an entire capsule for me over WhatsApp. Effortless, personal, and genuinely luxurious service.",
  },
  {
    name: "Aisha K.",
    location: "Dubai",
    rating: 5,
    body: "Fast delivery, immaculate presentation, and the watches are exactly as described. This is how luxury e-commerce should feel.",
  },
];

export function Reviews() {
  return (
    <section className="bg-bg-sunken py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="The Clientele"
            title="Held to an exacting standard"
            description="Rated 4.9 / 5 across thousands of orders worldwide."
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <figure className="relative flex h-full flex-col bg-bg-elevated p-8 shadow-card">
                <Quote size={28} className="text-gold" />
                <blockquote className="mt-5 flex-1 font-display text-lg leading-relaxed text-ink">
                  {t.body}
                </blockquote>
                <figcaption className="mt-7 flex items-center justify-between border-t border-line pt-5">
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-ink-muted">{t.location}</p>
                  </div>
                  <Stars rating={t.rating} size={13} />
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
