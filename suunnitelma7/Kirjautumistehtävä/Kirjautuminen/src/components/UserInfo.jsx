import { useAuth } from "../context/AuthContext";

function UserInfo() {
  const { state, logout } = useAuth();

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h3>Tervetuloa, {state.user}!</h3>
      <button onClick={logout}>Kirjaudu ulos</button>
    </div>
  );
}

export default UserInfo;
