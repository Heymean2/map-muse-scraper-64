
import { Container } from "@/components/ui/container";
import { withDelay, animationClasses } from "@/lib/animations";
import HeroHeader from "./hero/HeroHeader";
import MapDisplay from "./map/MapDisplay";

export default function Hero() {
  return (
    <section id="home" className="pt-32 pb-24 overflow-hidden">
      <Container className="relative">
        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl opacity-60 -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-40 -z-10 -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center mb-16">
          <HeroHeader />
        </div>

        {/* Data Scraping Wireframe Visualization */}
        <div className={`${withDelay(animationClasses.scaleIn, 600)}`}>
          <MapDisplay />
        </div>
      </Container>
    </section>
  );
}
