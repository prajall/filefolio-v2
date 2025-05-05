import FeaturesSection from "./homepage/FeatureSection.jsx";
import HeroSection from "./homepage/HeroSection.jsx";
import Navbar from "./components/Navbar";
export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
