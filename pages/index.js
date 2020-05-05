import { Align, BaseStyles, Button, Container, Layout, Link, Spacer, Text } from '@loomhq/lens';
import { THEME_DARK, useTheme } from './hooks';

import Head from 'next/head'
import { TwitterTweetEmbed } from 'react-twitter-embed';
import { useEffect } from 'react';

const Tweet = () => (
  <TwitterTweetEmbed 
    tweetId="1257014446976720896"
    options={{ theme: 'dark', height: '180px' }}/> );

export default function Home() {
  const activeTheme = useTheme();

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
      </Head>
      <Container width="100%" height="100%" backgroundColor="background">
        <Align alignment="topCenter">
          <Container padding={20} maxWidth={100}>

              <Text htmlTag="h1" size="xxlarge">Harsh.yt</Text>
              <Spacer top="large" />
              <Text size="large"> I write about emotional growth, inspiration and creativity.</Text>

              <Spacer top="medium" />
              <Text size="large">I once started a niche but popular <Link variant="neutral" href="https://youtube.com/riffshop">youtube channel</Link>
              &nbsp;and currently work at <Link variant="neutral">loom.com</Link></Text>
              <Spacer top="medium" />
              <Text size="large">I'm also fairly active on <Link variant="neutral" href="https://twitter.com/garshythoel">Twitter @garshythoel</Link></Text>
              <Spacer top="medium" />
              <Text size="large">If you'd like to hear what i have to say, about myself, about life and about a whole lot of other things, big and small. Signup to my email list and I'll send you the first short story I ever wrote + some music I’ve been working on.</Text>

              <Spacer top="large" />
              <Button htmlTag="a" size="large" href="https://harsh.substack.com/welcome">Subscribe</Button>
              <Spacer top="large" />

              <Spacer top="medium" />
              <Tweet />
          </Container>
        </Align>
      </Container>
      <BaseStyles />
    </>
  );      
}