import { createContext, useReducer, useContext, useEffect } from "react";

const AuthContext = createContext();

const initialState = {
  username: "",
  password: "",
  user: null,
  isLoggedIn: false,
  error: "", // Uusi kenttä virheviesteille
};

function authReducer(state, action) {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, username: action.payload, error: "" };
    case "SET_PASSWORD":
      return { ...state, password: action.payload, error: "" };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload, // Otetaan käyttäjänimi palvelimen vastauksesta
        isLoggedIn: true,
        password: "", // Tyhjennetään salasana turvallisuuden vuoksi
        error: "",
      };
    case "LOGIN_ERROR":
      return { ...state, error: action.payload, isLoggedIn: false };
    case "LOGOUT":
      return { ...initialState }; // Palautetaan alkutila
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Palvelimen osoite (varmista portti opettajalta, yleensä esim. http://localhost:3000)
  const API_URL = "http://localhost:3000";

  // Tarkistetaan heti sovelluksen käynnistyessä, onko palvelimella voimassa oleva sessio
  useEffect(() => {
    fetch(`${API_URL}/me`, { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Ei voimassa olevaa sessiota");
      })
      .then((data) => {
        // Jos sessio löytyi, asetetaan käyttäjä kirjautuneeksi
        dispatch({ type: "LOGIN_SUCCESS", payload: data.username });
      })
      .catch(() => {
        // Jos ei sessiota, pysytään kirjautumissivulla
      });
  }, []);

  // Kirjautumisfunktio
  const login = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: state.username,
          password: state.password,
        }),
        credentials: "include", // TÄRKEÄ: Lähettää evästeet/session palvelimelle
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: "LOGIN_SUCCESS", payload: data.username });
      } else {
        dispatch({
          type: "LOGIN_ERROR",
          payload: data.message || "Kirjautuminen epäonnistui",
        });
      }
    } catch (err) {
      dispatch({ type: "LOGIN_ERROR", payload: "Yhteysvirhe palvelimeen" });
    }
  };

  // Uloskirjautumisfunktio
  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Uloskirjautumisessa virhe", err);
    } finally {
      // Kirjaudutaan Reactissa ulos joka tapauksessa
      dispatch({ type: "LOGOUT" });
    }
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
