import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = ({ setAuth }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const auth = JSON.parse(localStorage.getItem("papps_auth"));

    if (token && auth?.isLoggedIn) {
      navigate("/admin/members");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Call backend API
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      // Save token
      localStorage.setItem("token", res.data.token);

      // Save auth info
      const authData = {
        role: res.data.role,
        isLoggedIn: true,
      };

      localStorage.setItem("papps_auth", JSON.stringify(authData));

      // Update App.jsx state
      setAuth(authData);

      // Redirect
      navigate("/admin/members");
    } catch (error) {
      console.error(error);

      if (error.response?.data?.msg) {
        alert(error.response.data.msg);
      } else {
        alert("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff7ec] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full border-t-8 border-[#FFAC1C]"
      >
        <h2 className="text-3xl font-bold text-center text-[#FFAC1C] mb-6">
          Admin Login
        </h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFAC1C]"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFAC1C]"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FFAC1C] text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:bg-white hover:text-black border border-[#FFAC1C] active:scale-95 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
