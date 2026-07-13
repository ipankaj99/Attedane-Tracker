import { createContext, useState, useEffect , useMemo , useCallback} from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Inside UserContext.jsx
const refreshUser =useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Update this URL to match your AuthController path
    const response = await fetch('http://localhost:5071/api/Auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
        const freshUser = await response.json();
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
    }
}, []);
const value = useMemo(() => ({
    user,
    setUser,
    refreshUser
}), [user, refreshUser]);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    return (
          <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
    );
};