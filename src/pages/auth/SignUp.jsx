import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import Auth Context
import { notify } from "../../utils/toast"; // Import Toast Notification
import apple from "../../assets/apple.svg";
import facebook from "../../assets/facebook.svg";
import google from "../../assets/google.svg";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Prevent multiple submissions
  const navigate = useNavigate();
  const { signUp } = useAuth(); // Use signUp from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Trim input values to prevent issues with extra spaces
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Basic validation
    if (!trimmedEmail || !trimmedPassword) {
      notify("Email and password are required.", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await signUp({ email: trimmedEmail, password: trimmedPassword });

      if (response.success) {
        notify(response.message, "success"); // Success Toast
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        notify(response.message, "error"); // Error Toast with actual message
      }
    } catch (err) {
      notify("Signup failed. Please try again.", "error"); // Generic Error Toast
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="w-full">
      {/* Heading */}
      <h2 className="text-md font text-gray-900 mb-2">CREATE AN ACCOUNT</h2>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Sign Up to Get Started</h3>

      {/* Sign Up Form */}
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
            className="w-full p-3 rounded-md bg-white focus:ring-0 focus:outline-none"
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
            className="w-full p-3 rounded-md bg-white focus:ring-0 focus:outline-none"
          />
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-center">
          <input type="checkbox" className="w-4 h-4 mr-2" required />
          <span className="text-gray-700 text-sm">
            I agree to the <a href="#" className="text-red-500">Terms & Conditions</a>
          </span>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={loading} // Disable while loading
          className={`w-full text-white font-semibold p-3 rounded-md transition duration-200 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <hr className="border-gray-300" />
        <span className="absolute inset-x-0 top-[-12px] bg-gray-100 px-3 text-black-500 text-sm mx-auto w-fit font-bold">Or</span>
      </div>

      {/* Social Sign Ups */}
      <div className="space-y-3">
        <button className="w-full border p-3 flex items-center justify-center rounded-md">
          <img src={google} alt="Google" className="w-5 mr-3" />
          Log In with Google
        </button>
        <button className="w-full border p-3 flex items-center justify-center rounded-md">
          <img src={facebook} alt="Facebook" className="w-5 mr-3" />
          Log In with Facebook
        </button>
        <button className="w-full border p-3 flex items-center justify-center rounded-md">
          <img src={apple} alt="Apple" className="w-5 mr-3" />
          Log In with Apple
        </button>
      </div>

      {/* Log In Link */}
      <p className="text-center mt-4 text-gray-700">
        Already have an account? <a href="/" className="text-red-500 font-semibold">LOG IN HERE</a>
      </p>
    </div>
  );
};

export default SignUp;
