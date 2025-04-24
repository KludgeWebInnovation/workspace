import EnergyLog from "./components/EnergyLog";
import HistoryLog from "./components/HistoryLog";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-8">
      <h1 className="text-xl font-bold">Daily Energy Tracker</h1>
      <EnergyLog />
      <HistoryLog />
    </div>
  );
}

export default App;
