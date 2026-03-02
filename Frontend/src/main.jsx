import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import Dashboard from './pages/userDashBoard.jsx'
import ExpenseAdd from './pages/ExpenseAdd.jsx'
import AllTransaction from './pages/AllTransaction.jsx'
import ViewSummary from './pages/SummaryPage.jsx'
import Home from './pages/Home.jsx'
import OTP_Page from './pages/OTP_Page.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import AskChatbot from './pages/AskChatbot.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { SnackbarProvider } from "notistack";


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
   {
    path: "/register",
    element: <SignUp />
  },
   {
    path: "/login",
    element: <SignIn />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
   {
    path: "/add",
    element: <ExpenseAdd/>
  },
   {
    path: "/addTransaction",
    element: <AllTransaction/>
  },
   {
    path: "/summary",
    element: <ViewSummary/>
  },
   {
    path: "/home",
    element: <Home/>
  },
  {
    path: "/otp-verify",
    element: <OTP_Page/>
  },
   {
    path: "/changePassword",
    element: <ChangePassword/>
  },
  {
    path: "/ask-chatbot",
    element: <AskChatbot/>
  },
  {
    path: "*",
    element: <NotFoundPage/>
  },

]);

createRoot(document.getElementById('root')).render(
  <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
  <RouterProvider router={appRouter} />
  </SnackbarProvider>
)
