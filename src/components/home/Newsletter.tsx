"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="relative overflow-hidden bg-noir py-24 text-noir-ink grain md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,164,100,0.18),transparent_60%)] blur-3xl" />
      <Container className="relative text-center">
        <p className="eyebrow !text-gold mb-5">Private List</p>
        <h2 className="mx-auto max-w-2xl font-display text-3xl leading-tight md:text-5xl">
          Be first to the rarest releases
        </h2>
        <p className="mx-auto mt-5 max-w-md text-noir-ink-soft">
          Join the VELOUR list for private previews, restock alerts and invitations — composed, never crowded.
        </p>

        <div className="mx-auto mt-10 max-w-md">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 border border-gold/40 bg-gold/10 px-6 py-4 text-sm text-gold"
              >
                <Check size={18} /> Welcome to the list — check your inbox.
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -8 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.includes("@")) setSent(true);
                }}
                className="flex items-stretch border border-noir-line focus-within:border-gold"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 bg-transparent px-5 py-4 text-sm text-noir-ink placeholder:text-noir-ink-soft focus:outline-none"
                />
                <button
                  type="submit"
                  className="sheen flex items-center gap-2 bg-gold px-6 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-ink-on-gold transition-colors hover:bg-gold-bright"
                >
                  Join <ArrowRight size={15} />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
          <p className="mt-4 text-xs text-noir-ink-soft">By subscribing you agree to our Privacy Policy. Unsubscribe anytime.</p>
        </div>
      </Container>
    </section>
  );
}
