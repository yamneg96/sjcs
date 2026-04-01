import Quiz from "../quiz/quiz.model";

export class AnalyticsService {
  static async getStudentAnalytics(studentId: string) {
    const quizzes = await Quiz.find({ studentId });

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

  static async isWeakInTopic(studentId: string, topic: string): Promise<boolean> {
    const analytics = await this.getStudentAnalytics(studentId);
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
