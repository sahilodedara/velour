import { Instagram } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ProductArtwork } from "@/components/product/ProductArtwork";
import { site } from "@/config/site";
import { products } from "@/data";

const tiles = products.slice(0, 6);

export function InstagramGallery() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="@velour.atelier"
            title="Worn in the wild"
            description="Tag your pieces for a chance to be featured."
          />
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map((p, i) => (
            <StaggerItem key={p.id}>
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden"
                aria-label={`View ${p.name} on Instagram`}
              >
                <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:scale-110">
                  <ProductArtwork palette={i % 2 ? [p.palette[1], p.palette[0]] : p.palette} monogram="V" category={p.category} />
                </div>
                <div className="absolute inset-0 grid place-items-center bg-black/0 transition-colors duration-500 group-hover:bg-black/45">
                  <Instagram size={22} className="text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
