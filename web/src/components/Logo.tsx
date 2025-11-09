function Logo({ className }: { className?: string }) {
    return (
        <div className={`${className} font-bold tracking-tight inline-flex items-baseline`}>
            <span>Noti.</span>
            <span className="ml-1.5 text-xs font-semibold text-gray-400 relative -top-0.5">BETA</span>
        </div>
    )
}

export default Logo