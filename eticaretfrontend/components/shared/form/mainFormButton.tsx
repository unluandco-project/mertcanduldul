// @ts-nocheck
import React from 'react'
interface MainFormButtonProps {
    label: string
    onClick?: (event: React.FormEvent<HTMLFormElement>) => void
    loading?: boolean
    loadingText?: string
}

const MainFormButton = ({ label, onClick = () => {}, loading = false, loadingText = "" }: MainFormButtonProps) => {
    return (
        <button
            className={`w-full bg-mainBlack text-white font-bold py-2 px-4 rounded outline-none focus:outline-none ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
            onClick={onClick}
            disabled={loading}
        >
            <span
                className="text-sm"
            >
                {loading ? loadingText : label}
            </span>
        </button>
    )
}

export default MainFormButton