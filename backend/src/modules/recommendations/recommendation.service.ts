import { AnalyticsService } from "../analytics/analytics.service";
import Material from "../materials/material.model";
import Subject from "../subjects/subject.model";

export class RecommendationService {
  /**
   * Generates localized material recommendations for subjects where the student shows a weak/critical history.
   */
  static async getRecommendations(
    tenantId: string,
    studentId: string,
    accessibleGrades: number[]
  ) {
    // 1. Get student analytics
    const analytics = await AnalyticsService.getStudentAnalytics(tenantId, studentId);

    // 2. Identify weak/critical topics
    const weakTopics = analytics.filter(
      (a) => a.status === "weak" || a.status === "critical"
    );

    const recommendations = [];

    // 3. Find related subjects and materials within the tenant scope
    for (const topicData of weakTopics) {
      // Find subjects matching the topic text
      const matchingSubjects = await Subject.find({
        tenantId,
        name: { $regex: topicData.topic, $options: "i" }
      }).select("_id").lean();
      
      const subjectIds = matchingSubjects.map((s) => s._id);

      const materials = await Material.find({
        tenantId,
        grade: { $in: accessibleGrades },
        $or: [
          { subjectId: { $in: subjectIds } },
          { title: { $regex: topicData.topic, $options: "i" } }
        ],
      }).limit(4).populate("subjectId", "name").lean();

      let suggestion = `Review materials for ${topicData.topic} to improve your score.`;
      if (topicData.status === "critical") {
        suggestion = `CRITICAL: Your score in ${topicData.topic} is very low. Please review these foundational materials before moving forward.`;
      }

      recommendations.push({
        topic: topicData.topic,
        level: topicData.status,
        suggestion,
        materials,
      });
    }

    return recommendations;
  }
}
