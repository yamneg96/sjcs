import { AnalyticsService } from "../analytics/analytics.service";
import Material from "../materials/material.model";

export class RecommendationService {
  static async getRecommendations(
    studentId: string,
    accessibleGrades: number[]
  ) {
    // 1. Get analytics
    const analytics = await AnalyticsService.getStudentAnalytics(studentId);

    // 2. Identify weak topics
    const weakTopics = analytics.filter(
      (a) => a.status === "weak" || a.status === "critical"
    );

    const recommendations = [];

    // 3. For each weak topic, find related materials
    for (const topicData of weakTopics) {
      const materials = await Material.find({
        grade: { $in: accessibleGrades },
        $or: [
          { subject: { $regex: topicData.topic, $options: "i" } },
          { title: { $regex: topicData.topic, $options: "i" } },
        ],
      }).limit(4);

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
