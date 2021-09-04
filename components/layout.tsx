import Head from "next/head";

import { Box } from "@chakra-ui/react";
import styles from "./layout.module.css";

import Header from "./header";
import Sidebar from "./sidebar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>Pixela API Playground</title>
        <meta name="description" content="Try Pixela API on the browser!" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content="Pixela API Playground" />
      </Head>
      <Header />
      <Box
        as="main"
        className="main-content"
        w="full"
        maxW="8xl"
        mx="auto"
        px="12"
        pb="24"
      >
        <Box display={{ md: "flex" }}>
          <Sidebar />
          <Box flex="1" minW="0">
            <Box as="main" className={styles.main} pt="12">
              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
