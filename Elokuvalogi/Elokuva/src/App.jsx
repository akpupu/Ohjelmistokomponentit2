import React, { useState, useContext } from "react";
import "./App.css";
import { CartContext, ThemeContext, UserContext } from "./context/CartContext";

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
        backgroundColor: theme === "light" ? "#ffffff" : "#121212",
        color: theme === "light" ? "#000000" : "#ffffff",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <Header />
        <Haku />
        <Lomake />
        <Ostoslista />
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
    backgroundColor: theme === "light" ? "black" : "#333",
    color: "white",
    border: theme === "light" ? "1px solid #555" : "1px solid #777",
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
        borderBottom: theme === "light" ? "1px solid #ccc" : "1px solid #444",
      }}
    >
      <div
        style={{
          display: "flex",
          justifycontent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, color: theme === "light" ? "black" : "white" }}>
          Ostoslista
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
  const { hakusana, setHakusana } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);

  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        htmlFor="haku"
        style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}
      >
        Hae tuotetta nimen perusteella:
      </label>
      <input
        id="haku"
        type="text"
        value={hakusana}
        onChange={(e) => setHakusana(e.target.value)}
        placeholder="Kirjoita tuotteen nimi..."
        style={{
          width: "100%",
          padding: "8px",
          boxSizing: "border-box",
          backgroundColor: theme === "light" ? "#fff" : "#222",
          color: theme === "light" ? "#000" : "#fff",
          border: theme === "light" ? "1px solid #ccc" : "1px solid #444",
          borderRadius: "4px",
        }}
      />
    </div>
  );
}

function Lomake() {
  const { addToCart } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);

  const [nimi, setNimi] = useState("");
  const [maara, setMaara] = useState("1");
  const [kategoria, setKategoria] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nimi || !maara || !kategoria) return alert("Täytä kaikki kentät!");

    addToCart({ name: nimi, quantity: maara, category: kategoria });
    setNimi("");
    setMaara("1");
    setKategoria("");
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    marginBottom: "5px",
    padding: "5px",
    boxSizing: "border-box",
    backgroundColor: theme === "light" ? "#fff" : "#222",
    color: theme === "light" ? "#000" : "#fff",
    border: theme === "light" ? "1px solid #ccc" : "1px solid #444",
    borderRadius: "4px",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: "20px",
        padding: "15px",
        border: theme === "light" ? "1px solid #ccc" : "1px solid #444",
        borderRadius: "5px",
        backgroundColor: theme === "light" ? "transparent" : "#1e1e1e",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0" }}>Lisää uusi tuote</h3>
      <input
        type="text"
        placeholder="Tuotteen nimi"
        value={nimi}
        onChange={(e) => setNimi(e.target.value)}
        style={inputStyle}
      />
      <input
        type="number"
        placeholder="Määrä"
        min="1"
        value={maara}
        onChange={(e) => setMaara(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Kategoria (esim. Maitotuotteet)"
        value={kategoria}
        onChange={(e) => setKategoria(e.target.value)}
        style={{ ...inputStyle, marginBottom: "10px" }}
      />
      <button
        type="submit"
        style={{
          padding: "6px 12px",
          cursor: "pointer",
          backgroundColor: theme === "light" ? "black" : "#333",
          color: "white",
          border: theme === "light" ? "1px solid #555" : "1px solid #777",
          borderRadius: "4px",
        }}
      >
        Lisää tuote
      </button>
    </form>
  );
}

function Ostoslista() {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);

  const buttonStyle = {
    marginLeft: "10px",
    padding: "3px 8px",
    cursor: "pointer",
    backgroundColor: theme === "light" ? "black" : "#333",
    color: "white",
    border: theme === "light" ? "1px solid #555" : "1px solid #777",
    borderRadius: "4px",
    fontSize: "0.85rem",
  };

  return (
    <div>
      <h3>Ostoskorin sisältö</h3>
      {cartItems.length === 0 ? (
        <p>Ostoskori on tyhjä.</p>
      ) : (
        <ul style={{ paddingLeft: "20px" }}>
          {cartItems.map((item, index) => (
            <li
              key={index}
              style={{
                marginBottom: "10px",
                color: theme === "light" ? "black" : "white",
              }}
            >
              <strong>{item.name}</strong> ({item.quantity} kpl) -{" "}
              <em>{item.category}</em>
              <button
                onClick={() => removeFromCart(item.name)}
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
