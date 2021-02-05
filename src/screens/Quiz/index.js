import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Lottie } from '@crello/react-lottie';

import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import QuizLogo from '../../components/QuizLogo';
import Widget from '../../components/Widget';
import AlternativesForm from '../../components/AlternativesForm';
import GitHubCorner from '../../components/GitHubCorner';
import Button from '../../components/Button';
import BackLinkArrow from '../../components/BackLinkArrow';

import loadingAnimation from './animations/loading.json';
import correctAnimation from './animations/correct.json';
import wrongAnimation from './animations/wrong.json';

function ResultWidget({
  results,
  questions,
  handleGoBack,
}) {
  const scoreTotal = results.filter((result) => result === true).length;

  return (
    <Widget>
      <Widget.Header>
        {scoreTotal < (results.length)/3 && <h3>Parece que você não entende muito sobre esse assunto!</h3>}
        {scoreTotal >= (results.length)/3 && scoreTotal < (results.length)*(2/3) && <h3>Está indo bem! Mas ainda há o que melhorar!</h3>}
        {scoreTotal >= (results.length)*(2/3) && <h3>Parbéns! Você realmente entende do assunto!</h3>}
      </Widget.Header>

      <Widget.Content>
        <h3>Você acertou{' '}{scoreTotal}{' '}de{' '}{results.length}{' '}perguntas!</h3>
        <ul>
          {results.map((result, index) => (
            <>
              <li key={`result__${result}`}>
                {result === true ? '✔️' : '❌'}{' '}{index + 1}{': '}{`${questions[index].title}`}{' '}
                <br />
                <h3>{`${questions[index].alternatives[questions[index].answer]}`}</h3>
              </li>
              <br />
            </>
          ))}
        </ul>

        <form onSubmit={handleGoBack}>
          <Button type="submit">
            Voltar
          </Button>
        </form>
      </Widget.Content>
    </Widget>
  );
}

ResultWidget.propTypes = {
  results: PropTypes.arrayOf([]).isRequired,
  questions: PropTypes.arrayOf([]).isRequired,
  name: PropTypes.string,
  handleGoBack: PropTypes.func.isRequired,
};

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        <h3>Carregando...</h3>
      </Widget.Header>

      <Widget.Content style={{ display: 'flex', justifyContent: 'center' }}>
        <Lottie
          width="200px"
          height="200px"
          className="lottie-container basic"
          config={{ animationData: loadingAnimation, loop: true, autoplay: true }}
        />
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  addResult,
}) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined);
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>{`Pergunta ${questionIndex + 1} de ${totalQuestions}`}</h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />

      <Widget.Content>
        <h2>
          {question.title}
        </h2>

        <p>
          {question.description}
        </p>

        <AlternativesForm
          onSubmit={(e) => {
            e.preventDefault();

            setIsQuestionSubmitted(true);
            setTimeout(() => {
              addResult(isCorrect);
              onSubmit();
              setIsQuestionSubmitted(false);
              setSelectedAlternative(undefined);
            }, 2.5 * 1000);
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const selectedAlternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmitted && selectedAlternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  checked={false}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          <Button type="submit" disabled={!hasAlternativeSelected}>
              Confirmar
          </Button>
          {isQuestionSubmitted && isCorrect && <div><Lottie 
          width="100px"
          height="100px"
          className="lottie-container basic teste"
          config={{ animationData: correctAnimation, loop: false, autoplay: true }}
          /></div>}
          {isQuestionSubmitted && !isCorrect && <div><Lottie
          width="100px"
          height="100px"
          className="lottie-container basic teste"
          config={{ animationData: wrongAnimation, loop: false, autoplay: true }}
          /></div>}
        </AlternativesForm>

      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

export default function QuizPage({ externalQuestions, externalBg, dbExterno }) {
  const [screenState, setScreenState] = useState(screenStates.LOADING);
  const [results, setResults] = useState([]);
  const totalQuestions = externalQuestions.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionIndex = currentQuestion;
  const question = externalQuestions[currentQuestion];
  const { questions } = dbExterno;
  const bg = externalBg;

  const router = useRouter();

  function addResult(result) {
    setResults([
      ...results,
      result,
    ]);
  }

  useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 4 * 1000);
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(questionIndex + 1);
    } else {
      setScreenState(screenStates.LOADING);
      setTimeout(() => {
        setScreenState(screenStates.RESULT);
      }, 4 * 1000);
    }
  }

  function handleGoBack(e) {
    e.preventDefault();
    router.push('/');
  }

  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo />

        {screenState === screenStates.QUIZ && (
          <>
            <QuestionWidget
              question={question}
              questionIndex={questionIndex}
              totalQuestions={totalQuestions}
              onSubmit={handleSubmitQuiz}
              addResult={addResult}
            />
          </>
        )}

        {screenState === screenStates.LOADING && (
          <LoadingWidget/>
        )}

        {screenState === screenStates.RESULT && (
          <>
            <ResultWidget
              results={results}
              questions={questions}
              handleGoBack={handleGoBack}
            />
          </>
        )}

      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/muriloguerreiro" />
    </QuizBackground>
  );
}