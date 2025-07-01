
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ActivitiesSection from "@/components/ActivitiesSection";
import PhotoGallery from "@/components/PhotoGallery";
import EventsSection from "@/components/EventsSection";
import JoinSection from "@/components/JoinSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <ActivitiesSection />
      <PhotoGallery />
      <EventsSection />
      <JoinSection />
      <Footer />
    </div>
  );
};

export default Index;
