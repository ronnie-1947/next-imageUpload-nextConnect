import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

interface props {
  uri: string
}

export default function Home({uri}:props) {
  console.log(uri)
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <Image src={uri} alt="image" layout="fill"/>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

import fs from 'fs'
import path from 'path'

export async function getServerSideProps() {

  const data_path = path.join(process.cwd(), 'data', 'data.json')

  const data = fs.readFileSync(data_path, 'utf-8')
  const uri = data?JSON.parse(data):''

  return {
    props: {
      uri: uri.uri
    }, // will be passed to the page component as props
  }
}
