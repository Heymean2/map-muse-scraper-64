
import { Container } from "@/components/ui/container";
import { withDelay, animationClasses } from "@/lib/animations";
import { Database, Search, BarChart3, FileSpreadsheet } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Define",
    description: "Enter your search criteria including location, business type, and other filters to target exactly the data you need.",
    animation: "pulse-blue"
  },
  {
    icon: Database,
    title: "Intelligent Extraction",
    description: "Our AI-powered engine scrapes Google Maps to collect comprehensive business information matching your criteria.",
    animation: "pulse-purple"
  },
  {
    icon: BarChart3,
    title: "Data Processing",
    description: "Raw data is automatically cleaned, organized, and enriched to ensure maximum usability and insights.",
    animation: "pulse-green"
  },
  {
    icon: FileSpreadsheet,
    title: "Export & Analyze",
    description: "Download your data in multiple formats (CSV, Excel, JSON) or analyze directly in our interactive dashboard.",
    animation: "pulse-orange"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${withDelay(animationClasses.slideUp, 100)}`}>
            How It Works
          </h2>
          <p className={`text-lg text-slate-600 ${withDelay(animationClasses.slideUp, 200)}`}>
            Our powerful platform makes extracting valuable data from Google Maps simple and efficient
          </p>
        </div>

        <div className="relative">
          {/* Background connection line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary/10 via-accent/30 to-primary/10 transform -translate-y-1/2 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={step.title}
                className={`bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 ${withDelay(animationClasses.fadeIn, 300 + (index * 150))}`}
              >
                <div className="relative mb-6">
                  <div className={`absolute -left-3 -top-3 w-16 h-16 bg-primary/5 rounded-full animate-pulse opacity-70`}></div>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary relative z-10">
                    <step.icon size={28} />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="w-8 h-8 text-lg font-bold text-primary/40 flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
