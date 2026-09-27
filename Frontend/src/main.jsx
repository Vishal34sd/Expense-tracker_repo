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
import ChangePassword from './pages/ChangePassword.jsx'
import AskChatbot from './pages/AskChatbot.jsx'
import Profile from './pages/Profile.jsx'
import ExpenseAnalysis from './pages/ExpenseAnalysis.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from './context/ThemeContext.jsx'


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
    path: "/analysis",
    element: <ExpenseAnalysis/>
  },
   {
    path: "/daily-analysis",
    element: <ExpenseAnalysis/>
  },
   {
    path: "/home",
    element: <Home/>
  },
   {
    path: "/profile",
    element: <Profile/>
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
  <ThemeProvider>
    <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
      <RouterProvider router={appRouter} />
    </SnackbarProvider>
  </ThemeProvider>
)
