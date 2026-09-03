import React, { useState, createContext, useContext } from "react";

// 1. Luodaan jaettu säiliö (konteksti) datalle ohjeen mukaisesti
const ElokuvaContext = createContext();

// Alustava data tehtävänannosta
const alkuperaisetElokuvat = [
  { title: "Inception", year: "2010", genre: "Sci-Fi" },
  { title: "Parasite", year: "2019", genre: "Drama" },
  { title: "The Matrix", year: "1999", genre: "Action" },
];

// Pääkomponentti (export default)
export default function App() {
  // Luodaan tilat elokuvien listalle ja hakusanalle
  const [elokuvat, setElokuvat] = useState(alkuperaisetElokuvat);
  const [hakusana, setHakusana] = useState("");

  // Toiminto uuden elokuvan lisäämiseen
  const lisaaElokuva = (uusiElokuva) => {
    setElokuvat([...elokuvat, uusiElokuva]);
  };

  // Toiminto elokuvan poistamiseen filter-metodilla vihjeen mukaan
  const poistaElokuva = (title) => {
    setElokuvat(elokuvat.filter((elokuva) => elokuva.title !== title));
  };

  // Suodatetaan elokuvat hakusanan perusteella ennen kuin ne jaetaan eteenpäin
  const suodatetutElokuvat = elokuvat.filter((elokuva) =>
    elokuva.title.toLowerCase().includes(hakusana.toLowerCase()),
  );

  return (
    // 2. Provider tarjoaa kaiken datan ja funktiot yhtenä objektina {{ ... }}
    // Kaikki tämän sisällä olevat komponentit pääsevät dataan käsiksi ilman propseja!
    <ElokuvaContext.Provider
      value={{
        elokuvat: suodatetutElokuvat,
        hakusana,
        setHakusana,
        lisaaElokuva,
        poistaElokuva,
      }}
    >
      <div
        style={{
          padding: "20px",
          fontFamily: "sans-serif",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <h1>Elokuvakatalogi</h1>

        {/* Komponenteille EI välitetä tässä yhtään propsia */}
        <Haku />
        <Lomake />
        <Elokuvalista />
      </div>
    </ElokuvaContext.Provider>
  );
}

// --- ALIKOMPONENTIT ---

// 1. Haku-komponentti
function Haku() {
  // 3. Tuodaan hakusana ja sen muokkausfunktio suoraan kontekstista ohjeen mukaan
  const { hakusana, setHakusana } = useContext(ElokuvaContext);

  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        htmlFor="haku"
        style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}
      >
        Hae elokuvaa nimen perusteella:
      </label>
      <input
        id="haku"
        type="text"
        value={hakusana}
        onChange={(e) => setHakusana(e.target.value)}
        placeholder="Kirjoita elokuvan nimi..."
        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
      />
    </div>
  );
}

// 2. Lomake-komponentti uuden lisäämiseen
function Lomake() {
  // Tuodaan vain lisäämisfunktio yhteisestä säiliöstä
  const { lisaaElokuva } = useContext(ElokuvaContext);

  // Lomakkeen omat useState-tilat kentille vihjeen mukaan
  const [nimi, setNimi] = useState("");
  const [vuosi, setVuosi] = useState("");
  const [genre, setGenre] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nimi || !vuosi || !genre) return alert("Täytä kaikki kentät!");

    // Kutsutaan kontekstista saatua funktiota
    lisaaElokuva({ title: nimi, year: vuosi, genre: genre });

    // Tyhjennetään lomakekentät
    setNimi("");
    setVuosi("");
    setGenre("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    >
      <h3>Lisää uusi elokuva</h3>
      <input
        type="text"
        placeholder="Elokuvan nimi"
        value={nimi}
        onChange={(e) => setNimi(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          marginBottom: "5px",
          padding: "5px",
          boxSizing: "border-box",
        }}
      />
      <input
        type="text"
        placeholder="Vuosi"
        value={vuosi}
        onChange={(e) => setVuosi(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          marginBottom: "5px",
          padding: "5px",
          boxSizing: "border-box",
        }}
      />
      <input
        type="text"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          marginBottom: "10px",
          padding: "5px",
          boxSizing: "border-box",
        }}
      />
      <button type="submit" style={{ padding: "6px 12px", cursor: "pointer" }}>
        Lisää elokuva
      </button>
    </form>
  );
}

// 3. Elokuvalista-komponentti
function Elokuvalista() {
  // Tuodaan suodatetut elokuvat ja poistofunktio suoraan kontekstista
  const { elokuvat, poistaElokuva } = useContext(ElokuvaContext);

  return (
    <div>
      <h3>Elokuvat</h3>
      {elokuvat.length === 0 ? (
        <p>Ei elokuvia saatavilla.</p>
      ) : (
        <ul style={{ paddingLeft: "20px" }}>
          {/* Käytetään map-metodia listan näyttämiseen vihjeen mukaan */}
          {elokuvat.map((elokuva, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <strong>{elokuva.title}</strong> ({elokuva.year}) -{" "}
              <em>{elokuva.genre}</em>{" "}
              <button
                onClick={() => poistaElokuva(elokuva.title)}
                style={{
                  marginLeft: "10px",
                  cursor: "pointer",
                  padding: "2px 8px",
                }}
              >
                Poista
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
