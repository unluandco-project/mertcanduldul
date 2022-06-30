import React from 'react'
import Link from 'next/link'

interface MainFormFooterProps {
    title: string
    subtitle: string
    link: string
}

const MainFormFooter = ({ title, subtitle, link }: MainFormFooterProps) => {
    return (
        <div>
            <p className="text-sm text-center">
                <span className="text-mainBlack">{title}</span>
                <span className="text-mainBlack ml-2">
                    <Link href={link}>
                        <a className="text-mainBlack font-bold hover:underline">{subtitle}</a>
                    </Link>
                </span>
            </p>
        </div>
    )
}

export default MainFormFooter