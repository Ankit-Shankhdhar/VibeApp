import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Chat from "./pages/Chat";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* ADD THIS LINE: Matches exactly "/chat" */}
        <Route 
          path="/chat" 
          element={
            // <ProtectedRoute>
              <Chat />
            // </ProtectedRoute>
          } 
        />

        {/* THIS IS YOUR EXISTING LINE: Matches "/chat/1", "/chat/2", etc. */}
        <Route
          path="/chat/:id"
          element={
            // <ProtectedRoute>
              <Chat />
            // </ProtectedRoute>
          }
        />
      </Routes>


    </BrowserRouter>
  );
}

export default App;
