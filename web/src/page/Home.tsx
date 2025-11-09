import NavigationMenu from "../components/NavigationMenu"
import HeroSection from "../components/HeroSection"
import Features from "../components/Features"
import Pricing from "../components/Pricing"
import HowItWorks from "../components/HowItWorks"
import Footer from "../components/Footer"

function Home() {
    return (
        <div className="min-h-screen bg-white">
            <NavigationMenu />
            <HeroSection />
            <Features />
            <HowItWorks />
            <Pricing />
            <Footer />
        </div>
    )
}

export default Home