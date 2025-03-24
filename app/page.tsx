import Hero from "@/components/hero"
import FeaturedServices from "@/components/featured-services"
import AboutPreview from "@/components/about-preview"
import PortfolioPreview from "@/components/portfolio-preview"
import ContactCTA from "@/components/contact-cta"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <FeaturedServices />
      <AboutPreview />
      <PortfolioPreview />
      <ContactCTA />
    </div>
  )
}

