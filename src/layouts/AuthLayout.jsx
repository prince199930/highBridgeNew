import { Outlet } from "react-router-dom";
import backImg from "../assets/back-img.svg";
import logo_highbridge from '../assets/logo_highbridge.png'

const AuthLayout = () => {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.85)), url(${backImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
  
        {/* Main Container */}
        <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center p-8 gap-12">
          
          {/* Left Side - Branding */}
          <div className="w-full md:w-1/2 flex flex-col items-center text-white text-center">
            <img src={logo_highbridge} alt="HighBridge Logo" className="w-48 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Building the Future...</h1>
            <p className="text-lg text-gray-200 max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
  
          {/* Right Side - Auth Forms */}
          <div className="w-full md:w-1/2 bg-gray-100 p-8 rounded-lg shadow-lg">
            <Outlet />
          </div>
  
        </div>
      </div>
    );
  };


export default AuthLayout;
