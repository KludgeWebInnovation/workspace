import EnergyLog from "./components/EnergyLog";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-xl font-bold mb-4">Daily Energy Tracker</h1>
      <EnergyLog />
    </div>
  );
}

export default App;
