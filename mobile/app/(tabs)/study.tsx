import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator, TextInput } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useStartStudySession, useEndStudySession } from "@/hooks/use-records";
import { AIEngine } from "@/modules/ai/engine/ai.engine";
import { AIRoute } from "@/modules/ai/types";
import { BrainIcon, SendIcon, PlayIcon, SquareIcon, SmartphoneIcon, CloudIcon } from "lucide-react-native";

interface TutorMessage {
  role: "user" | "ai";
  text: string;
  /** Transparency panel (§45): where the answer came from. */
  route?: AIRoute;
}

export default function StudyTutorScreen() {
  const [subject, setSubject] = useState("Theology");
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<TutorMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const startSessionMutation = useStartStudySession();
  const endSessionMutation = useEndStudySession();

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const handleStartSession = () => {
    startSessionMutation.mutate(
      subject,
      {
        onSuccess: (res) => {
          if (res.success && res.data) {
            setSessionId(res.data.sessionId);
            setSecondsElapsed(0);
            setIsSessionActive(true);
            setConversation([
              {
                role: "ai",
                text: `Welcome to your ${subject} study session! I am L.I.S., your Socratic AI Tutor. Ask me any question to begin.`,
              },
            ]);
          }
        },
      }
    );
  };

  const handleEndSession = () => {
    if (!sessionId) return;
    endSessionMutation.mutate(
      { sessionId, duration: secondsElapsed },
      {
        onSuccess: () => {
          setIsSessionActive(false);
          setSessionId(null);
          setConversation((prev) => [
            ...prev,
            {
              role: "ai",
              text: `Study session ended. Great job studying for ${formatTime(secondsElapsed)}! Your progress is recorded in your profile logs.`,
            },
          ]);
        },
      }
    );
  };

  const handleAsk = async () => {
    if (!question.trim() || isThinking) return;
    const userMsg = question.trim();
    setQuestion("");
    setConversation((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsThinking(true);

    try {
      // The AI Engine is the single entry point: it attaches educational
      // context and routes local (on-device) / cloud / fallback per request.
      const result = await AIEngine.complete(userMsg, { eduContext: { subject } });
      setConversation((prev) => [
        ...prev,
        { role: "ai", text: result.text, route: result.route },
      ]);
    } catch (err: any) {
      setConversation((prev) => [
        ...prev,
        { role: "ai", text: `Error: ${err.message || "Failed to generate AI tutor response."}` },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const formatTime = (secs: number) => {
    const mm = Math.floor(secs / 60).toString().padStart(2, "0");
    const ss = (secs % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <View style={styles.container}>
      {/* Top Session Controller */}
      <View className="p-4 bg-card border-b border-border/40">
        {!isSessionActive ? (
          <View className="gap-3">
            <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Study Subject
            </Text>
            <View className="flex-row gap-2">
              {["Theology", "Mathematics", "Science", "History"].map((subj) => (
                <Button
                  key={subj}
                  variant={subject === subj ? "default" : "outline"}
                  onPress={() => setSubject(subj)}
                  className="flex-1 py-2 h-10 rounded-xl px-0"
                >
                  <Text className="text-xs font-semibold">{subj}</Text>
                </Button>
              ))}
            </View>
            <Button
              className="h-12 bg-primary rounded-xl flex-row items-center justify-center gap-2"
              onPress={handleStartSession}
              disabled={startSessionMutation.isPending}
            >
              {startSessionMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <PlayIcon size={16} color="#fff" />
                  <Text className="text-primary-foreground font-semibold text-sm">
                    Start {subject} Study Session
                  </Text>
                </>
              )}
            </Button>
          </View>
        ) : (
          <View className="flex-row justify-between items-center bg-secondary/20 p-3 rounded-2xl">
            <View>
              <Text className="text-xs text-muted-foreground uppercase font-bold">
                Active Session ({subject})
              </Text>
              <Text className="text-lg font-bold font-mono text-foreground">
                {formatTime(secondsElapsed)}
              </Text>
            </View>
            <Button
              variant="destructive"
              className="h-10 rounded-xl flex-row items-center gap-1.5 px-3"
              onPress={handleEndSession}
              disabled={endSessionMutation.isPending}
            >
              {endSessionMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <SquareIcon size={14} color="#fff" />
                  <Text className="text-white text-xs font-semibold">Stop Session</Text>
                </>
              )}
            </Button>
          </View>
        )}
      </View>

      {/* Main Conversation Stream */}
      {isSessionActive || conversation.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollArea}>
          {conversation.map((msg, i) => (
            <View
              key={i}
              className={`max-w-[85%] p-4 rounded-2xl mb-3 ${
                msg.role === "user"
                  ? "bg-primary self-end rounded-tr-none"
                  : "bg-secondary/40 self-start rounded-tl-none"
              }`}
            >
              <Text
                className={`text-sm ${
                  msg.role === "user" ? "text-primary-foreground" : "text-foreground"
                }`}
              >
                {msg.text}
              </Text>
              {msg.role === "ai" && msg.route && msg.route !== "fallback" && (
                <View className="flex-row items-center gap-1 mt-2">
                  {msg.route === "local" ? (
                    <SmartphoneIcon size={11} className="text-muted-foreground" />
                  ) : (
                    <CloudIcon size={11} className="text-muted-foreground" />
                  )}
                  <Text className="text-[10px] text-muted-foreground">
                    {msg.route === "local" ? "Answered on-device" : "Answered via cloud"}
                  </Text>
                </View>
              )}
            </View>
          ))}
          {isThinking && (
            <View className="bg-secondary/40 max-w-[85%] self-start p-4 rounded-2xl rounded-tl-none mb-3 flex-row items-center gap-2">
              <ActivityIndicator size="small" className="text-primary" />
              <Text className="text-xs text-muted-foreground italic">LIS tutor is thinking...</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center p-6">
          <BrainIcon size={64} className="text-muted-foreground/60 mb-2" />
          <Text className="text-center text-sm text-muted-foreground">
            Socratic learning session is inactive. Click &ldquo;Start Session&rdquo; above to interact with your AI tutor.
          </Text>
        </View>
      )}

      {/* Bottom Input Area */}
      {isSessionActive && (
        <View className="p-3 border-t border-border/40 bg-card flex-row gap-2 items-center">
          <TextInput
            placeholder="Type your study question..."
            value={question}
            onChangeText={setQuestion}
            style={styles.chatInput}
            onSubmitEditing={handleAsk}
            placeholderTextColor="#888"
          />
          <Button
            size="icon"
            className="rounded-xl h-11 w-11 bg-primary items-center justify-center"
            onPress={handleAsk}
            disabled={isThinking || !question.trim()}
          >
            <SendIcon size={16} color="#fff" />
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollArea: {
    padding: 16,
    flexGrow: 1,
  },
  chatInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#000",
    backgroundColor: "rgba(0,0,0,0.02)",
  },
});


