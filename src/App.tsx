import "./App.css";
import LoginComponent from "./LoginComponent";
import LoginService from "./service/LoginService";

function App() {
  const loginService = new LoginService();

  const setToken = (token: string) => {
    console.log(`received the token ${token}`);
  };

  return (
    <div className="App">
      <LoginComponent loginService={loginService} setToken={setToken} />
    </div>
  );
}

export default App;
