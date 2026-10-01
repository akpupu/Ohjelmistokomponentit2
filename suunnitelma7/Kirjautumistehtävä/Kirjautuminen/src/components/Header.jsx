import { useAuth } from "../context/AuthContext";

function Header() {
  const { state } = useAuth();

  return (
    <header
      style={{
        borderBottom: "1px solid #ccc",
        padding: "10px",
        marginBottom: "20px",
      }}
    >
      <h2>Oikea Kirjautumissovellus</h2>
      {state.isLoggedIn && (
        <p>
          <strong>Kirjautunut käyttäjä: {state.user}</strong>
        </p>
      )}
    </header>
  );
}

export default Header;
