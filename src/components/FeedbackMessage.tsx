import { useEffect, useState } from "react";

type Timestamped = {
  done: boolean;
  time: string | null;
};

type EnergyData = {
  wokeUp: Timestamped;
  gym: boolean;
  meals: {
    breakfast: Timestamped;
    lunch: boolean;
    dinner: boolean;
  };
  sleepRating: number;
  energyNote: string;
};

const getTodayKey = () => {
  const today = new Date().toISOString().split("T")[0];
  return `log-${today}`;
};

export default function FeedbackMessage() {
  const [feedback, setFeedback] = useState<string[]>([]);

  useEffect(() => {
    const key = getTodayKey();
    const raw = localStorage.getItem(key);
    if (!raw) return;

    const data: EnergyData = JSON.parse(raw);
    const messages: string[] = [];

    // Example feedback rules
    if (!data.gym) messages.push("You didn’t log gym today—maybe a walk after work?");
    if (!data.meals.lunch) messages.push("Skipped lunch? Try to refuel around midday.");
    if (data.sleepRating < 5) messages.push("Low sleep rating—consider winding down earlier tonight.");

    if (messages.length === 0) {
      messages.push("You're doing great today! Keep it up 🙌");
    }

    setFeedback(messages);
  }, []);

  return (
    <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow-sm">
      <h3 className="font-semibold text-yellow-800 mb-2">Today's Suggestions</h3>
      <ul className="list-disc list-inside text-sm text-yellow-900 space-y-1">
        {feedback.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
