import InputForm from "./components/InputForm";
import InteractiveElements from "./components/InteractiveElements";

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <InteractiveElements />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="fade-in-up text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 max-w-3xl">
          Instantly share your files and codes in{" "}
          <span className="text-blue-700">ONE PLACE</span>
        </h1>

        <p className="fade-in-up-delay text-gray-500 text-lg md:text-xl max-w-2xl mb-8">
          Filefolio is the simplest way to share files online. Drop your
          content, grab a link, and share it instantly.
        </p>
        <InputForm />
      </div>
    </div>
  );
};

export default HeroSection;
