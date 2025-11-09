import { FiPlay, FiLogIn, FiFolder, FiMessageSquare } from "react-icons/fi"

function HowItWorks() {
    const steps = [
        {
            title: "Sign in",
            description: "Create your account or sign in to get started with Noti",
            number: "01",
            icon: FiLogIn,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Create a project",
            description: "Set up your project and configure your messaging settings",
            number: "02",
            icon: FiFolder,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Create a message",
            description: "Design and schedule messages to send to your users",
            number: "03",
            icon: FiMessageSquare,
            color: "bg-emerald-100 text-emerald-600"
        }
    ]
    return (
        <section id="howitworks" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-700">
                        <FiPlay className="w-3 h-3" />
                        <span>Getting Started</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Get started in minutes
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Setting up Noti is quick and easy. Follow these simple steps to start engaging with your users.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {steps.map((step, index) => {
                        const IconComponent = step.icon
                        return (
                            <div key={step.title} className="relative">
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-linear-to-r from-emerald-200 to-emerald-100 transform translate-x-4 z-0"></div>
                                )}
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
                                    <div className={`w-16 h-16 ${step.color} rounded-xl flex items-center justify-center mb-4 mx-auto shadow-sm`}>
                                        <IconComponent className="w-8 h-8" />
                                    </div>
                                    <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                                        {step.number}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <p className="text-center text-sm text-gray-500 mt-12">
                    Ready to get started? Sign up now and send your first message in under 5 minutes.
                </p>
            </div>
        </section>
    )
}

export default HowItWorks