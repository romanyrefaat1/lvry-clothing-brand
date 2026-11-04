import { HomeHero } from "@/components/home-hero";

import {
  CollectionSection,
  BuilderPreview,
  EditorialSection,
  PhilosophySection,
  NewsletterSection,
} from "@/components/home-sections";

export default function HomePage() {
  return (
    <>

      <main>
        <HomeHero />
        <CollectionSection />
        <BuilderPreview />
        <EditorialSection />
        <PhilosophySection />
        <NewsletterSection />
      </main>

    </>
  );
}