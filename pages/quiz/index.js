/* eslint-disable react/prop-types */
import React from 'react';
import { ThemeProvider } from 'styled-components';
import QuizPage from '../../src/screens/Quiz';
import db from '../../db.json';

export default function QuizDaGaleraPage() {
  return (
    <ThemeProvider theme={db.theme}>
      <QuizPage
        externalQuestions={db.questions}
        externalBg={db.bg}
        dbExterno={db}
      />
    </ThemeProvider>
  );
}