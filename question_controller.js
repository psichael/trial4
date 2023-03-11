import { questions } from './questions';
import { questionlists } from './questionlist';
import { isAnswered, gDPR } from './db';
import _ from 'lodash';


export async function getNextQuestion() {
 const today = new Date().toISOString().slice(0, 10);

 const questionList = questionlists.find((list) => list.dateToShow === today); 
 if (!questionList) {
   return Promise.resolve(null);
 }

 const unansweredQuestionIds = await Promise.all(
   questionList.questionIds.map(async (questionId) => {
     const isQAnswered = await isAnswered(questionId);
     return { questionId, isQAnswered };
   })
 ).then((results) =>
   results.filter(({ isQAnswered }) => !isQAnswered).map(({ questionId }) => questionId)
 );


 if (unansweredQuestionIds.length === 0 ) {
   return Promise.resolve({ questionId: 0, questionText: 'No more questions', answerType: 'text' });
 }


 const nextQuestion = questions[unansweredQuestionIds[0]];
//  await SaveAnswers(nextQuestion.questionId);
 return Promise.resolve(nextQuestion);
}