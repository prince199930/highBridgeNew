import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/auth/Sigin";
import SignUp from "./pages/auth/SignUp";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import PrivateRoutes, { PublicRoutes } from "./utils/Routes";
import { AuthProvider } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import CreateProcess from "./pages/createProcess/CreateProcess";
import EditProcess from "./pages/editProcess/EditProcess";
import { WorkflowProvider } from "./context/WorkFlowContext";


function App() {
  return (
    <AuthProvider>
      <WorkflowProvider>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            {/* Public Routes for SignIn and SignUp */}
            <Route element={<PublicRoutes />}>
              <Route element={<AuthLayout />}>
                <Route path="/" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
              </Route>
            </Route>

            {/* Private Routes for Dashboard */}
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<DashboardLayout />} />
              <Route path="/createprocess" element={<CreateProcess />} />
              <Route path="/editprocess/:id" element={<EditProcess />} />  {/* New Route */}
            </Route>
          </Routes>
        </BrowserRouter>
      </WorkflowProvider>
    </AuthProvider>
  );
}

export default App;
