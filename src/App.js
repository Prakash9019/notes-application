import "./App.css";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import {Home} from "./components/Home";
import Navbar from "./components/Navbar";
import About from "./components/About";
import NoteState from "./NoteState";
import  Login  from "./components/Login";
import Signup  from "./components/Signup";
const App=()=> {
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
