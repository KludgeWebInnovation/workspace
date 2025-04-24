import { useState, useEffect } from "react";

type Timestamped = {
  done: boolean;
  time: string | null;
  description?: string;
};

type EnergyData = {
  wokeUp: Timestamped;
  gym: Timestamped;
  meals: {
    breakfast: Timestamped;
    lunch: Timestamped;
    dinner: Timestamped;
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
  gym: { done: false, time: null },
  meals: {
    breakfast: { done: false, time: null, description: "" },
    lunch: { done: false, time: null, description: "" },
    dinner: { done: false, time: null, description: "" },
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

  const toggleTimestamped = (key: keyof EnergyData | keyof EnergyData["meals"]) => {
    if (key === "wokeUp" || key === "gym") {
      setEnergyData((prev) => ({
        ...prev,
        [key]: {
          done: !prev[key].done,
          time: !prev[key].done ? logTime() : null,
        },
      }));
    } else {
      setEnergyData((prev) => ({
        ...prev,
        meals: {
          ...prev.meals,
          [key]: {
            ...prev.meals[key],
            done: !prev.meals[key].done,
            time: !prev.meals[key].done ? logTime() : null,
          },
        },
      }));
    }
  };

  const updateMealDescription = (meal: keyof EnergyData["meals"], value: string) => {
    setEnergyData((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [meal]: {
          ...prev.meals[meal],
          description: value,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Wake Up */}
        <div>
          <button
            onClick={() => toggleTimestamped("wokeUp")}
            className={`px-4 py-2 rounded ${energyData.wokeUp.done ? "bg-green-200" : "bg-gray-200"}`}
          >
            {energyData.wokeUp.done ? `✅ Woke Up at ${energyData.wokeUp.time}` : "☐ Wake Up"}
          </button>
        </div>

        {/* Gym */}
        <div>
          <button
            onClick={() => toggleTimestamped("gym")}
            className={`px-4 py-2 rounded ${energyData.gym.done ? "bg-green-200" : "bg-gray-200"}`}
          >
            {energyData.gym.done ? `✅ Gym at ${energyData.gym.time}` : "☐ Gym"}
          </button>
        </div>

        {/* Meals */}
        {(["breakfast", "lunch", "dinner"] as (keyof EnergyData["meals"])[]).map((meal) => (
          <div key={meal} className="ml-4 space-y-1">
            <button
              onClick={() => toggleTimestamped(meal)}
              className={`px-4 py-2 rounded ${energyData.meals[meal].done ? "bg-green-200" : "bg-gray-200"}`}
            >
              {energyData.meals[meal].done
                ? `✅ ${meal[0].toUpperCase() + meal.slice(1)} at ${energyData.meals[meal].time}`
                : `☐ ${meal[0].toUpperCase() + meal.slice(1)}`}
            </button>
            <input
              type="text"
              placeholder={`What did you eat for ${meal}?`}
              value={energyData.meals[meal].description || ""}
              onChange={(e) => updateMealDescription(meal, e.target.value)}
              className="block w-full p-2 mt-1 border rounded text-sm"
            />
          </div>
        ))}

        {/* Sleep Rating */}
        <div>
          <label>
            Sleep Rating (1–10):&nbsp;
            <input
              type="number"
              min="1"
              max="10"
              value={energyData.sleepRating}
              onChange={(e) => setEnergyData({ ...energyData, sleepRating: Number(e.target.value) })}
              className="w-16 p-1 border rounded"
            />
          </label>
        </div>

        {/* Note */}
        <div>
          <label>
            Energy Note:
            <textarea
              value={energyData.energyNote}
              onChange={(e) => setEnergyData({ ...energyData, energyNote: e.target.value })}
              className="block w-full mt-1 p-2 border rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
