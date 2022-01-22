// Head
import Head from 'next/head'

//Script
import Script from 'next/script'

// Router
import { useRouter } from 'next/router'

// Sidebar
import Sidebar from '../components/Sidebar'

// Navbar
import Navbar from '../components/Navbar'




// init MyApp component
const MyApp = ({ Component, pageProps }) => {

  // init router
  const router = useRouter()


  return (
    <>
      <Head>

        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="Bitke Admin Dashboard" />
        <meta name="author" content="Bitke" />
        <meta name="keywords" content="Bitke dashboard" />

        <link rel="preconnect" href="https://fonts.gstatic.com" />

        <title>Bitke Dashboard</title>

        <link href="/css/app.css" rel="stylesheet" />
        <link href="/css/custom.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&amp;display=swap" rel="stylesheet" />

      </Head>


      <Script src="/js/app.js" strategy="beforeInteractive" />

      {router.pathname === '/' ? <Component {...pageProps} /> :
        
        <div className="wrapper">
          <Sidebar />
          <div className="main">
            <Navbar />
            <Component {...pageProps} />
          </div>
        </div>
      }

    </>
  )


}

export default MyApp
