import { createBrowserRouter, Outlet } from 'react-router-dom';
import HomePage from '../pages/Homepage';
import LoginPage from '../pages/Login';
import NotFound from '../pages/Notfound';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import SignUp from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import VerifyEmail from '@/pages/VerifyEmail';
import CreateProperty from '@/pages/create-property/CreateProperty';
import PropertyList from '@/pages/list-property/ListProperty';
import ListUserProperty from '@/pages/list-property/ListUserProperty';
import Dashboard from '@/pages/dashboard/Dashboard';
import EditPropertyPage from '@/pages/EditProperty';
import PropertyDetailPage from '@/pages/PropertyDetail';
import LayoutSwitcher from '@/layouts/LayoutSwitcher';
import Profile from '@/pages/profile/Profile';
import EditProfile from '@/pages/profile/EditProfile';
import Subscription from '@/pages/subscription/Subscription';
import { MainLayoutRoute } from '@/components/MainLayoutRoute';
import NeighbourhoodDetails from '@/pages/neighbourhood/NeighbourhoodGuideDetails';
import NeighbourhoodHub from '@/pages/neighbourhood/NeighbourhoodHub';
import ArticlesPage from '@/pages/articles/ArticlesPage';
import ArticleDetailPage from '@/pages/articles/ArticleDetailPage';
import AdminLayout from '@/layouts/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProperties from '@/pages/admin/AdminProperties';
import AdminTransactions from '@/pages/admin/AdminTransactions';
import AdminPackages from '@/pages/admin/AdminPackages';
import AdminLeads from '@/pages/admin/AdminLeads';
import AdminListingReports from '@/pages/admin/AdminListingReports';
import AdminListingReviews from '@/pages/admin/AdminListingReviews';
import AdminPayments from '@/pages/admin/AdminPayments';
import AdminMedia from '@/pages/admin/AdminMedia';
import AdminReports from '@/pages/admin/AdminReports';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminPromotions from '@/pages/admin/AdminPromotions';
import AdminPages from '@/pages/admin/AdminPages';
import AdminArticles from '@/pages/admin/AdminArticles';
import AdminHelp from '@/pages/admin/AdminHelp';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminAgents from '@/pages/admin/AdminAgents';
import AdminDevelopers from '@/pages/admin/AdminDevelopers';
import RequestProperty from '@/pages/RequestProperty';
import RequestsBrowse from '@/pages/requests/RequestsBrowse';
import RequestDetail from '@/pages/requests/RequestDetail';
import MyRequests from '@/pages/requests/MyRequests';
import SellProperty from '@/pages/SellProperty';
import AgentProfile from '@/pages/AgentProfile';
import Messages from '@/pages/Messages';
import AdminBookings from '@/pages/admin/AdminBookings';
import SeoLocationListings from '@/pages/list-property/SeoLocationListings';
import CmsPage from '@/pages/CmsPage';
import SoldPropertiesPage from '@/pages/SoldPropertiesPage';
import ScrollToTop from '@/components/ScrollToTop';
import WorkspaceLayout from '@/layouts/WorkspaceLayout';
import BuyerLayout from '@/layouts/BuyerLayout';
import {
  WorkspaceHome,
  WorkspacePostProperty,
  WorkspaceListings,
  WorkspaceBuyerRequests,
  WorkspaceMessages,
  WorkspaceLeads,
  WorkspaceBookings,
  WorkspaceDeals,
  WorkspaceReports,
  WorkspacePackages,
  WorkspaceSubscription,
  WorkspaceBilling,
  WorkspaceProfile,
  WorkspaceNotifications,
  WorkspaceSettings,
  WorkspaceHelp,
  WorkspaceKyc,
} from '@/pages/workspace';
import {
  BuyerHome,
  BuyerProperties,
  BuyerSaved,
  BuyerAlerts,
  BuyerMessages,
  BuyerInquiries,
  BuyerAppointments,
  BuyerReviews,
  BuyerPayments,
  BuyerSettings,
  BuyerSecurity,
} from '@/pages/buyer';
import { WORKSPACE_ROLES } from '@/lib/workspace';

/** Root shell so every route (marketplace, auth, admin) resets scroll on navigation. */
function AppRoot() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <AppRoot />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUp /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '/verify-email', element: <VerifyEmail /> },
      {
        path: '/admin',
        element: (
          <ProtectedRoute requireRole="admin" fallback={<div>Loading…</div>}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'properties', element: <AdminProperties /> },
          { path: 'transactions', element: <AdminTransactions /> },
          { path: 'packages', element: <AdminPackages /> },
          { path: 'leads', element: <AdminLeads /> },
          { path: 'listing-reports', element: <AdminListingReports /> },
          { path: 'listing-reviews', element: <AdminListingReviews /> },
          { path: 'bookings', element: <AdminBookings /> },
          { path: 'payments', element: <AdminPayments /> },
          { path: 'media', element: <AdminMedia /> },
          { path: 'reports', element: <AdminReports /> },
          { path: 'settings', element: <AdminSettings /> },
          { path: 'promotions', element: <AdminPromotions /> },
          { path: 'pages', element: <AdminPages /> },
          { path: 'articles', element: <AdminArticles /> },
          { path: 'help', element: <AdminHelp /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'agents', element: <AdminAgents /> },
          { path: 'developers', element: <AdminDevelopers /> },
        ],
      },
      {
        path: '/workspace',
        element: (
          <ProtectedRoute requireRole={[...WORKSPACE_ROLES]} fallback={<div>Loading…</div>}>
            <WorkspaceLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <WorkspaceHome /> },
          { path: 'post-property', element: <WorkspacePostProperty /> },
          { path: 'listings', element: <WorkspaceListings /> },
          { path: 'buyer-requests', element: <WorkspaceBuyerRequests /> },
          { path: 'messages', element: <WorkspaceMessages /> },
          { path: 'leads', element: <WorkspaceLeads /> },
          { path: 'bookings', element: <WorkspaceBookings /> },
          { path: 'deals', element: <WorkspaceDeals /> },
          { path: 'reports', element: <WorkspaceReports /> },
          { path: 'packages', element: <WorkspacePackages /> },
          { path: 'subscription', element: <WorkspaceSubscription /> },
          { path: 'billing', element: <WorkspaceBilling /> },
          { path: 'profile', element: <WorkspaceProfile /> },
          { path: 'notifications', element: <WorkspaceNotifications /> },
          { path: 'settings', element: <WorkspaceSettings /> },
          { path: 'help', element: <WorkspaceHelp /> },
          { path: 'kyc', element: <WorkspaceKyc /> },
        ],
      },
      {
        path: '/buyer',
        element: (
          <ProtectedRoute requireRole={['user', 'buyer', 'tenant']} fallback={<div>Loading…</div>}>
            <BuyerLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <BuyerHome /> },
          { path: 'properties', element: <BuyerProperties /> },
          { path: 'saved', element: <BuyerSaved /> },
          { path: 'alerts', element: <BuyerAlerts /> },
          { path: 'messages', element: <BuyerMessages /> },
          { path: 'inquiries', element: <BuyerInquiries /> },
          { path: 'appointments', element: <BuyerAppointments /> },
          { path: 'reviews', element: <BuyerReviews /> },
          { path: 'payments', element: <BuyerPayments /> },
          { path: 'settings', element: <BuyerSettings /> },
          { path: 'security', element: <BuyerSecurity /> },
        ],
      },
      {
        element: <LayoutSwitcher />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/about', element: <CmsPage /> },
          { path: '/careers', element: <CmsPage /> },
          { path: '/contact', element: <CmsPage /> },
          { path: '/help', element: <CmsPage /> },
          { path: '/terms', element: <CmsPage /> },
          { path: '/privacy', element: <CmsPage /> },
          { path: '/cookies', element: <CmsPage /> },
          { path: '/pages/:slug', element: <CmsPage /> },
          { path: '/request-property', element: <RequestProperty /> },
          { path: '/requests', element: <RequestsBrowse /> },
          { path: '/requests/:id', element: <RequestDetail /> },
          {
            path: '/dashboard/requests',
            element: (
              <ProtectedRoute fallback={<div>Loading…</div>}>
                <MyRequests />
              </ProtectedRoute>
            ),
          },
          { path: '/sell', element: <SellProperty /> },
          { path: '/neighbourhood', element: <NeighbourhoodHub /> },
          { path: '/neighbourhood/:slug', element: <NeighbourhoodDetails /> },
          { path: '/neighbourhood/:slug/:areaSlug', element: <NeighbourhoodDetails /> },
          { path: '/articles', element: <ArticlesPage /> },
          { path: '/articles/:slug', element: <ArticleDetailPage /> },
          { path: '/sold-properties', element: <SoldPropertiesPage /> },
          {
            path: '/dashboard',
            element: (
              <ProtectedRoute fallback={<div>Loading…</div>}>
                <MainLayoutRoute>
                  <Dashboard />
                </MainLayoutRoute>
              </ProtectedRoute>
            ),
          },
          {
            path: '/create-property',
            element: (
              <ProtectedRoute fallback={<div>Loading…</div>}>
                <MainLayoutRoute>
                  <CreateProperty />
                </MainLayoutRoute>
              </ProtectedRoute>
            ),
          },
          { path: '/properties', element: <PropertyList /> },
          { path: '/for-sale/in/:state/:area?', element: <SeoLocationListings kind="for-sale" /> },
          { path: '/for-rent/in/:state/:area?', element: <SeoLocationListings kind="for-rent" /> },
          { path: '/shortlet/in/:state/:area?', element: <SeoLocationListings kind="shortlet" /> },
          { path: '/land/in/:state/:area?', element: <SeoLocationListings kind="land" /> },
          {
            path: '/my-listing',
            element: (
              <ProtectedRoute fallback={<div>Loading…</div>}>
                <MainLayoutRoute>
                  <ListUserProperty />
                </MainLayoutRoute>
              </ProtectedRoute>
            ),
          },
          {
            path: '/subscription',
            element: (
              <ProtectedRoute fallback={<div>Loading…</div>}>
                <MainLayoutRoute>
                  <Subscription />
                </MainLayoutRoute>
              </ProtectedRoute>
            ),
          },
          {
            path: '/profile/',
            element: (
              <ProtectedRoute fallback={<div>Loading…</div>}>
                <Profile />
              </ProtectedRoute>
            ),
          },
          {
            path: '/edit-profile/',
            element: (
              <ProtectedRoute fallback={<div>Loading…</div>}>
                <EditProfile />
              </ProtectedRoute>
            ),
          },
          { path: '/properties/:propertyId', element: <PropertyDetailPage /> },
          {
            path: '/properties/:propertyId/edit',
            element: (
              <ProtectedRoute fallback={<div>Loading…</div>}>
                <MainLayoutRoute>
                  <EditPropertyPage />
                </MainLayoutRoute>
              </ProtectedRoute>
            ),
          },
          { path: '/agents/:agentId', element: <AgentProfile /> },
          { path: '/messages', element: <Messages /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
]);
