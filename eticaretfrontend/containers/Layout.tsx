import React from 'react'
import { useAppDispatch } from 'app/hooks'
import { checkAuthUser } from 'features/auth/authSlice'
import { Navbar } from 'components'

const Layout = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch()
    React.useEffect(() => {
        dispatch(checkAuthUser())
    }, [dispatch])
    return (
        <section className='flex flex-col min-h-screen'>
            <Navbar />
            <main className='px-12 p-4'>{children}</main>
        </section>
    )
}

export default Layout