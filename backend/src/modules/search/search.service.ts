import Subject from "../subjects/subject.model";
import Material from "../materials/material.model";
import Quiz from "../quiz/quiz.model";

export class SearchService {
  /**
   * Performs cross-module text queries isolated within a tenant workspace.
   */
  static async searchAll(tenantId: string, query: string, grades: number[]) {
    const rx = { $regex: query, $options: "i" };

    const [subjects, materials, quizzes] = await Promise.all([
      // 1. Search tenant subjects
      Subject.find({
        tenantId,
        $or: [{ name: rx }, { code: rx }]
      }).limit(5).lean(),

      // 2. Search tenant materials matching grades
      Material.find({
        tenantId,
        grade: { $in: grades },
        $or: [{ title: rx }, { textParsed: rx }]
      }).limit(10).populate("subjectId", "name").lean(),

      // 3. Search quizzes
      Quiz.find({
        tenantId,
        topic: rx
      }).limit(5).select("topic total score createdAt").lean()
    ]);

    return {
      subjects,
      materials,
      quizzes
    };
  }
}
