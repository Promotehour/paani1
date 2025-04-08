import React, { useState } from "react";

const questions = [
  "Where are you located?",
  "What are your interests or things you're good at?",
  "How much do you want to earn per day?",
  "What's your starting budget for the business?",
  "What’s your education level or skills you're confident in?"
];

export default function PaaniChat() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState("");
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!input) return;
    const updatedAnswers = [...answers, input];
    setAnswers(updatedAnswers);
    setInput("");

    if (step === questions.length - 1) {
      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: updatedAnswers }),
      });
      const data = await response.json();
      setIdea(data.idea);
      setLoading(false);
    } else {
      setStep(step + 1);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers([]);
    setInput("");
    setIdea(null);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      {!idea ? (
        <div>
          <h2>{questions[step]}</h2>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNext()}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
          <button onClick={handleNext} disabled={loading}>
            {loading ? "Thinking..." : step === questions.length - 1 ? "Get Idea 💡" : "Next"}
          </button>
        </div>
      ) : (
        <div>
          <h2>💡 Your Business Idea</h2>
          <textarea readOnly rows="10" value={idea} style={{ width: "100%" }} />
          <div style={{ marginTop: "1rem" }}>
            <button onClick={handleRestart}>Start Over</button>
            <button onClick={() => navigator.clipboard.writeText(idea)} style={{ marginLeft: "1rem" }}>
              Copy Idea
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
