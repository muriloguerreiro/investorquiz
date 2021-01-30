import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import QuizContainer from '../src/components/QuizContainer';

export default function Home() {
  const router = useRouter();
  const [name, setName] = React.useState('');

  return (
    <QuizBackground backgroundImage={db.bg}>
      <Head>
        <title>{db.title}</title>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://investorquiz.muriloguerreiro.vercel.app/" />
        <meta property="og:title" content="Investor Quiz" />
        <meta property="og:description" content="Test your knowledge and find out if you are a good investor!" />
        <meta property="og:image" content="https://cdn.pixabay.com/photo/2017/09/07/08/54/money-2724241_1280.jpg" />
      </Head>
      <QuizContainer>
        <QuizLogo />
        <Widget>
          <Widget.Header>
            <h1>{db.title}</h1>
          </Widget.Header>
          <Widget.Content>
            <p>{db.description}</p>
            <form onSubmit={function (infosDoEvento) {
              infosDoEvento.preventDefault();
              router.push(`/quiz?name=${name}`);
            }}
            >
              <Input
                name="userName"
                onChange={(infosDoEvento) => setName(infosDoEvento.target.value)}
                placeholder="Enter your name..."
                value={name}
              />
              <Button type="submit" disabled={name.length === 0}>
                {`Play as ${name}`}
              </Button>
            </form>
          </Widget.Content>
        </Widget>

        <Widget>
          <Widget.Content>
            <h1>People`&apos;`s Quizzes</h1>

            <p>Soon...</p>
          </Widget.Content>
        </Widget>
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/muriloguerreiro" />
    </QuizBackground>
  );
}