import { Upload, LinkIcon, Lock, ArrowRight } from "lucide-react";
import Container from "../components/Container";
import Script from "next/script";
import Link from "next/link";

const FeaturesSection = () => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const features = [
    {
      id: "share-instantly",
      title: "Share Instantly",
      description:
        "Upload and share your files and code snippets with just a few clicks. No account required, no complicated setup. Just drag, drop, and share.",
      icon: <Upload className="w-10 h-10" />,
      color: "bg-gradient-to-br from-blue-500 to-cyan-400",
      image: "/placeholder.svg?height=300&width=400",
      imageAlt: "Instant file sharing illustration",
    },
    {
      id: "custom-url",
      title: "Custom URL",
      description:
        "Create memorable, easy-to-share links with custom paths. Make your shared content more accessible with personalized URLs that are easy to remember.",
      icon: <LinkIcon className="w-10 h-10" />,
      color: "bg-gradient-to-br from-purple-500 to-slate-400",
      image: "/placeholder.svg?height=300&width=400",
      imageAlt: "Custom URL illustration",
    },
    {
      id: "private-folio",
      title: "Private Folio",
      description:
        "Secure your shared files with password protection. Filefolio lets you control access to private content with expiration dates and custom links.",
      icon: <Lock className="w-10 h-10" />,
      color: "bg-gradient-to-br from-amber-500 to-orange-400",
      image: "/placeholder.svg?height=300&width=400",
      imageAlt: "Private folio security illustration",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      {/* for animating in view */}
      <Script id="fade-in-up" strategy="afterInteractive">
        {`
          document.addEventListener("DOMContentLoaded", () => {
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add("show");
                  observer.unobserve(entry.target);
                }
              });
            }, { threshold: 0.1 });

            document.querySelectorAll(".fade-in-up").forEach(el => {
              observer.observe(el);
            });
          });
        `}
      </Script>
      <div className="container mx-auto px-4">
        {/* Section header */}
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features, Simple Experience
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Everything you need to share your content efficiently, securely,
              and on your terms.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className="fade-in-up bg-white rounded-xl shadow-md overflow-hidden"
                variants={itemVariants}
              >
                <div className="p-6">
                  <div className="flex gap-4 items-center mb-6">
                    <div
                      className={`${feature.color} w-10 h-10 p-2 rounded-lg flex items-center justify-center text-white `}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold ">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <Link
                    href={`#${feature.id}`}
                    className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-800"
                  >
                    Learn more <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Filefolio for File Sharing?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Instantly upload and share files, images, or code snippets without
              creating an account or installing software.
            </p>
          </div> */}
        </Container>
      </div>
      {/* <p class="text-sm text-center mt-10">
        Filefolio is the simplest way to share files, images, and code online.
        With no sign-up required, you can upload and share instantly using
        custom links. Whether you're sending code snippets, design mockups, or
        documents, Filefolio gives you a fast, secure, and seamless experience.
      </p> */}
    </section>
  );
};

export default FeaturesSection;
