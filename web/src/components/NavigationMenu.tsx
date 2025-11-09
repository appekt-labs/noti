import Logo from "./Logo"
import { Button } from "@headlessui/react"

function NavigationMenu() {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Logo className="text-emerald-600 text-2xl font-bold" />
                    <ul className="hidden md:flex gap-8 items-center">
                        <li>
                            <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                                Features
                            </a>
                        </li>
                        <li>
                            <a href="#pricing" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                                Pricing
                            </a>
                        </li>
                        <li>
                            <a href="#howitworks" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                                How it works
                            </a>
                        </li>
                    </ul>
                    <Button 
                        onClick={() => {
                            window.location.href = '/api/auth/google'
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                        Sign in
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default NavigationMenu