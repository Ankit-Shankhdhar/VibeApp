import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Theme Constants
  const THEME = {
    bg: "bg-[#E8F5BD]/90", // Matches your main background with blur
    container: "bg-[#A2CB8B]",
    button: "bg-[#84B179]",
    buttonHover: "hover:bg-[#739c69]",
    border: "border-[#84B179]",
    textDark: "text-[#2D3A29]",
    textMuted: "text-[#4A5D45]",
  };

  return (
    <nav className={`relative z-50 ${THEME.bg} backdrop-blur-md border-b-2 ${THEME.border} shadow-sm transition-colors duration-1000`}>
      <div className="w-full px-4 sm:px-10">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo - Updated to Theme Colors */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${THEME.button} flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform duration-300`}>
                <span className="text-xl sm:text-2xl text-white">💖</span>
              </div>
            </div>
            <span className={`text-2xl sm:text-3xl font-black tracking-tighter ${THEME.textDark}`}>
              VIBE
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to={`/profile/${user.id}`}
                  className={`flex items-center space-x-2 px-5 py-2 rounded-xl border ${THEME.border} ${THEME.textDark} hover:bg-[#A2CB8B]/40 transition-all duration-300 font-bold`}
                >
                  <span className="text-lg">👤</span>
                  <span>Profile</span>
                </Link>
                
                <button
                  onClick={logout}
                  className={`flex items-center space-x-2 px-5 py-2 rounded-xl ${THEME.button} text-white font-bold ${THEME.buttonHover} active:scale-95 transition-all duration-300 shadow-sm`}
                >
                  <span>Logout</span>
                </button>

                {/* User badge */}
                <div className={`flex items-center space-x-2 px-4 py-1.5 ${THEME.container} rounded-xl border border-[#84B179]/20`}>
                  <span className={`text-sm font-bold ${THEME.textDark}`}>
                    {user.username}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-6 py-2 rounded-xl border ${THEME.border} ${THEME.textDark} hover:bg-[#A2CB8B]/40 transition-all duration-300 font-bold`}
                >
                  Login
                </Link>
                
                <Link
                  to="/register"
                  className={`px-6 py-2 rounded-xl ${THEME.button} text-white font-bold ${THEME.buttonHover} transition-all duration-300 shadow-sm`}
                >
                  Join VIBE
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-xl border ${THEME.border} ${THEME.textDark}`}
          >
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-[#2D3A29] transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-[#2D3A29] ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-[#2D3A29] transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 border-t border-[#84B179]/30' : 'max-h-0'}`}>
        <div className={`${THEME.bg} px-4 py-6 space-y-4`}>
          {user ? (
            <>
              <Link
                to={`/profile/${user.id}`}
                className={`flex items-center justify-center space-x-2 w-full py-3 rounded-xl border ${THEME.border} ${THEME.textDark} font-bold`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>My Profile</span>
              </Link>
              <button
                onClick={logout}
                className={`w-full py-3 rounded-xl ${THEME.button} text-white font-bold shadow-sm`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`block text-center w-full py-3 rounded-xl border ${THEME.border} ${THEME.textDark} font-bold`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`block text-center w-full py-3 rounded-xl ${THEME.button} text-white font-bold`}
                onClick={() => setIsMenuOpen(false)}
              >
                Join VIBE
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;