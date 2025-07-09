import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('loggedIn') === 'true';
    setLoggedIn(authStatus);
    
    if (!authStatus && !router.pathname.startsWith('/login')) {
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Pterodactyl Auto-Deploy</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} loggedIn={loggedIn} />
    </>
  );
}

export default MyApp;
