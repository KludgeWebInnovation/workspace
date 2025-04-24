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

export default function HistoryLog() {
  const [logData, setLogData] = useState<{ date: string; data: EnergyData }[]>([]);

  useEffect(() => {
    const logs: { date: string; data: EnergyData }[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("log-")) {
        const data = localStorage.getItem(key);
        if (data) {
          logs.push({
            date: key.replace("log-", ""),
            data: JSON.parse(data),
          });
        }
      }
    }

    // Sort logs by date (descending)
    logs.sort((a, b) => (a.date < b.date ? 1 : -1));
    setLogData(logs);
  }, []);

  return (
    <div className="mt-8 p-4 bg-white border rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Daily History</h2>
      {logData.length === 0 && <p className="text-sm text-gray-500">No logs found yet.</p>}
      <ul className="space-y-3">
        {logData.map((entry) => (
          <li key={entry.date} className="text-sm border-b pb-2">
            <div className="font-medium">{entry.date}</div>
            <ul className="ml-4 list-disc">
              <li>
                Wake:{" "}
                {entry.data.wokeUp.done
                  ? `✅ at ${entry.data.wokeUp.time}`
                  : "❌ Not logged"}
              </li>
              <li>Gym: {entry.data.gym ? "✅" : "❌"}</li>
              <li>
                Meals:
                {entry.data.meals.breakfast.done
                  ? ` 🍳 B @ ${entry.data.meals.breakfast.time}`
                  : ""}
                {entry.data.meals.lunch ? " 🥗 L" : ""}
                {entry.data.meals.dinner ? " 🍛 D" : ""}
              </li>
              <li>Sleep rating: {entry.data.sleepRating}/10</li>
              <li>Note: {entry.data.energyNote || "—"}</li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
