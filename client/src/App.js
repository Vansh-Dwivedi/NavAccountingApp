import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Layout } from "antd";
import Home from "./components/Home";
import FormSubmissionPage from "./components/FormSubmissionPage";
import Login from "./components/Auth/Login";
import TabbedRegister from "./components/Auth/TabbedRegister";
import RoleBasedRoute from "./components/RoleBasedRoute";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import ManagerDashboard from "./components/Dashboard/ManagerDashboard";
import UserDashboard from "./components/Dashboard/UserDashboard";
import ClientDashboard from "./components/Dashboard/ClientDashboard";
import OfficeHeadDashboard from "./components/Dashboard/OfficeHeadDashboard";
import HeadDirectorDashboard from "./components/Dashboard/HeadDirectorDashboard";
import MasterDeptDashboard from "./components/Dashboard/MasterDeptDashboard";
import OperatorDashboard from "./components/Dashboard/OperatorDashboard";
import HelperDashboard from "./components/Dashboard/HelperDashboard";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import dayjs from "./utils/dayjsConfig";
import Unauthorized from "./components/Unauthorized";
import GoogleCallback from "./components/Auth/GoogleCallback";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Resources from "./components/Resources";
import Employment from './components/Employment';
import ChatButton from "./components/ChatButton";
import { FrontHeader, FrontFooter } from "./components/HeaderFooter";
import PaymentHeader from "./components/PaymentHeader";
import Payment from "./components/Payment";
import PrivacyPolicy from "./components/PrivacyPolicy";
import "./App.css";

const { Content } = Layout;

// Wrap component with header/footer
const withHeaderFooter = (Component) => {
  return (props) => (
    <Layout style={{ minHeight: "100vh" }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <PaymentHeader />
        <FrontHeader />
      </div>
      <Content style={{ position: 'relative' }}>
        <Component {...props} />
      </Content>
      <ChatButton />
      <ToastContainer />
    </Layout>
  );
};

// Pages that need header/footer
const HomeWithLayout = withHeaderFooter(Home);
const AboutWithLayout = withHeaderFooter(About);
const ServicesWithLayout = withHeaderFooter(Services);
const ResourcesWithLayout = withHeaderFooter(Resources);
const ContactWithLayout = withHeaderFooter(Contact);
const EmploymentWithLayout = withHeaderFooter(Employment);
const PrivacyPolicyWithLayout = withHeaderFooter(PrivacyPolicy);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with header/footer */}
        <Route path="/" element={<HomeWithLayout />} />
        <Route path="/about-us" element={<AboutWithLayout />} />
        <Route path="/services" element={<ServicesWithLayout />} />
        <Route path="/contact" element={<ContactWithLayout />} />
        <Route path="/resources" element={<ResourcesWithLayout />} />
        <Route path="/employment" element={<EmploymentWithLayout />} />
        <Route path="/privacy" element={<PrivacyPolicyWithLayout />} />
        
        {/* Routes without header/footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<TabbedRegister />} />
        <Route path="/payment" element={<Payment />} />
        <Route
          path="/admin-dashboard"
          element={
            <RoleBasedRoute
              role="admin"
              element={<AdminDashboard />}
            />
          }
        />
        <Route
          path="/manager-dashboard"
          element={
            <RoleBasedRoute
              role="manager"
              element={<ManagerDashboard />}
            />
          }
        />
        <Route
          path="/client-dashboard"
          element={
            <RoleBasedRoute
              role="client"
              element={<ClientDashboard />}
            />
          }
        />
        <Route
          path="/employee-dashboard"
          element={
            <RoleBasedRoute
              role="employee"
              element={<EmployeeDashboard />}
            />
          }
        />
        <Route
          path="/office-head-dashboard"
          element={
            <RoleBasedRoute
              role="office_head"
              element={<OfficeHeadDashboard />}
            />
          }
        />
        <Route
          path="/head-director-dashboard"
          element={
            <RoleBasedRoute
              role="head_director"
              element={<HeadDirectorDashboard />}
            />
          }
        />
        <Route
          path="/master-dept-dashboard"
          element={
            <RoleBasedRoute
              role="master_dept"
              element={<MasterDeptDashboard />}
            />
          }
        />
        <Route
          path="/operator-dashboard"
          element={
            <RoleBasedRoute
              role="operator"
              element={<OperatorDashboard />}
            />
          }
        />
        <Route
          path="/helper-dashboard"
          element={
            <RoleBasedRoute
              role="helper"
              element={<HelperDashboard />}
            />
          }
        />
        <Route
          path="/form-submissions/:id"
          element={<FormSubmissionPage />}
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
