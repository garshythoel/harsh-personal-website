import { initGA, logEvent, logPageView } from './utilities/analytics'

import Head from 'next/head'
import { useEffect } from 'react'

export default function Home () {
  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA()
      window.GA_INITIALIZED = true
    }

    logPageView()
  }, [])

  return (
    <>
      <Head>
        <title>Hg</title>
        <meta
          name="description"
          content="I am an individual."
        />
        <meta name="language" content="English" />
        <meta name="googlebot" content="index,follow" />
        <link rel="shortcut icon" href="/sakura.png" />
      </Head>
      <div className="main-frame">
        <div className="main-content">
          <text className="title-text">harsh.yt</text>
          <div className="main-content-text">
            <p size="large">
              I write about&nbsp;
              <a
                onClick={() => logEvent('User', 'Clicked Substack Text Link')}
                rel="noopener noreferrer"
                target="_blank"
                href="https://harsh.substack.com"
              >
              creativity, inspiration and growth.
              </a>
            </p>
            <p>Here are my&nbsp;
              <a
                onClick={() => logEvent('User', 'Clicked Rules To Life')}
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.notion.so/Harshyt-s-Working-Manual-62b0d9a324044d37bb67ebc19a7dc236"
              >
                rules to life
              </a>
              .
            </p>
            <p size="large">
              I once started a niche but popular{' '}
              <a
                onClick={() => logEvent('User', 'Clicked Riffshop')}
                target="_blank" rel="noopener noreferrer" href="https://youtube.com/riffshop">
                youtube channel
              </a>
              &nbsp;and currently work at{' '}
              <a target="_blank" rel="noopener noreferrer" onClick={() => logEvent('User', 'Clicked Loom')} href="https://loom.com/">
                loom.com
              </a>
            </p>
            <p size="large">
              I&apos;m also fairly active on{' '}
              <a onClick={() => logEvent('User', 'Clicked Twitter')} target="_blank" rel="noopener noreferrer" href="https://twitter.com/garshythoel">
                Twitter@garshythoel
              </a>
            </p>
            <p>For long form thoughts on everything I&apos;ve mentioned, hit that subscribe button:</p>
            <a
              onClick={() => logEvent('User', 'Clicked Substack Button')}
              className="subscribe-button"
              target="_blank"
              rel="noopener noreferrer"
              href="https://harsh.substack.com/welcome"
            >
              Subscribe
            </a>
            <p className="textSize-s">(You will get an email once <i>every 2-ish weeks</i>, if inspiration has been abundant. That&apos;s wild right?)</p>
          </div>

          {/* <Tweet /> */}
        </div>
        <div className="bgimage">
          <img src="/background.jpeg" />
        </div>
      </div>
    </>
  )
}
