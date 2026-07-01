import Material from "../materials/material.model";
import StudyLog from "../learning/studylog.model";
import { AnalyticsService } from "../analytics/analytics.service";
import { AIGateway } from "../ai/ai.gateway";
import Subject from "../subjects/subject.model";

export class LISService {
  /**
   * Adaptive AI Chat tutoring (Learning Information System) isolated by tenant
   */
  static async askLIS(
    tenantId: string,
    studentId: string,
    question: string,
    subjectName: string,
    userGrade: number,
    accessibleGrades: number[]
  ) {
    // 1. Detect if student is weak in this topic/subject
    let isWeakTopic = false;
    try {
      isWeakTopic = await AnalyticsService.isWeakInTopic(tenantId, studentId, subjectName);
    } catch {
      // Ignore
    }

    // 2. Local isolated RAG retrieval from Tenant Materials
    let contextText = "";
    try {
      const matchingSubjects = await Subject.find({
        tenantId,
        name: { $regex: subjectName, $options: "i" }
      }).select("_id").lean();

      const subjectIds = matchingSubjects.map((s) => s._id);

      const matches = await Material.find({
        tenantId,
        grade: { $in: accessibleGrades },
        $or: [
          { subjectId: { $in: subjectIds } },
          { $text: { $search: question } }
        ]
      }).limit(3).lean();

      if (matches.length > 0) {
        contextText = matches.map((doc: any) => `[Material: ${doc.title}]: ${doc.textParsed || ""}`).join("\n\n");
      }
    } catch (err) {
      console.warn("MongoDB text index not available for Material, falling back to title match queries");
      const fallback = await Material.find({
        tenantId,
        grade: { $in: accessibleGrades },
        title: { $regex: question, $options: "i" }
      }).limit(2).lean();

      if (fallback.length > 0) {
        contextText = fallback.map((doc: any) => `[Material: ${doc.title}]: ${doc.textParsed || ""}`).join("\n\n");
      }
    }

    // 3. Build Prompt
    let prompt = `You are a helpful teacher speaking to a grade ${userGrade} student.
Use the context below to answer.
${contextText ? `Context:\n${contextText}\n` : ""}
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

    prompt += "\n\nReturn EXACTLY and ONLY valid JSON matching the schema above.";

    const systemInstruction = "You are a friendly AI tutor. Answer using strictly JSON. Do not include markdown code block characters in your final response.";

    // 5. Call AI Gateway (with tenanted credit limit checking)
    const response = await AIGateway.generateCompletion(prompt, {
      tenantId,
      provider: "gemini", // default to fast gemini-1.5-flash
      systemInstruction,
    });

    // Try parsing
    let structuredAnswer;
    try {
      const cleaned = response.text.replace(/```json/gi, "").replace(/```/g, "").trim();
      structuredAnswer = JSON.parse(cleaned);
    } catch (err) {
      console.warn("Failed to parse LIS AI JSON answer, returning raw answer inside simpleExplanation", err);
      structuredAnswer = {
        simpleExplanation: response.text,
        definition: "",
        stepByStep: [],
        realLifeExample: "",
        practicalExample: "",
        summary: "",
        miniQuiz: {
          question: `Self-check on ${subjectName}?`,
          options: ["Check syllabus", "Review readings", "Ask tutor", "All of above"],
          answer: "Review readings"
        }
      };
    }

    // 6. Track study learning log
    await StudyLog.create({
      tenantId,
      studentId,
      question,
      subject: subjectName,
      gradeAccessed: userGrade,
      answer: JSON.stringify(structuredAnswer),
    });

    return structuredAnswer;
  }
}
