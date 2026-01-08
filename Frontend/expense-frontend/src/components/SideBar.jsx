import react from "react" ;
import {Link} from "react-router-dom"

const SideBar = ()=>{
    return(
        <aside className="w-64 bg-purple-900/20 backdrop-blur border-r border-purple-500/20 p-6 hidden sm:block">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">ExpenseTracker</h2>
        <nav className="space-y-4 text-sm text-white/80">
          <Link to="/home" className="block hover:text-white">🏠 Home</Link>
          <Link to="/addTransaction" className="block hover:text-white">📜 See All Transactions</Link>
          <Link  to = "/summary"className="block hover:text-white">📊 View Summary</Link>
          <Link to="/add" className="block hover:text-white">➕ Add New Expense</Link>
          <Link to = "/changePassword"className="block hover:text-white">⚙️ Change Password</Link>
          <Link to="/" className="block hover:text-white" onClick={() => removeToken()}>🚪 Logout</Link>
        </nav>
      </aside>
    )
}

export default SideBar ;