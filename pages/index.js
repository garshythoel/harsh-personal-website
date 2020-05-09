import { GALink, initGA, logEvent, logPageView } from '../utilities/analytics'

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
              <GALink
                eventLabel="Clicked Substack Text Link"
                rel="noopener noreferrer"
                target="_blank"
                to="https://harsh.substack.com"
              >
              creativity, inspiration and growth.
              </GALink>
            </p>
            <p>Here are my&nbsp;
              <GALink
                eventLabel="Clicked Rules To Life"
                rel="noopener noreferrer"
                target="_blank"
                to="https://www.notion.so/Harshyt-s-Working-Manual-62b0d9a324044d37bb67ebc19a7dc236"
              >
                rules to life
              </GALink>
              .
            </p>
            <p size="large">
              I once started a niche but popular{' '}
              <GALink
                eventLabel="Clicked Riffshop"
                rel="noopener noreferrer"
                target="_blank"
                to="https://youtube.com/riffshop"
              >
                youtube channel
              </GALink>
              &nbsp;and currently work at{' '}
              <GALink
                eventLabel="Clicked Loom"
                target="_blank"
                rel="noopener noreferrer"
                to="https://loom.com/">
                loom.com
              </GALink>
            </p>
            <p size="large">
              I&apos;m also fairly active on{' '}
              <GALink
                eventLabel="Clicked Twitter"
                target="_blank"
                rel="noopener noreferrer"
                to="https://twitter.com/garshythoel">
                Twitter@garshythoel
              </GALink>
            </p>
            <p>For long form thoughts on everything I&apos;ve mentioned, hit that subscribe button:</p>
            <GALink
              eventLabel="Clicked Substack Button"
              className="subscribe-button"
              target="_blank"
              rel="noopener noreferrer"
              to="https://harsh.substack.com/welcome"
            >
              Subscribe
            </GALink>
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
