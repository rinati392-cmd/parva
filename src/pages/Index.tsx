import { useState } from "react";
import Header from "@/components/site/Header";
import HeroStory from "@/components/site/HeroStory";
import TreatmentFinder from "@/components/site/TreatmentFinder";
import TreatmentsStory from "@/components/site/TreatmentsStory";
import Approach from "@/components/site/Approach";
import Faq from "@/components/site/Faq";
import Booking from "@/components/site/Booking";
import Footer from "@/components/site/Footer";
import MobileCta from "@/components/site/MobileCta";
import type { TreatmentId } from "@/components/site/treatment-data";
import { scrollToId } from "@/lib/utils";

const Index = () => {
  const [treatment, setTreatment] = useState<TreatmentId | "">("");
  const choose = (id: TreatmentId) => {
    setTreatment(id);
    scrollToId("booking");
  };

  return (
    <>
      <a href="#booking" className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-primary-foreground">
        דלגו לקביעת תור
      </a>
      <Header />
      <main>
        <HeroStory />
        <TreatmentFinder onChoose={choose} />
        <TreatmentsStory onChoose={choose} />
        <Approach />
        <Faq />
        <Booking treatment={treatment} onTreatmentChange={setTreatment} />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
};

export default Index;
