import Quiz from "./quiz.model";
import Material from "../materials/material.model";
import { AIGateway } from "../ai/ai.gateway";
import { NotFoundError } from "../../shared/errors/errors";

export class QuizService {
  /**
   * Generates a quiz based on tenant isolated materials and topic
   */
  static async generateQuiz(tenantId: string, studentId: string, topic: string, accessibleGrades: number[]) {
    // 1. Fetch Context from Tenant Materials (isolated RAG)
    let contextText = "";
    try {
      const matches = await Material.find({
        tenantId,
        grade: { $in: accessibleGrades },
        $text: { $search: topic }
      }).limit(3).lean();

      if (matches.length > 0) {
        contextText = matches.map((d: any) => `[Source Material: ${d.title}]: ${d.textParsed || ""}`).join("\n\n");
      }
    } catch (err) {
      console.warn("MongoDB text index not available for Material, falling back to basic query");
      const fallback = await Material.find({
        tenantId,
        grade: { $in: accessibleGrades },
        title: { $regex: topic, $options: "i" }
      }).limit(2).lean();
      
      if (fallback.length > 0) {
        contextText = fallback.map((d: any) => `[Source Material: ${d.title}]: ${d.textParsed || ""}`).join("\n\n");
      }
    }

    // 2. Call AI Gateway for Structured Quiz (with organization config allowed checking)
    const prompt = `You are a teacher creating a quiz for a student. Topic: ${topic}
${contextText ? `Using the following class materials context:\n${contextText}\n` : ""}
Generate exactly 5 multiple choice questions.
Return ONLY valid JSON array with objects in this exact format:
[
  {
    "question": "question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "exact text of correct option"
  }
]
`;

    const systemInstruction = "You are a professional educational quiz generator. Reply with nothing but valid JSON formats.";

    const response = await AIGateway.generateCompletion(prompt, {
      tenantId,
      provider: "gemini", // Default to fast gemini-1.5-flash
      systemInstruction,
    });

    let questions;
    try {
      const cleaned = response.text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      questions = JSON.parse(cleaned);
    } catch (err) {
      // Fallback in case JSON parser fails
      questions = [
        {
          question: `Self-check question about ${topic}?`,
          options: ["Check classroom readings", "Review student guidelines", "Consult syllabus", "Ask teacher"],
          answer: "Check classroom readings"
        }
      ];
    }

    // 3. Save initial Quiz State
    const quiz = await Quiz.create({
      tenantId,
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

  /**
   * Submit quiz answers and auto-grade
   */
  static async submitQuiz(
    tenantId: string,
    quizId: string,
    studentId: string,
    answers: string[]
  ) {
    const quiz = await Quiz.findOne({ _id: quizId, studentId, tenantId });
    if (!quiz) throw new NotFoundError("Quiz not found");

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
