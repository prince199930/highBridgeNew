import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import Auth Context
import { notify } from "../../utils/toast"; // Import Toast Notification
import apple from "../../assets/apple.svg";
import facebook from "../../assets/facebook.svg";
import google from "../../assets/google.svg";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Track API call status
  const navigate = useNavigate();
  const { signIn } = useAuth(); // Use signIn from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Disable button while logging in

    // Trim input values to remove unnecessary spaces
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Basic validation
    if (!trimmedEmail || !trimmedPassword) {
      notify("Email and password are required.", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await signIn({ email: trimmedEmail, password: trimmedPassword });

      if (response.success) {
        notify(response.message, "success"); // ✅ Show success message
        navigate("/dashboard"); // ✅ Redirect to dashboard
      } else {
        notify(response.message, "error"); // ✅ Show error message from backend
      }
    } catch (err) {
      notify("Something went wrong. Please try again.", "error"); // ✅ Handle network errors
    } finally {
      setLoading(false); // ✅ Re-enable button after request completes
    }
  };

  return (
    <div className="w-full">
      {/* Heading */}
      <h2 className="text-md text-gray-900 mb-2">WELCOME BACK!</h2>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Log In to Your Account</h3>

      {/* Sign In Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="w-full">
          <label className="text-gray-700 font-medium mb-1 block">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-white border border-gray-300 focus:ring-0 focus:outline-none"
          />
        </div>

        {/* Password Field */}
        <div className="w-full">
          <label className="text-gray-700 font-medium mb-1 block">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-white border border-gray-300 focus:ring-0 focus:outline-none"
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between items-center">
          <label className="flex items-center space-x-2 text-gray-700">
            <input type="checkbox" className="w-4 h-4 cursor-pointer" />
            <span>Remember me</span>
          </label>
          <a href="#" className="text-red-500 text-sm font-medium hover:underline">Forgot Password?</a>
        </div>

        {/* Log In Button */}
        <button
          type="submit"
          disabled={loading} // ✅ Disable button when API call is ongoing
          className={`w-full bg-red-500 text-white font-semibold p-3 rounded-md transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
          }`}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <hr className="border-gray-300" />
        <span className="absolute inset-x-0 top-[-12px] bg-gray-100 px-3 text-black-500 text-sm mx-auto w-fit font-bold">Or</span>
      </div>

      {/* Social Logins */}
      <div className="space-y-3">
        <button className="w-full border p-3 flex items-center justify-center rounded-md hover:bg-gray-100 transition">
          <img src={google} alt="Google" className="w-5 mr-3" />
          Log In with Google
        </button>
        <button className="w-full border p-3 flex items-center justify-center rounded-md hover:bg-gray-100 transition">
          <img src={facebook} alt="Facebook" className="w-5 mr-3" />
          Log In with Facebook
        </button>
        <button className="w-full border p-3 flex items-center justify-center rounded-md hover:bg-gray-100 transition">
          <img src={apple} alt="Apple" className="w-5 mr-3" />
          Log In with Apple
        </button>
      </div>

      {/* Sign Up Link */}
      <p className="text-center mt-4 text-gray-700">
        New User? <a href="/signup" className="text-red-500 font-semibold hover:underline">SIGN UP HERE</a>
      </p>
    </div>
  );
};

export default SignIn;
