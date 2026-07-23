
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ActivitiesSection from "@/components/ActivitiesSection";
import PhotoGallery from "@/components/PhotoGallery";
import EventsSection from "@/components/EventsSection";
import JoinSection from "@/components/JoinSection";
import Footer from "@/components/Footer";
import ApodSection from "@/components/ApodSection";
import SkyTonight from "@/components/SkyTonight";
import LiveSkyBar from "@/components/LiveSkyBar";
import ConstellationDivider from "@/components/ConstellationDivider";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <LiveSkyBar />
      <HeroSection />
      <ApodSection />
      <ConstellationDivider />
      <AboutSection />
      <ActivitiesSection />
      <SkyTonight />
      <ConstellationDivider />
      <PhotoGallery />
      <EventsSection />
      <JoinSection />
      <Footer />
    </div>
  );
};

export default Index;
