import { useReducer } from "react";

const initialState = {
  username: "",
  password: "",
  user: null,
  isLoggedIn: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USERNAME":
      return {
        ...state,
        username: action.payload,
      };

    case "SET_PASSWORD":
      return {
        ...state,
        password: action.payload,
      };

    case "LOGIN":
      return {
        ...state,
        user: state.username,
        isLoggedIn: true,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        username: "",
        password: "",
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch({
      type: "LOGIN",
    });
  };

  if (state.isLoggedIn) {
    return (
      <div>
        <h1>Hei, kirjautuminen onnistui!</h1>
        <p>Olet kirjautunut käyttäjänä: {state.user}</p>

        <button onClick={() => dispatch({ type: "LOGOUT" })}>
          Kirjaudu ulos
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Kirjautuminen</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Käyttäjätunnus</label>

          <input
            id="username"
            type="text"
            value={state.username}
            onChange={(e) =>
              dispatch({
                type: "SET_USERNAME",
                payload: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label htmlFor="password">Salasana</label>

          <input
            id="password"
            type="password"
            value={state.password}
            onChange={(e) =>
              dispatch({
                type: "SET_PASSWORD",
                payload: e.target.value,
              })
            }
          />
        </div>

        <button type="submit">Kirjaudu</button>
      </form>

      <p>Et ole kirjautunut sisään.</p>
    </div>
  );
}

export default App;
