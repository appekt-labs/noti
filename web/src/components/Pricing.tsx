import { Button } from "@headlessui/react"
import { FiDollarSign, FiCheck } from "react-icons/fi"

function Pricing() {
    const plans = [
        {
            name: "Free",
            price: "$0",
            messages: "100 messages per month",
            features: ["Basic messaging", "Standard support", "Community access"],
            icon: "bg-blue-100 text-blue-600"
        },
        {
            name: "Pro",
            price: "$29",
            messages: "1000 messages per month",
            features: ["Advanced messaging", "Priority support", "Analytics dashboard", "Custom branding"],
            popular: true,
            icon: "bg-emerald-100 text-emerald-600"
        },
        {
            name: "Enterprise",
            price: "Custom",
            messages: "Unlimited messages",
            features: ["Everything in Pro", "Dedicated support", "Custom integrations", "SLA guarantee"],
            icon: "bg-purple-100 text-purple-600"
        }
    ]
    return (
        <section id="pricing" className="py-20 bg-gradient-to-b from-white to-emerald-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-700">
                        <FiDollarSign className="w-3 h-3" />
                        <span>Pricing Plans</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose the perfect plan for your team. Start free and scale as you grow with flexible pricing options.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {
                        plans.map((plan) => (
                            <div key={plan.name} className={`bg-white p-8 rounded-xl border ${plan.popular ? 'border-emerald-500 shadow-xl shadow-emerald-500/20' : 'border-gray-100 shadow-sm'} relative hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold">
                                        Most Popular
                                    </div>
                                )}
                                <div className={`w-12 h-12 ${plan.icon} rounded-lg flex items-center justify-center mb-6`}>
                                    <FiDollarSign className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-emerald-600">{plan.price}</span>
                                    {plan.price !== "Custom" && <span className="text-gray-600 text-lg">/month</span>}
                                </div>
                                <p className="text-gray-600 mb-6 text-sm">{plan.messages}</p>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <FiCheck className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button 
                                    onClick={() => {
                                        window.location.href = '/api/auth/google'
                                    }}
                                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${plan.popular ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'}`}
                                >
                                    Get Started
                                </Button>
                            </div>
                        ))
                    }
                </div>
                <p className="text-center text-sm text-gray-500 mt-12">
                    All plans include 14-day free trial. No credit card required.
                </p>
            </div>
        </section>
    )
}

export default Pricing