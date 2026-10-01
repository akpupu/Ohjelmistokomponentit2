import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import UserInfo from "./components/UserInfo";

function MainApp() {
  const { state } = useAuth();

  return (
    <div>
      <Header />
      <main style={{ padding: "20px" }}>
        {state.isLoggedIn ? <UserInfo /> : <LoginForm />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
