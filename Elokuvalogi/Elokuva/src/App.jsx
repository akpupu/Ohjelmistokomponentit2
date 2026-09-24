import React, { useState, useContext } from "react";
import "./App.css";
// Tuodaan kontekstit uuden tiedoston kautta
import {
  ElokuvaContext,
  ThemeContext,
  UserContext,
} from "./context/CartContext";

export default function App() {
  const { theme } = useContext(ThemeContext);

  return (
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
        // Dynaaminen taustaväri ja tekstiväri teeman mukaan
        backgroundColor: theme === "light" ? "#ffffff" : "#121212",
        color: theme === "light" ? "#000000" : "#ffffff",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <Header />
        <Haku />
        <Lomake />
        <Elokuvalista />
      </div>
    </div>
  );
}

// --- ALIKOMPONENTIT ---

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

function Elokuvalista() {
  const { elokuvat, poistaElokuva } = useContext(ElokuvaContext);
  const { theme } = useContext(ThemeContext);

  const buttonStyle = {
    marginLeft: "10px",
    padding: "3px 8px",
    cursor: "pointer",
    backgroundColor: "black",
    color: "white",
    border: "1px solid #555",
    borderRadius: "4px",
    fontSize: "0.85rem",
  };

  return (
    <div>
      <h3>Elokuvat</h3>
      {elokuvat.length === 0 ? (
        <p>Ei elokuvia saatavilla.</p>
      ) : (
        <ul style={{ paddingLeft: "20px" }}>
          {elokuvat.map((elokuva, index) => (
            <li
              key={index}
              style={{
                marginBottom: "10px",
                color: theme === "light" ? "black" : "white",
              }}
            >
              <strong>{elokuva.title}</strong> ({elokuva.year}) -{" "}
              <em>{elokuva.genre}</em>
              <button
                onClick={() => poistaElokuva(elokuva.title)}
                style={buttonStyle}
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
