import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShowGestions from "./components/ShowGestions";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShowGestions></ShowGestions>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
