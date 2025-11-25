import { useEffect } from "react";
import "./App.css";
import "./index.css";
import Routes from "./Routes";
import { useNavigate } from "react-router-dom";
import { setupInterceptors } from "./utils/httpClient";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);

  return <Routes />;
}

export default App;
