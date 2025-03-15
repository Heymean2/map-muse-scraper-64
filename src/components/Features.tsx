
import { Container } from "@/components/ui/container";
import { withDelay, animationClasses, staggerChildren } from "@/lib/animations";
import { Search, Database, Map, BarChart3, Zap, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Advanced Search",
    description: "Search for businesses across locations, categories, and keywords with our powerful search engine.",
    icon: Search,
  },
  {
    title: "Bulk Data Extraction",
    description: "Extract thousands of business listings in minutes, not hours. Save time and resources.",
    icon: Database,
  },
  {
    title: "Custom Locations",
    description: "Target specific regions, cities, or areas with our interactive map selection tool.",
    icon: Map,
  },
  {
    title: "Data Analytics",
    description: "Gain insights from the collected data with our built-in analytics dashboard.",
    icon: BarChart3,
  },
  {
    title: "Blazing Fast",
    description: "Our optimized scraping engine ensures you get your data quickly and efficiently.",
    icon: Zap,
  },
  {
    title: "Secure & Compliant",
    description: "All operations are secure and compliant with Google's terms of service.",
    icon: ShieldCheck,
  },
];

export default function Features() {
  const getDelay = staggerChildren(200, 100);

  return (
    <section id="features" className="py-24 bg-slate-50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${withDelay(animationClasses.slideUp, 100)}`}>
            Powerful Features for Your Data Needs
          </h2>
          <p className={`text-lg text-slate-600 ${withDelay(animationClasses.slideUp, 200)}`}>
            Our platform offers comprehensive tools to extract, analyze, and utilize Google Maps data efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className={`bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${withDelay(animationClasses.fadeIn, getDelay(index))}`}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent mb-4">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
