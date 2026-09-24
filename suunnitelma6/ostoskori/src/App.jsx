import Tuotelista from "./components/Tuotelista";
import Ostoskori from "./components/Ostoskori";

function App() {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Ostoslista-sovellus</h1>
      <p>Tässä versiossa tiedot jaetaan globaalisti ilman propseja.</p>

      {/* Näytetään kaupan tuotteet */}
      <Tuotelista />

      {/* Näytetään käyttäjän ostoskori */}
      <Ostoskori />
    </div>
  );
}

export default App;
