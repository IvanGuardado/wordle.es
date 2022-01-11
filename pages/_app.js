import Head from "next/head";
import React from "react";
import { GameContextProvider } from "../components/GameContext";
import SiteConfig from "../lib/config";
import "../styles/globals.css";
import { useRouter } from 'next/router'


export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const word = router.query.id
  const contextProps = { word: word }

  return (
    <>
      <GameContextProvider {...contextProps}>
        <Head>
          <title>{SiteConfig.title}</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <Component {...pageProps} />
      </GameContextProvider>
    </>
  );
}
