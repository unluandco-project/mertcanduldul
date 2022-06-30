import { useAppDispatch, useAppSelector } from 'app/hooks'
import { Toast } from 'components'
import { logoutUser } from 'features/auth/authSlice'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const Navbar = () => {
  const { isAuthenticated, authenticatedUser } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch();
  const router = useRouter();

  const notify = React.useCallback((type: "info" | "success" | "warning" | "error", message: string) => {
    Toast({ type, message });
  }, []);

  const handleLogout = async () => {
    try {
      dispatch(logoutUser())
      notify("success", "Başarıyla çıkış yapıldı.")
      router.push('/signin')
    } catch (err) {
      notify("error", "Çıkış yapılırken bir sorun oluştu.")
    }
  }


  return (
    // tailwind css navabr
    <nav className='flex items-center justify-between flex-wrap p-4 px-24 shadow-md mb-4'>
      <ul className='flex items-center justify-between w-full'>
        <li className='mr-5'>
          <Link href={"/"}>
            <a className='text-white text-xl font-bold'>
              <span className='text-black'>
                Anasayfa
              </span>
            </a>
          </Link>
        </li>
        {
          isAuthenticated ? (
            <ul className='flex items-center justify-center'>
              <li className='mr-5'>
                <Link href={"/categories"}>
                  <a className={`${router.pathname === "/categories" ? "text-red-600" : "text-gray-900"} text-sm outline-none`}>
                    Kategoriler
                  </a>
                </Link>
              </li>
              <li className='mr-5'>
                <Link href={"/products"}>
                  <a className={`${router.pathname === "/products" ? "text-red-600" : "text-gray-900"} text-sm outline-none`}>
                    Ürünler
                  </a>
                </Link>
              </li>
              <li className='mr-5'>
                <Link href={"/account"}>
                  <a className={`${router.pathname === "/account" ? "text-red-600" : "text-gray-900"} text-sm outline-none`}>
                    Hesabım
                  </a>
                </Link>
              </li>
              <li className='mr-5'>
                <button
                  className='text-gray-900 text-sm outline-none'
                  onClick={handleLogout}
                >
                  Çıkış Yap
                </button>
              </li>
              <li className='mr-5 text-gray-900 text-sm '>

                <p className='mt-1'>
                  <span className='mr-2'>|</span>
                  {authenticatedUser.user.UserName}
                </p>
              </li>
            </ul>
          ) :
            (
              <ul className='flex'>
                <li className='mr-5'>
                  <Link href={"/signin"}>
                    <a className={"text-gray-900 text-sm outline-none"}>
                      Giriş Yap
                    </a>
                  </Link>
                </li>
                <li className='mr-5'>
                  <Link href={"/signup"}>
                    <a className={"text-gray-900 text-sm outline-none"}>
                      Kayıt Ol
                    </a>
                  </Link>
                </li>
              </ul>
            )
        }
      </ul>
    </nav>
  )
}

export default Navbar