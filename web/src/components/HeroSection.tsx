import { Button } from "@headlessui/react"

function HeroSection() {
    return (
        <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-emerald-50 via-white to-emerald-50/50"></div>
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-100 rounded-full blur-3xl"></div>
            </div>
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full text-sm text-gray-700 hover:border-emerald-300 transition-colors">
                    <span>New:</span>
                    <a href="#" className="text-emerald-600 font-medium hover:text-emerald-700">Self-hosted option now available</a>
                    <span>→</span>
                </div>

                <div className="text-sm md:text-base text-gray-600 mb-4 font-medium tracking-wide uppercase">
                    Create. Schedule. Engage.
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                    Beautiful in-app
                    <span className="block text-emerald-600 mt-2">notifications,</span>
                    <span className="block">owned by you.</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Noti is the open source solution for product updates and announcements. Lightweight, powerful, and privacy-first. Share updates securely in seconds with your users.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                    <Button
                        onClick={() => {
                            window.location.href = '/api/auth/google'
                        }}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                    >
                        Get started free
                    </Button>
                    <Button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-3.5 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200">
                        View documentation
                    </Button>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                    Free forever. No credit card required.
                </p>

                <a href="#pricing" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-4">
                    See pricing options
                </a>
            </div>
        </section>
    )
}

export default HeroSection