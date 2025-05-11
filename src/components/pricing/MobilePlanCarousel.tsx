
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { PlanCard } from "./PlanCard";

interface MobilePlanCarouselProps {
  plans: any[];
}

export function MobilePlanCarousel({ plans }: MobilePlanCarouselProps) {
  return (
    <div className="md:hidden">
      <Carousel>
        <CarouselContent>
          {plans.map((plan, index) => (
            <CarouselItem key={`mobile-${plan.name}`} className="w-full">
              <PlanCard plan={plan} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4 gap-2">
          <CarouselPrevious className="relative static left-auto translate-y-0" />
          <CarouselNext className="relative static right-auto translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
}
