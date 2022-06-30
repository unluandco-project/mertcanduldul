import React from 'react'

interface MainFormListProps {
    listArray: any[]
    title: string
}

const MainFormList = ({ listArray, title }: MainFormListProps) => {

    return (
        <div className="list my-4">
            <h3 className="text-lg my-2">{title}</h3>
            <ul className="list-disc">
                {
                    listArray.map(item => {
                        return (
                            <li key={item.id}>
                                <span className="text-sm text-mainBlack">
                                    {item.label}
                                </span>
                            </li>
                        )
                    }
                    )
                }
            </ul>
        </div>
    )
}

export default MainFormList