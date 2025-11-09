import { FiMessageSquare, FiBell, FiLayers, FiTarget, FiZap, FiShield, FiClock, FiBarChart2 } from "react-icons/fi"

function Features() {
    const features = [
        {
            title: "In-App Messaging",
            description: "Deliver contextual updates to users where they actually are in your app",
            icon: FiMessageSquare,
            color: "bg-red-100 text-red-600"
        },
        {
            title: "Real-time Updates",
            description: "Stay informed with instant notifications on message delivery and engagement",
            icon: FiZap,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Customizable Widgets",
            description: "Plug-and-play banners, toasts, and modals that match your brand",
            icon: FiLayers,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Smart Targeting",
            description: "Show messages to specific user groups, plans, or behaviors",
            icon: FiTarget,
            color: "bg-yellow-100 text-yellow-600"
        },
        {
            title: "Message Scheduling",
            description: "Schedule messages to be delivered at the perfect time for your users",
            icon: FiClock,
            color: "bg-purple-100 text-purple-600"
        },
        {
            title: "Analytics Dashboard",
            description: "Gain insights with comprehensive message performance metrics",
            icon: FiBarChart2,
            color: "bg-orange-100 text-orange-600"
        },
        {
            title: "Product Announcements",
            description: "Perfect for feature rollouts, changelogs, and system alerts",
            icon: FiBell,
            color: "bg-pink-100 text-pink-600"
        },
        {
            title: "Privacy First",
            description: "No tracking or intrusive analytics, just clean communication",
            icon: FiShield,
            color: "bg-emerald-100 text-emerald-600"
        }
    ]
    return (
        <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-700">
                        <FiZap className="w-3 h-3" />
                        <span>Our Features</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        We do it for the love of the Game. (In-App Messaging)
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Streamline your communication with powerful features and gain insights with comprehensive message performance metrics.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {
                        features.map((feature) => {
                            const IconComponent = feature.icon
                            return (
                                <div key={feature.title} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                                </div>
                            )
                        })
                    }
                </div>
                <p className="text-center text-sm text-gray-500 mt-12">
                    Noti offers comprehensive in-app messaging solutions for businesses of all sizes.
                </p>
            </div>
        </section>
    )
}

export default Features