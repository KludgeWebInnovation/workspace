import { useState, useEffect } from "react";

// Type for daily energy tracking
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

const defaultData: EnergyData = {
  wokeUp: { done: false, time: null },
  gym: false,
  meals: {
    breakfast: { done: false, time: null },
    lunch: false,
    dinner: false,
  },
  sleepRating: 5,
  energyNote: "",
};

export default function EnergyLog() {
  const logKey = getTodayKey();
  const storedData = localStorage.getItem(logKey);
  const initialData: EnergyData = storedData ? JSON.parse(storedData) : defaultData;

  const [energyData, setEnergyData] = useState<EnergyData>(initialData);

  useEffect(() => {
    localStorage.setItem(logKey, JSON.stringify(energyData));
  }, [energyData, logKey]);

  const logTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleTimestamped = (key: "wokeUp" | "breakfast") => {
    if (key === "wokeUp") {
      setEnergyData((prev) => ({
        ...prev,
        wokeUp: {
          done: !prev.wokeUp.done,
          time: !prev.wokeUp.done ? logTime() : null,
        },
      }));
    } else if (key === "breakfast") {
      setEnergyData((prev) => ({
        ...prev,
        meals: {
          ...prev.meals,
          breakfast: {
            done: !prev.meals.breakfast.done,
            time: !prev.meals.breakfast.done ? logTime() : null,
          },
        },
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Wake Up Toggle */}
        <div>
          <button
            onClick={() => toggleTimestamped("wokeUp")}
            className={`px-4 py-2 rounded ${
              energyData.wokeUp.done ? "bg-green-200" : "bg-gray-200"
            }`}
          >
            {energyData.wokeUp.done ? "✅ Woke up at " + energyData.wokeUp.time : "☐ Wake Up"}
          </button>
        </div>

        {/* Gym remains basic */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={energyData.gym}
              onChange={() => setEnergyData({ ...energyData, gym: !energyData.gym })}
            />
            <span className="ml-2">Went to Gym</span>
          </label>
        </div>

        {/* Breakfast Toggle */}
        <div className="ml-4">
          <button
            onClick={() => toggleTimestamped("breakfast")}
            className={`px-4 py-2 rounded ${
              energyData.meals.breakfast.done ? "bg-green-200" : "bg-gray-200"
            }`}
          >
            {energyData.meals.breakfast.done
              ? "✅ Breakfast at " + energyData.meals.breakfast.time
              : "☐ Breakfast"}
          </button>
        </div>

        {/* The rest */}
        <div className="ml-4">
          <label>
            <input
              type="checkbox"
              checked={energyData.meals.lunch}
              onChange={() =>
                setEnergyData({
                  ...energyData,
                  meals: { ...energyData.meals, lunch: !energyData.meals.lunch },
                })
              }
            />
            <span className="ml-2">Lunch</span>
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={energyData.meals.dinner}
              onChange={() =>
                setEnergyData({
                  ...energyData,
                  meals: { ...energyData.meals, dinner: !energyData.meals.dinner },
                })
              }
            />
            <span className="ml-2">Dinner</span>
          </label>
        </div>

        <div>
          <label>
            Sleep Rating (1–10):&nbsp;
            <input
              type="number"
              min="1"
              max="10"
              value={energyData.sleepRating}
              onChange={(e) =>
                setEnergyData({ ...energyData, sleepRating: Number(e.target.value) })
              }
              className="w-16 p-1 border rounded"
            />
          </label>
        </div>

        <div>
          <label>
            Energy Note:
            <textarea
              value={energyData.energyNote}
              onChange={(e) =>
                setEnergyData({ ...energyData, energyNote: e.target.value })
              }
              className="block w-full mt-1 p-2 border rounded"
            />
          </label>
        </div>
      </div>

      {/* 🔸 Summary */}
      <div className="mt-8 p-4 bg-white border rounded shadow">
        <h2 className="font-semibold text-lg mb-2">Today’s Summary</h2>
        <ul className="list-disc list-inside text-sm">
          <li>
            {energyData.wokeUp.done
              ? `✅ Woke up at ${energyData.wokeUp.time}`
              : "❌ Didn't log wake-up"}
          </li>
          <li>{energyData.gym ? "✅ Gym done" : "❌ Missed gym"}</li>
          <li>
            Meals:
            {energyData.meals.breakfast.done
              ? ` 🍳 B @ ${energyData.meals.breakfast.time}`
              : ""}
            {energyData.meals.lunch ? " 🥗 L" : ""}
            {energyData.meals.dinner ? " 🍛 D" : ""}
          </li>
          <li>Sleep rating: {energyData.sleepRating}/10</li>
          <li>Note: {energyData.energyNote || "No note added"}</li>
        </ul>
      </div>
    </div>
  );
}
