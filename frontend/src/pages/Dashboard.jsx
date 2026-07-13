import { useEffect, useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarPlus, UserPlus, ClipboardCheck, LogOut, Menu, X } from 'lucide-react';


import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
   const { user, refreshUser, setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        } else {
            refreshUser();
        }
    }, [navigate, refreshUser]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
            setIsAuthenticated(false);
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:relative md:translate-x-0
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6" />
                        LeaveTracker
                    </h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 rounded-md hover:bg-gray-100">
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {/* UPDATED: Checks for both /dashboard and /dashboard/apply */}
                    <Link
                        to="/dashboard"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/dashboard' || location.pathname === '/dashboard/apply'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <CalendarPlus className="h-5 w-5" /> Apply Leave
                    </Link>

                    <Link
                        to="/dashboard/my-leaves"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/dashboard/my-leaves' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <ClipboardCheck className="h-5 w-5" /> My History
                    </Link>

                    {(user.role === 'Manager' || user.role==='Hr') && (
                        <Link
                            to="/dashboard/requests"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/dashboard/requests' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            <ClipboardCheck className="h-5 w-5" /> Leave Requests
                        </Link>
                    )}
                    {/* HR Registration Link */}
                    {user.role === 'Hr' && (
                        <Link
                            to="/dashboard/register-employee"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/dashboard/register-employee'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <UserPlus className="h-5 w-5" /> Register Employee
                        </Link>
                    )}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 rounded-md text-gray-500 hover:bg-gray-100">
                            <Menu className="h-6 w-6" />
                        </button>
                        <h2 className="text-lg font-semibold text-gray-800 truncate">
                            Welcome back, {user.name}
                        </h2>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 sm:px-4 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </header>

                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}