import React from 'react'
import { cn } from '../../utils/helpers'

function Container({ children, className }: { children: React.ReactNode, className: string }) {
    return (
        <div className={cn('w-full', className)}>
            <div className='lg:max-w-7xl lg:mx-auto mx-2 md:mx-4 '>
                {children}
            </div>
        </div>
    )
}

export default Container