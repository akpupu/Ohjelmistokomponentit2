import { useState, useEffect } from "react";
import Kukka from "./Kukka";
import Viljelija from "./Viljelia";
import Varasto from "./Varasto";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("kukka");
  const [kukat, setKukat] = useState([]);
  const [virhe, setVirhe] = useState(null);
  const [ladataan, setLadataan] = useState(true);

  useEffect(() => {
    fetch("/kukkatukku/hae_kaikki/kukka")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Tietojen hakeminen epäonnistui");
        }

        return res.json();
      })
      .then((data) => {
        if (data && data.kyselynTulos) {
          setKukat(data.kyselynTulos);
        } else if (Array.isArray(data)) {
          setKukat(data);
        } else {
          setKukat([]);
        }

        setLadataan(false);
      })
      .catch((err) => {
        console.error(err);
        setVirhe("Tietojen lataus epäonnistui.");
        setLadataan(false);
      });
  }, []);

  return (
    <div className="app">
      <nav className="tabs">
        <button onClick={() => setActiveTab("kukka")}>
          Kukka
        </button>

        <button onClick={() => setActiveTab("viljelija")}>
          Viljelijä
        </button>

        <button onClick={() => setActiveTab("varasto")}>
          Varasto
        </button>
      </nav>

      {virhe && <div className="virhe">{virhe}</div>}

      {ladataan ? (
        <p>Ladataan tietoja tietokannasta...</p>
      ) : (
        <>
          {activeTab === "kukka" && (
            <Kukka
              kukat={kukat}
              setKukat={setKukat}
            />
          )}

          {activeTab === "viljelija" && <Viljelija />}

          {activeTab === "varasto" && <Varasto />}
        </>
      )}
    </div>
  );
}

export default App;
