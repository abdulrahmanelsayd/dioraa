import { Hero } from "@/features/hero";
import { ProductGrid } from "@/features/best-sellers";
import { Footer } from "@/features/footer";
import { PageTransitionWrapper } from "@/shared/components/PageTransitionWrapper";

export default function Home() {
  return (
    <PageTransitionWrapper>
      <Hero />
      <ProductGrid />
      <Footer />
    </PageTransitionWrapper>
  );
}
