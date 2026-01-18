import CurrencyConverter from "./components/currency-converter";
import MenuBar from "./components/menubar";

function App() {
  return (
    <div className="min-h-screen bg-(--paper)">
      <MenuBar />
      <CurrencyConverter />
    </div>
  )
}

export default App;
