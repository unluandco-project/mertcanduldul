import React from 'react'

interface MainFormHeaderProps {
    title: string
    subtitle: string
}

const MainFormHeader = ({ title, subtitle }: MainFormHeaderProps) => {
    return (
        <div className="space-y-6">
            <h1 className="text-4xl text-center">{title}</h1>
            <p className="text-thin text-xs">{subtitle}</p>
        </div>
    )
}

export default MainFormHeader