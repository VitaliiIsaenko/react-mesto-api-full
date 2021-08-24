import { BrowserRouter } from "react-router-dom";
import App from "./App";

export default function AppContainer() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
