import Head from 'next/head'

export default function Home () {
  return (
    <>
      <Head>
        <title>Hg</title>
        <meta
          name="description"
          content="The personal website of Harshyt Goel."
        />
        <meta name="language" content="English" />
        <meta name="googlebot" content="index,follow" />
        <link rel="shortcut icon" href="/sakura.png" />
      </Head>
      <div className="main-frame">
        <div className="main-content">
          <text className="textSize-xl">harsh.yt</text>
          <div className="main-content-text">
            <p size="large">
              {' '}
              I write about inspiration and creativity in my daily life. <br />Here
              are my{' '}
              <a
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
              <a target="_blank" rel="noopener noreferrer" href="https://youtube.com/riffshop">
                youtube channel
              </a>
              &nbsp;and currently work at{' '}
              <a target="_blank" rel="noopener noreferrer" href="https://loom.com/">
                loom.com
              </a>
            </p>
            <p size="large">
              I&apos;m also fairly active on{' '}
              <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/garshythoel">
                Twitter@garshythoel
              </a>
            </p>
            <p size="large">
              If you&apos;d like to hear what i have to say, about myself, about
              life and about a whole lot of other things, big and small. Signup
              to my email list and I&apos;ll send you the first short story I
              ever wrote + some music I’ve been working on.
            </p>

            <button
              className="primary"
              target="_blank"
              href="https://harsh.substack.com/welcome"
            >
              Subscribe
            </button>
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
