import Quiz from "./quiz.model";
import { RAGService } from "../rag/rag.service";

export class QuizService {
  static async generateQuiz(studentId: string, topic: string, accessibleGrades: number[]) {
    // 1. Fetch Context from RAG
    const docs = await RAGService.findRelevantContext(
      "Generate a quiz about " + topic,
      accessibleGrades,
      topic,
      10
    );
    const contextText = docs.map((d: any) => d.content).join("\n\n");

    // 2. Call AI Provider for Structured Quiz
    const prompt = `You are a teacher creating a quiz for a student. Topic: ${topic}
Context: ${contextText}

Generate exactly 5 multiple choice questions.
Return ONLY valid JSON in this format:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "answer": "exact text of correct option"
  }
]
`;

    const rawResponse = await RAGService.generateAnswer(prompt);
    let questions;
    try {
      const cleaned = rawResponse
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      questions = JSON.parse(cleaned);
    } catch (err) {
      throw new Error("AI failed to generate a strictly formatted JSON quiz");
    }

    // 3. Save initial Quiz State
    const quiz = await Quiz.create({
      studentId,
      topic,
      questions,
      score: 0,
      total: questions.length,
    });

    // Return the quiz but omit the answers so the client can't cheat easily
    const clientQuiz = {
      _id: quiz._id,
      topic: quiz.topic,
      total: quiz.total,
      questions: (quiz.questions as any[]).map((q) => ({
        _id: q._id,
        question: q.question,
        options: q.options,
      })),
    };

    return clientQuiz;
  }

  static async submitQuiz(
    quizId: string,
    studentId: string,
    answers: string[]
  ) {
    const quiz = await Quiz.findOne({ _id: quizId, studentId });
    if (!quiz) throw new Error("Quiz not found");

    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      q.userAnswer = answers[index];
      if (q.userAnswer === q.answer) {
        correctCount += 1;
      }
    });

    // Percent score
    quiz.score = Math.round((correctCount / quiz.total) * 100);

    await quiz.save();
    return quiz;
  }
}
