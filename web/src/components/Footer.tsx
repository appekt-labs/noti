import Logo from './Logo'
import { FiGithub } from 'react-icons/fi'

function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <Logo className="text-emerald-400 text-2xl font-bold mb-4" />
                        <p className="text-sm text-gray-400 mb-4">In-app messaging for product updates and announcements.</p>
                        <a
                            href="https://github.com/appekt-labs/noti"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                        >
                            <FiGithub className="w-5 h-5" />
                            <span>View on GitHub</span>
                        </a>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
                            <li><a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
                            <li><a href="#howitworks" className="hover:text-emerald-400 transition-colors">How it works</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
                            <li>
                                <a
                                    href="https://github.com/appekt-labs/noti"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                                >
                                    <FiGithub className="w-4 h-4" />
                                    <span>GitHub</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Noti by Appekt Labs. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer