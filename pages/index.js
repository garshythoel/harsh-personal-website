import { Align, BaseStyles, Button, Container, Layout, Link, Spacer, Text } from '@loomhq/lens';

import Head from 'next/head'
import { TwitterTweetEmbed } from 'react-twitter-embed';
import { useEffect } from 'react';
import { useMediaPredicate } from "react-media-hook";

export const THEME_DARK = 'theme-dark';

const Tweet = () => (
  <TwitterTweetEmbed 
    tweetId="1257014446976720896"
    options={{ theme: 'dark', height: '180px' }}/> );

export default function Home() {
  const activeTheme = useMediaPredicate('(prefers-color-scheme: dark)') && THEME_DARK;

  useEffect(() => {
    if (activeTheme === THEME_DARK) {
      document.body.classList.add(THEME_DARK);
    } else {
      document.body.classList.remove(THEME_DARK);
    }
  }, [activeTheme]);
  
  return (
    <>
      <Head>
        <title>Hg</title>
        <meta name="description" content="The personal website of Harshyt Goel." />
        <meta name="language" content="English" />
        <meta name="googlebot" content="index,follow" />
        <link rel="shortcut icon" href="/sakura.png" />
      </Head>
      <Container width="100%" height="100%" backgroundColor="background">
        <Align alignment="topCenter">
          <Container padding={20} maxWidth={100}>

              <Text htmlTag="h1" size="xxlarge">Harsh.yt</Text>
              <Spacer top="large" />
              <Text size="large"> I write about emotional growth, inspiration and creativity. Here are my <Link variant="neutral" target="_blank" href="https://www.notion.so/Harshyt-s-Working-Manual-62b0d9a324044d37bb67ebc19a7dc236">rules to life</Link>.</Text>
              
              <Spacer top="medium" />
              <Text size="large">I once started a niche but popular <Link variant="neutral" target="_blank" href="https://youtube.com/riffshop">youtube channel</Link>
              &nbsp;and currently work at <Link variant="neutral" target="_blank" href="https://loom.com/">loom.com</Link></Text>
              <Spacer top="medium" />
              <Text size="large">I'm also fairly active on <Link variant="neutral" target="_blank" href="https://twitter.com/garshythoel">Twitter@garshythoel</Link></Text>
              <Spacer top="medium" />
              <Text size="large">If you'd like to hear what i have to say, about myself, about life and about a whole lot of other things, big and small. Signup to my email list and I'll send you the first short story I ever wrote + some music I’ve been working on.</Text>

              <Spacer top="large" />
              <Button htmlTag="a" size="large" target="_blank" href="https://harsh.substack.com/welcome">Subscribe</Button>

              <Spacer top="xxlarge" />

              <Tweet />
          </Container>
        </Align>
      </Container>
      <BaseStyles />
    </>
  );      
}