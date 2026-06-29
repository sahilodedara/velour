import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center pt-28">
      <Container className="text-center">
        <p className="eyebrow mb-6">Error 404</p>
        <h1 className="font-display text-[clamp(4rem,18vw,12rem)] leading-none text-gold-gradient">404</h1>
        <h2 className="mt-4 font-display text-2xl md:text-3xl">This page has slipped away</h2>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">
          The piece you&apos;re looking for may have sold out or moved. Let us guide you back to the collection.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/" variant="primary" size="lg">Return Home</Button>
          <Button href="/shop" variant="outline" size="lg">Explore the Edit</Button>
        </div>
      </Container>
    </div>
  );
}
