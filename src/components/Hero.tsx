
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { withDelay, animationClasses } from "@/lib/animations";

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
          <div className={`inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-accent/10 text-accent rounded-full ${withDelay(animationClasses.fadeIn, 100)}`}>
            <span className="relative">Google Maps Data at Your Fingertips</span>
          </div>
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 ${withDelay(animationClasses.slideUp, 200)}`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Extract Valuable Data</span> from Google Maps with Ease
          </h1>
          
          <p className={`text-xl text-slate-600 max-w-2xl mx-auto mb-8 ${withDelay(animationClasses.slideUp, 300)}`}>
            The most powerful and intuitive tool for extracting business data from Google Maps. Save hours of manual research and get more leads.
          </p>
          
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${withDelay(animationClasses.slideUp, 400)}`}>
            <Button size="lg" className="min-w-[150px] h-12 text-base">
              Start Scraping Now
            </Button>
            <Button size="lg" variant="outline" className="min-w-[150px] h-12 text-base">
              Watch Demo
            </Button>
          </div>

          <div className={`mt-12 flex items-center justify-center gap-6 ${withDelay(animationClasses.fadeIn, 500)}`}>
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-xs font-medium">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="text-sm text-slate-600">
              <span className="font-semibold">2,500+</span> companies already scraping
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className={`relative mx-auto max-w-5xl ${withDelay(animationClasses.scaleIn, 600)}`}>
          <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl ring-1 ring-slate-200">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <div className="w-full h-full bg-white/80 backdrop-blur-sm p-6 rounded-xl overflow-hidden">
                <div className="h-12 w-full bg-slate-100 rounded-lg mb-6 flex items-center px-4">
                  <div className="w-3/4 h-6 bg-slate-200 rounded"></div>
                </div>
                <div className="grid grid-cols-3 gap-6 h-[calc(100%-4rem)]">
                  <div className="col-span-1 bg-slate-100 rounded-lg p-4">
                    <div className="h-8 w-1/2 bg-slate-200 rounded mb-4"></div>
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-10 bg-white rounded flex items-center px-3">
                          <div className="w-full h-4 bg-slate-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 bg-slate-100 rounded-lg">
                    <div className="h-full w-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,1,0,0/600x400?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw')] bg-cover bg-center rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-accent/10 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <div className="text-sm font-medium text-accent">Beautiful and intuitive interface for scraping data</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
