import { BrowserRouter, Route, Routes } from "react-router-dom";
import CalendarApp from "./components/CalendarApp";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CalendarApp/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
