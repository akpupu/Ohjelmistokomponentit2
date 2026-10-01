import { useAuth } from "../context/AuthContext";

function LoginForm() {
  const { state, dispatch, login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(); // Kutsutaan palvelinkutsun tekevää funktiota
  };

  return (
    <div style={{ maxWidth: "300px", margin: "0 auto" }}>
      <h3>Kirjautuminen palvelimelle</h3>

      {state.error && (
        <p style={{ color: "red", fontWeight: "bold" }}>{state.error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="username" style={{ display: "block" }}>
            Käyttäjätunnus
          </label>
          <input
            id="username"
            type="text"
            value={state.username}
            onChange={(e) =>
              dispatch({ type: "SET_USERNAME", payload: e.target.value })
            }
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="password" style={{ display: "block" }}>
            Salasana
          </label>
          <input
            id="password"
            type="password"
            value={state.password}
            onChange={(e) =>
              dispatch({ type: "SET_PASSWORD", payload: e.target.value })
            }
          />
        </div>

        <button type="submit">Kirjaudu</button>
      </form>
    </div>
  );
}

export default LoginForm;
