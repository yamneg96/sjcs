import React, { useState } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useGenerateQuiz, useSubmitQuiz } from "@/hooks/use-exams";
import { AwardIcon, SparklesIcon, CheckCircleIcon, XCircleIcon, HelpCircleIcon } from "lucide-react-native";

export default function ExamsScreen() {
  const [topic, setTopic] = useState("");
  const [quizState, setQuizState] = useState<any>(null); // Current generated quiz
  const [answers, setAnswers] = useState<string[]>([]); // Selected answers by question index
  const [quizResult, setQuizResult] = useState<any>(null); // Graded quiz results
  const [errorMsg, setErrorMsg] = useState("");

  const generateMutation = useGenerateQuiz();
  const submitMutation = useSubmitQuiz();

  const handleGenerate = (selectedTopic: string) => {
    const actTopic = selectedTopic || topic;
    if (!actTopic.trim()) {
      setErrorMsg("Please select or enter a topic.");
      return;
    }
    setErrorMsg("");
    setQuizResult(null);

    generateMutation.mutate(actTopic.trim(), {
      onSuccess: (res) => {
        if (res.success && res.data) {
          setQuizState(res.data);
          setAnswers(new Array(res.data.questions.length).fill(""));
        } else {
          setErrorMsg("Could not generate quiz.");
        }
      },
      onError: (err: any) => {
        setErrorMsg(err.message || "Failed to generate quiz. Try again.");
      },
    });
  };

  const handleAnswerSelect = (questionIndex: number, option: string) => {
    const nextAnswers = [...answers];
    nextAnswers[questionIndex] = option;
    setAnswers(nextAnswers);
  };

  const handleSubmitQuiz = () => {
    if (answers.some((ans) => !ans)) {
      setErrorMsg("Please answer all questions before submitting.");
      return;
    }
    setErrorMsg("");

    submitMutation.mutate(
      {
        quizId: quizState._id,
        answers,
      },
      {
        onSuccess: (res) => {
          if (res.success && res.data) {
            setQuizResult(res.data);
            setQuizState(null);
          }
        },
        onError: (err: any) => {
          setErrorMsg(err.message || "Failed to submit answers.");
        },
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 1. Topic entry / Generator Mode */}
      {!quizState && !quizResult && (
        <View className="w-full gap-4">
          <View className="bg-primary/5 border border-primary/10 p-5 rounded-3xl items-center mb-2">
            <AwardIcon size={48} className="text-primary mb-2" />
            <Text className="text-lg font-bold text-foreground text-center font-headline">
              Generate Socratic Mock Exam
            </Text>
            <Text className="text-xs text-muted-foreground text-center mt-1">
              Test your knowledge dynamically based on standard grade criteria
            </Text>
          </View>

          {errorMsg ? (
            <Text className="text-destructive text-xs font-semibold text-center">{errorMsg}</Text>
          ) : null}

          <View className="gap-2">
            <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
              Select Preset Topic
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {["Theology", "Algebra Basics", "Genetics & Cells", "Classical History"].map((preset) => (
                <TouchableOpacity
                  key={preset}
                  onPress={() => handleGenerate(preset)}
                  className="bg-card border border-border/40 px-3 py-2.5 rounded-xl"
                  disabled={generateMutation.isPending}
                >
                  <Text className="text-xs font-semibold text-foreground">
                    {preset}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button
            className="h-12 bg-primary rounded-xl flex-row items-center justify-center gap-2 mt-4"
            onPress={() => handleGenerate(topic)}
            disabled={generateMutation.isPending}
          >
            {generateMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <SparklesIcon size={16} color="#fff" />
                <Text className="text-primary-foreground font-semibold text-sm">
                  Generate Custom Topic Exam
                </Text>
              </>
            )}
          </Button>
        </View>
      )}

      {/* 2. Active Quiz taking Form */}
      {quizState && !quizResult && (
        <View className="w-full gap-5">
          <View className="bg-secondary/20 p-4 rounded-2xl flex-row justify-between items-center">
            <View>
              <Text className="text-xs text-muted-foreground uppercase font-bold">Mock Exam</Text>
              <Text className="text-sm font-bold text-foreground">{quizState.topic}</Text>
            </View>
            <Text className="text-xs font-mono text-muted-foreground bg-card px-2.5 py-1 rounded-full border border-border/40">
              {quizState.questions.length} Questions
            </Text>
          </View>

          {errorMsg ? (
            <Text className="text-destructive text-xs font-semibold text-center">{errorMsg}</Text>
          ) : null}

          {quizState.questions.map((q: any, qIdx: number) => (
            <View key={qIdx} className="bg-card border border-border/40 p-5 rounded-2xl shadow-sm gap-3">
              <View className="flex-row gap-2">
                <Text className="text-xs font-bold text-primary font-mono">{qIdx + 1}.</Text>
                <Text className="text-xs font-bold text-foreground flex-1 flex-wrap">{q.question}</Text>
              </View>
              <View className="gap-2">
                {q.options.map((option: string) => {
                  const isSelected = answers[qIdx] === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => handleAnswerSelect(qIdx, option)}
                      className={`p-3 rounded-xl border flex-row items-center justify-between ${
                        isSelected
                          ? "bg-primary/5 border-primary"
                          : "bg-secondary/10 border-border/40"
                      }`}
                    >
                      <Text className={`text-xs ${isSelected ? "text-primary font-semibold" : "text-foreground"}`}>
                        {option}
                      </Text>
                      {isSelected && <View className="h-4 w-4 bg-primary rounded-full" />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          <Button
            className="h-12 bg-primary rounded-xl flex-row items-center justify-center mt-3"
            onPress={handleSubmitQuiz}
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-primary-foreground font-semibold text-sm uppercase tracking-wide">
                Submit & Score Exam
              </Text>
            )}
          </Button>
        </View>
      )}

      {/* 3. Post-Submit Results View */}
      {quizResult && (
        <View className="w-full gap-5">
          <View className="bg-card border border-border/40 p-6 rounded-3xl items-center shadow-lg gap-3">
            <AwardIcon size={64} className="text-secondary" />
            <Text className="text-2xl font-black text-foreground">
              Grade: {quizResult.score} / {quizResult.total}
            </Text>
            <Text className="text-xs text-muted-foreground text-center">
              Quiz score graded successfully. Review your correct response logs below.
            </Text>
            <Button
              variant="outline"
              className="rounded-xl mt-2 h-10 border-border/60"
              onPress={() => setQuizResult(null)}
            >
              <Text className="text-xs font-semibold text-primary">Generate New Exam</Text>
            </Button>
          </View>

          <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 mt-2">
            Detailed Review
          </Text>

          {quizResult.questions?.map((q: any, i: number) => {
            const isCorrect = q.userAnswer === q.answer;
            return (
              <View key={i} className="bg-card border border-border/40 p-4 rounded-2xl gap-2 shadow-sm">
                <View className="flex-row items-start justify-between">
                  <Text className="text-xs font-bold text-foreground flex-1 flex-wrap">
                    Q{i + 1}: {q.question}
                  </Text>
                  {isCorrect ? (
                    <CheckCircleIcon size={16} color="#10b981" />
                  ) : (
                    <XCircleIcon size={16} color="#ef4444" />
                  )}
                </View>
                <View className="bg-secondary/10 p-2.5 rounded-xl mt-1 gap-1">
                  <Text className="text-[10px] text-muted-foreground">
                    Your response: <Text className={`text-[10px] font-semibold ${isCorrect ? "text-green-600" : "text-red-500"}`}>{q.userAnswer}</Text>
                  </Text>
                  {!isCorrect && (
                    <Text className="text-[10px] text-muted-foreground">
                      Correct Answer: <Text className="text-[10px] font-semibold text-green-600">{q.answer}</Text>
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "transparent",
  },
});


