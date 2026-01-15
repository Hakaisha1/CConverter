import CurrencyConverter from "./components/currency-converter";
import ConversionHistory from "./components/conversion-history";

function App() {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <CurrencyConverter />

      <div className="container-page py-10">
        <h2 className="display text-3xl font-semibold text-[var(--ink)] mb-6">
          Recent Conversions
        </h2>
        <ConversionHistory />
      </div>
    </div>
  )
}

export default App;
