import { Align, BaseStyles, Button, Container, Spacer, Text } from '@loomhq/lens';

import Head from 'next/head'
import { useEffect } from 'react';

export default function Home() {
  // useEffect(() => {
  //   document.body.classList.add("theme-dark");
  // }, [])
  
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
          <Container maxWidth={100} width="80%" padding={10}>
            <Text htmlTag="h1" size="xxlarge">harsh.yt</Text>
            <Spacer top="large" />
            <Text></Text>
            <Text></Text>
            {/* <iframe src="https://harsh.substack.com/embed" width="480" height="120" style={{background:'inherit'}} frameborder="0" scrolling="no"></iframe> */}
          </Container>
        </Align>
      </Container>
      <BaseStyles />
    </>
  );      
}
