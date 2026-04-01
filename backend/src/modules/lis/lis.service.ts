import { RAGService } from "../rag/rag.service";
import StudyLog from "../learning/studylog.model";
import { AnalyticsService } from "../analytics/analytics.service";

export class LISService {
  static async askLIS(
    studentId: string,
    question: string,
    subject: string,
    userGrade: number,
    accessibleGrades: number[]
  ) {
    // 1. Detect if student is weak in this topic
    let isWeakTopic = false;
    try {
      isWeakTopic = await AnalyticsService.isWeakInTopic(studentId, subject);
    } catch {
      // Ignore
    }

    // 2. Call RAG service for context
    const contextDocs = await RAGService.findRelevantContext(
      question,
      accessibleGrades,
      subject
    );
    const contextText = contextDocs.map((doc: any) => doc.content).join("\n\n");

    // 3. Build Prompt
    let prompt = `You are a helpful teacher speaking to a grade ${userGrade} student.
Use the context below to answer.
Context: ${contextText}

Question: ${question}

Provide your response in JSON format with exactly these keys:
{
  "simpleExplanation": "...",
  "definition": "...",
  "stepByStep": ["...", "..."],
  "realLifeExample": "...",
  "practicalExample": "...",
  "summary": "...",
  "miniQuiz": {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "answer": "correct option"
  }
}`;

    // 4. Adaptive AI Injection
    if (isWeakTopic) {
      prompt +=
        "\n\nIMPORTANT: The student is weak in this topic. Explain more clearly with more examples and simple analogies.";
    }

    prompt += "\n\nReturn EXACTLY and ONLY valid JSON. No markdown blocks like ```json.";

    // Call AI
    const rawAnswer = await RAGService.generateAnswer(prompt);

    // Try parsing
    let structuredAnswer;
    try {
      const cleaned = rawAnswer.replace(/```json/gi, "").replace(/```/g, "").trim();
      structuredAnswer = JSON.parse(cleaned);
    } catch (err) {
      console.warn("Failed to parse AI JSON, returning raw string", err);
      structuredAnswer = {
        simpleExplanation: rawAnswer,
        definition: "",
        stepByStep: [],
        realLifeExample: "",
        practicalExample: "",
        summary: "",
      };
    }

    // 5. Track study learning
    await StudyLog.create({
      studentId,
      question,
      subject,
      gradeAccessed: userGrade,
      answer: JSON.stringify(structuredAnswer),
    });

    return structuredAnswer;
  }
}
