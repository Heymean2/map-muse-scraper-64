
import { useEffect } from "react";
import ScraperForm from "@/components/ScraperForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Dashboard() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <ScraperForm />
      </main>
      <Footer />
    </div>
  );
}
