import Quiz from "../quiz/quiz.model";

export class AnalyticsService {
  /**
   * Aggregates student quiz historical data within a tenant boundary.
   */
  static async getStudentAnalytics(tenantId: string, studentId: string) {
    const quizzes = await Quiz.find({ tenantId, studentId });

    const topicStats: Record<string, { totalScore: number; count: number }> = {};

    quizzes.forEach((q) => {
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { totalScore: 0, count: 0 };
      }
      topicStats[q.topic].totalScore += q.score;
      topicStats[q.topic].count += 1;
    });

    const analytics = Object.keys(topicStats).map((topic) => {
      const avgScore = topicStats[topic].totalScore / topicStats[topic].count;
      let status = "strong";

      if (avgScore < 50) status = "critical";
      else if (avgScore < 70) status = "weak";
      else if (avgScore < 85) status = "average";

      return {
        topic,
        averageScore: Math.round(avgScore),
        quizzesTaken: topicStats[topic].count,
        status,
      };
    });

    return analytics;
  }

  /**
   * Determines if a student has performed poorly in a specific topic.
   */
  static async isWeakInTopic(tenantId: string, studentId: string, topic: string): Promise<boolean> {
    const analytics = await this.getStudentAnalytics(tenantId, studentId);
    const topicData = analytics.find(
      (a) => a.topic.toLowerCase() === topic.toLowerCase()
    );

    // Consider weak if status is critical or weak
    if (
      topicData &&
      (topicData.status === "weak" || topicData.status === "critical")
    ) {
      return true;
    }

    return false;
  }
}
