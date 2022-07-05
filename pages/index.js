import Head from "next/head";
import Header from "../components/UikitHeader";
import styles from "../styles/Home.module.css";

import LottaryEntrance from "../components/LottaryEntrance";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>HardHat Raffle</title>
        <meta name="description" content="Our smart contract Raffle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <LottaryEntrance />
    </div>
  );
}
