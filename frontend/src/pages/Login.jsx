import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const { setUser } = useContext(AuthContext)

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Make sure this port matches your backend Swagger port (e.g., 5071)
      const response = await fetch('http://localhost:5071/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token and user data to localStorage
        console.log(data.token);
        localStorage.setItem('token', data.token);
        console.log("data is ",data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user); // Update UserContext immediately

       setIsAuthenticated(true);
        navigate('/dashboard'); // Go to dashboard on success
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to server. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Welcome Back</h2>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input 
                type="password" 
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}