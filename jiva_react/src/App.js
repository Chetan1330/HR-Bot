import logo from "./logo.svg";
import "./App.css";
import RecordVid from "./components/chatbot/Record";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Profile from "./components/web/Profile";

function RequireAuth({ children }) {
  if (1==1) {
    return children;
  } else {
    // return children;
    return <Navigate to="/" replace />;
  }
}

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<RecordVid />} />
      <Route path="/profile/:id" element={<Profile />} />
      
      {/* <Route
        path="/scan"
        element={
          <RequireAuth>
            // <Scan />
          </RequireAuth>
        }
      /> */}
      
      
      
      
    </Routes>
  </Router>
  );
}

export default App;
