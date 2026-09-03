import React, { useState, createContext, useContext } from "react";
import "./App.css";

// 1. Luodaan jaetut säiliöt (kontekstit) datalle ohjeen mukaisesti
const ElokuvaContext = createContext();
const ThemeContext = createContext();
const UserContext = createContext();

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

  // UUDET TILAT: Teema ja Käyttäjänimi
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState("Matti Meikäläinen");

  // Toiminto teeman vaihtamiseen
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

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
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <ElokuvaContext.Provider
          value={{
            elokuvat: suodatetutElokuvat,
            hakusana,
            setHakusana,
            lisaaElokuva,
            poistaElokuva,
          }}
        >
          {/* Tämä luokka vaihtuu dynaamisesti ja peittää koko ruudun taustan */}
          <div
            className={`app ${theme}`}
            style={{
              minHeight: "100vh",
              width: "100vw",
              position: "absolute",
              top: 0,
              left: 0,
              padding: "20px",
              boxSizing: "border-box",
              fontFamily: "sans-serif",
            }}
          >
            {/* Alkuperäinen keskitetty asettelu laatikolle */}
            <div style={{ maxWidth: "500px", margin: "0 auto" }}>
              <Header />
              <Haku />
              <Lomake />
              <Elokuvalista />
            </div>
          </div>
        </ElokuvaContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// --- ALIKOMPONENTIT ---

// Header-komponentti aina mustilla painikkeilla ja teemaan mukautuvalla otsikolla
function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, setUser } = useContext(UserContext);
  const [nimiInput, setNimiInput] = useState(user);

  const handleNameChange = (e) => {
    e.preventDefault();
    if (nimiInput.trim() !== "") {
      setUser(nimiInput);
    }
  };

  // Pysyvästi musta tyyli kaikille napeille
  const buttonStyle = {
    padding: "6px 12px",
    cursor: "pointer",
    backgroundColor: "black",
    color: "white",
    border: "1px solid #555",
    borderRadius: "4px",
  };

  const inputStyle = {
    padding: "4px",
    backgroundColor: theme === "light" ? "#fff" : "#222",
    color: theme === "light" ? "#000" : "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <header
      style={{
        marginBottom: "20px",
        paddingBottom: "10px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Otsikon väri pakotetaan mustaksi light-modessa ja valkoiseksi dark-modessa */}
        <h1 style={{ margin: 0, color: theme === "light" ? "black" : "white" }}>
          Elokuvakatalogi
        </h1>
        <button onClick={toggleTheme} style={buttonStyle}>
          Vaihda teema
        </button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <span>
          Käyttäjä: <strong>{user}</strong>
        </span>
        <form
          onSubmit={handleNameChange}
          style={{ marginTop: "5px", display: "flex", gap: "5px" }}
        >
          <input
            type="text"
            value={nimiInput}
            onChange={(e) => setNimiInput(e.target.value)}
            placeholder="Muuta käyttäjänimeä"
            style={inputStyle}
          />
          <button type="submit" style={{ ...buttonStyle, padding: "4px 8px" }}>
            Tallenna
          </button>
        </form>
      </div>
    </header>
  );
}

// 1. Haku-komponentti
function Haku() {
  const { hakusana, setHakusana } = useContext(ElokuvaContext);
  const { theme } = useContext(ThemeContext);

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
        style={{
          width: "100%",
          padding: "8px",
          boxSizing: "border-box",
          backgroundColor: theme === "light" ? "#fff" : "#222",
          color: theme === "light" ? "#000" : "#fff",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
    </div>
  );
}

// 2. Lomake-komponentti uuden lisäämiseen aina mustalla painikkeella
function Lomake() {
  const { lisaaElokuva } = useContext(ElokuvaContext);
  const { theme } = useContext(ThemeContext);

  const [nimi, setNimi] = useState("");
  const [vuosi, setVuosi] = useState("");
  const [genre, setGenre] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nimi || !vuosi || !genre) return alert("Täytä kaikki kentät!");

    lisaaElokuva({ title: nimi, year: vuosi, genre: genre });

    setNimi("");
    setVuosi("");
    setGenre("");
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    marginBottom: "5px",
    padding: "5px",
    boxSizing: "border-box",
    backgroundColor: theme === "light" ? "#fff" : "#222",
    color: theme === "light" ? "#000" : "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
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
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Vuosi"
        value={vuosi}
        onChange={(e) => setVuosi(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        style={{ ...inputStyle, marginBottom: "10px" }}
      />
      <button
        type="submit"
        style={{
          padding: "6px 12px",
          cursor: "pointer",
          backgroundColor: "black",
          color: "white",
          border: "1px solid #555",
          borderRadius: "4px",
        }}
      >
        Lisää elokuva
      </button>
    </form>
  );
}

// 3. Elokuvalista-komponentti aina mustalla Poista-painikkeella
function Elokuvalista() {
  const { elokuvat, poistaElokuva } = useContext(ElokuvaContext);

  return (
    <div>
      <h3>Elokuvat</h3>
      {elokuvat.length === 0 ? (
        <p>Ei elokuvia saatavilla.</p>
      ) : (
        <ul style={{ paddingLeft: "20px" }}>
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
                  backgroundColor: "black",
                  color: "white",
                  border: "1px solid #555",
                  borderRadius: "4px",
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
