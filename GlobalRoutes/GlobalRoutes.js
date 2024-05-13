import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import About from "../components/AboutUs";
import Review from "../components/Review";
import Contact from "../components/ContactUs";
import AdminReviews from "../components/AdminReviews";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import UploadInvoice from "../components/UploadInvoice";
import AdminDashboard from "../components/AdminDashboard";
import UserRegistration from "../components/UserRegistration";
import CustomerDashboard from "../components/CustomerDashboard";
import UserDashboard from "../components/UserDashboard";
import LeftSidebar from "../components/LeftSidebar";
import Invoices from "../components/Invoices";
import RightSidebar from "../components/RightSidebar";
import Invoice from "../components/InvoiceDashboard";
import IssueInvoice from "../components/IssueInvoice";
import DueInvoice from "../components/DueInvoice";
import PaidInvoicesPage from "../components/PaidInvoice";
import UnpaidInvoicesPage from "../components/UnpaidInvoice";
import Settings from "../components/Settings";
import CustomerSettings from "../components/CustomerSettings";
import Help from "../components/Help";
import ContactInfo from "../components/ContactInfo";
import AdminInvoice from "../components/AdminInvoice";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import FreelancerDashboard from "../components/FreelancerDashboard";
import CreateInvoice from '../components/CreateInvoice';
import InvoiceDashboard from '../components/InvoiceDashboard';
import InvoiceDetails from '../components/InvoiceDetails';
import ViewInvoice from '../components/ViewInvoice';
import FreelancerHelp from '../components/FreelancerHelp';
const GlobalRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/review" element={<Review />} />
      <Route path="/admin-reviews" element={<AdminReviews />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/LeftSidebar" element={<LeftSidebar />} />
      <Route path="/RightSidebar" element={<RightSidebar />} />
      <Route path="/customerdashboard" element={<CustomerDashboard />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/upload-invoice" element={<UploadInvoice />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/user-registration" element={<UserRegistration />} />
      <Route path="/invoicedashboard" element={<Invoice />} />
      <Route path="/issueinvoice" element={<IssueInvoice />} />
      <Route path="/dueinvoice" element={<DueInvoice />} />
      <Route path="/paidinvoice" element={<PaidInvoicesPage/>} />
      <Route path="/unpaidinvoice" element={<UnpaidInvoicesPage/>} />
      <Route path="/contact-information" element={<ContactInfo />} />
      <Route path="/admin-invoice" element={<AdminInvoice />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/customer-settings" element={<CustomerSettings />} />
      <Route path="/help" element={<Help />} />
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      <Route path="/freelancerdashboard" element={<FreelancerDashboard />} />
      <Route path="/create-invoice" element={<CreateInvoice />} />
      <Route path="/invoicedashboard" element={<InvoiceDashboard />} />
      <Route path="/invoicedetails" element={<InvoiceDetails />} />
      <Route path="/view-invoice" element={<ViewInvoice />} />
      <Route path="/freelancer-help" element={<FreelancerHelp />} />
    </Routes>
  );
};

export default GlobalRoutes;
