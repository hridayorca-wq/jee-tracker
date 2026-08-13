// JEE Main marking scheme (per subject):
//   Section A - MCQ (20 questions):        +4 correct, -1 wrong, 0 unattempted
//   Section B - Numerical (5 questions):    +4 correct,  0 wrong, 0 unattempted
// Max possible score per subject = 20*4 + 5*4 = 100

export const MCQ_TOTAL = 20;
export const NUM_TOTAL = 5;
export const MAX_SUBJECT_SCORE = MCQ_TOTAL * 4 + NUM_TOTAL * 4; // 100

export function calculateScore({ mcqCorrect, mcqWrong, numCorrect, numWrong }) {
  const mcqScore = mcqCorrect * 4 - mcqWrong * 1;
  const numScore = numCorrect * 4;
  return mcqScore + numScore;
}

export function unattempted({ mcqCorrect, mcqWrong, numCorrect, numWrong }) {
  return {
    mcqUnattempted: Math.max(MCQ_TOTAL - mcqCorrect - mcqWrong, 0),
    numUnattempted: Math.max(NUM_TOTAL - numCorrect - numWrong, 0),
  };
}
