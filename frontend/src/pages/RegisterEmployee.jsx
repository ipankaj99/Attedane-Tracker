import { useState, useEffect } from 'react';

export default function RegisterEmployee() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isManager, setIsManager] = useState(false);
  const [selectedManager, setSelectedManager] = useState('');
  const [allManagers, setAllManagers] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch managers list
 useEffect(() => {
  const fetchManagers = async () => {
    try {
      const response = await fetch(
        'http://localhost:5071/api/Auth/managers',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();
      console.log(data);

      setAllManagers(data);
    } catch (err) {
      console.error("Error fetching managers:", err);
    }
  };

  fetchManagers();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const payload = {
      ...formData,
      role: isManager ? 'Manager' : 'Employee',
      managerId: isManager ? null  : selectedManager
    };

    try {
      const response = await fetch('http://localhost:5071/api/Auth/registerhr', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMessage('✅ Employee registered successfully!');
        setFormData({ name: '', email: '', password: '' });
        setIsManager(false);
        setSelectedManager('');
      } else {
        const data = await response.json();
        setMessage(`❌ Error: ${data.message || 'Registration failed, may be email format or password length error'}`);
      }
    } catch (err) {
      setMessage('❌ Cannot connect to server.');
    }
  };

  return (
    <div className="max-w-lg bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-6">Register New Employee</h2>
      
      {message && <div className="mb-4 p-3 rounded bg-gray-50 text-sm">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" required className="w-full p-2 border rounded-lg" 
            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" required className="w-full p-2 border rounded-lg" 
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" required className="w-full p-2 border rounded-lg" 
            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
        </div>

        <label className="flex items-center gap-2 py-2">
          <input type="checkbox" checked={isManager} onChange={(e) => setIsManager(e.target.checked)} />
          <span className="text-sm font-medium">Make this user a Manager</span>
        </label>

        <div>
          <label className="block text-sm font-medium mb-1">Assign Manager</label>
          <select 
            disabled={isManager} 
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
            className="w-full p-2 border rounded-lg disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">Select a Manager</option>
            {allManagers.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mt-4">
          Register Employee
        </button>
      </form>
    </div>
  );
}