import '../styles/globals.css'
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from 'app/store'
import React from 'react'
import { Layout } from 'containers'
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <Provider store={store}>
      {router.pathname === '/signin' || router.pathname === "/signup"
        ? <Component {...pageProps} />
        : <Layout>
          <Component {...pageProps} />
        </Layout>
      }
      <ToastContainer
        position="top-right"
        autoClose={1200}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable={false}
        pauseOnHover
      />
    </Provider>
  )
}

export default MyApp