import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Search from "../pages/search/page";
import About from "../pages/about/page";
import Services from "../pages/services/page";
import ServiceDetail from "../pages/services/detail";
import Doctors from "../pages/doctors/page";
import DoctorProfile from "../pages/doctors/profile";
import Booking from "../pages/booking/page";
import BookingConfirmation from "../pages/booking/confirmation";
import Contact from "../pages/contact/page";
import Packages from "../pages/packages/page";
import PackageDetail from "../pages/packages/detail";
import Offers from "../pages/offers/page";
import FAQ from "../pages/faq/page";
import Blog from "../pages/blog/page";
import BlogDetail from "../pages/blog/detail";
import DNASimulator from "../pages/dna-simulator/page";
import Legal from "../pages/legal/page";

// Admin Dashboard Pages
import AdminLogin from "../pages/admin/login";
import AdminDashboard from "../pages/admin/dashboard";
import AdminBookings from "../pages/admin/bookings";
import AdminServices from "../pages/admin/services/page";
import AdminDoctors from "../pages/admin/doctors/page";
import AdminPackages from "../pages/admin/packages/page";
import AdminMessages from "../pages/admin/messages";
import AdminSettings from "../pages/admin/settings";
import AdminCMS from "../pages/admin/cms/page";
import AdminCMSBlog from "../pages/admin/cms/blog/page";
import AdminCMSFAQ from "../pages/admin/cms/faq/page";
import AdminCMSSettings from "../pages/admin/cms/settings/page";
import AdminCMSAbout from "../pages/admin/cms/about/page";
import AdminCMSContact from "../pages/admin/cms/contact/page";
import AdminCMSTestimonials from "../pages/admin/cms/testimonials/page";
import AdminCMSOffers from "../pages/admin/cms/offers/page";
import AdminCMSSearch from "../pages/admin/cms/search/page";
import AdminCMSHome from "../pages/admin/cms/home/page";
import AdminUsers from "../pages/admin/users/page";
import DoctorBlogPage from "../pages/admin/blog/page";
import AdminReports from "../pages/admin/reports/page";
import AdminDNASimulator from "../pages/admin/dna-simulator/page";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/search", element: <Search /> },
  { path: "/about", element: <About /> },
  { path: "/services", element: <Services /> },
  { path: "/services/:id", element: <ServiceDetail /> },
  { path: "/doctors", element: <Doctors /> },
  { path: "/doctors/:id", element: <DoctorProfile /> },
  { path: "/booking", element: <Booking /> },
  { path: "/booking/confirmation", element: <BookingConfirmation /> },
  { path: "/contact", element: <Contact /> },
  { path: "/packages", element: <Packages /> },
  { path: "/packages/:id", element: <PackageDetail /> },
  { path: "/offers", element: <Offers /> },
  { path: "/faq", element: <FAQ /> },
  { path: "/blog", element: <Blog /> },
  { path: "/blog/:id", element: <BlogDetail /> },
  { path: "/dna-simulator", element: <DNASimulator /> },
  { path: "/legal", element: <Legal /> },

  // Admin Routes
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/admin/bookings", element: <AdminBookings /> },
  { path: "/admin/services", element: <AdminServices /> },
  { path: "/admin/doctors", element: <AdminDoctors /> },
  { path: "/admin/packages", element: <AdminPackages /> },
  { path: "/admin/messages", element: <AdminMessages /> },
  { path: "/admin/cms", element: <AdminCMS /> },
  { path: "/admin/cms/blog", element: <AdminCMSBlog /> },
  { path: "/admin/cms/faq", element: <AdminCMSFAQ /> },
  { path: "/admin/cms/settings", element: <AdminCMSSettings /> },
  { path: "/admin/cms/about", element: <AdminCMSAbout /> },
  { path: "/admin/cms/contact", element: <AdminCMSContact /> },
  { path: "/admin/cms/testimonials", element: <AdminCMSTestimonials /> },
  { path: "/admin/cms/offers", element: <AdminCMSOffers /> },
  { path: "/admin/cms/search", element: <AdminCMSSearch /> },
  { path: "/admin/cms/home", element: <AdminCMSHome /> },
  { path: "/admin/blog", element: <DoctorBlogPage /> },
  { path: "/admin/users", element: <AdminUsers /> },
  { path: "/admin/settings", element: <AdminSettings /> },
  { path: "/admin/reports", element: <AdminReports /> },
  { path: "/admin/dna-simulator", element: <AdminDNASimulator /> },

  { path: "*", element: <NotFound /> },
];

export default routes;
