import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Pixela API Playground</title>
          <meta name="description" content="Try Pixela API on the browser!" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </div>
    </Layout>
  );
}
