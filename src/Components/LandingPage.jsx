import { useNavigate } from "react-router-dom";

const LandingPage = ({ setIsGuest }) => {
  const navigate = useNavigate();

  const handleGuest = () => {
    localStorage.setItem("papps_guest", true); // mark as guest
    setIsGuest(true); // update state in App.jsx
    navigate("/home"); // go to home page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff7ec] px-4">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-md w-full border-t-8 border-[#FFAC1C] text-center">
        <h2 className="text-3xl font-bold text-[#FFAC1C] mb-8">
          Welcome to PAPPS
        </h2>

        <p className="text-gray-600 mb-8">
          Please choose how you want to join:
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleGuest}
            className="w-full bg-[#FFAC1C] text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:bg-white hover:text-black! border border-[#FFAC1C] active:scale-95"
          >
            Join as a Member
          </button>

          <button
            onClick={() => navigate("/admin/login")}
            className="w-full bg-white text-[#FFAC1C] font-semibold py-3 rounded-lg transition-all duration-200 hover:bg-[#FFAC1C] hover:text-black! border border-[#FFAC1C] active:scale-95"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
