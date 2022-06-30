import React from 'react'

interface MainFormInputProps {
  label: string
  placeholder: string
  type?: string
  id: string
  name: string
  register: any
}

const MainFormInput = ({ label, placeholder, id, type = "text", name, register }: MainFormInputProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="email" className="text-sm">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        className="w-full border border-gray-300 rounded p-2 outline-mainBlack"
        placeholder={placeholder}
        {...register(name)}
      />
    </div>
  )
}

export default MainFormInput