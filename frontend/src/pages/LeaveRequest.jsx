import { useState, useEffect, useContext } from 'react';

import { CheckCircle, XCircle, Clock, User, Calendar } from 'lucide-react';

import { AuthContext } from '../context/AuthContext';

export default function LeaveRequests() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');
    console.log(token);
    try {
      const response = await fetch('http://localhost:5071/api/Leave/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (err) {
      console.error(err.message);
      console.error("Failed to fetch requests", err);
    }
  };

  const handleReview = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5071/api/Leave/${id}/review`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setMessage(`Request ${status} successfully!`);
        // Refresh list to show accurate status and balance impacts
        fetchRequests(); 
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Failed to process request.');
    }
  };

  if (user?.role === 'Employee' ) {
    return <div className="text-red-500 font-bold text-xl p-8">Access Denied. Managers only.</div>;
  }

  const pendingRequests = requests.filter(req => req.status === 'Pending');
  const historyRequests = requests.filter(req => req.status !== 'Pending');

  return (
    <div className="max-w-5xl space-y-10">
      {message && <div className="p-4 rounded-lg bg-green-50 text-green-700 font-medium">{message}</div>}

      {/* NEW REQUESTS SECTION */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">New Requests</h2>
        {pendingRequests.length === 0 ? (
          <div className="bg-white p-6 text-center rounded-xl border border-gray-200 text-gray-500">
            No new leave requests to review!
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map((req) => (
              <div key={req.id} className="bg-white p-6 rounded-xl border-l-4 border-yellow-400 shadow-sm flex items-center justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full mb-2 flex items-center gap-1 w-max">
                    <Clock className="h-3 w-3" /> Pending
                  </span>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-5 w-5 text-gray-400" />
                    <p className="text-gray-900 font-bold text-lg">{req.employeeName} • {req.leaveType} Leave</p>
                  </div>
                  <div className="flex items-center gap-4 text-gray-600 ml-7">
                    <p className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()}</p>
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-sm">{req.totalDays} Days</span>
                    {req.isHalfDay && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold uppercase">Half Day: {req.session}</span>}
                  </div>
                  <p className="text-gray-500 text-sm mt-2 ml-7 italic">"{req.reason}"</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleReview(req.id, 'Approved')} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <CheckCircle className="h-4 w-4" /> Approve
                  </button>
                  <button onClick={() => handleReview(req.id, 'Rejected')} className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HISTORY SECTION */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">All Requests History</h2>
        {historyRequests.length === 0 ? (
          <div className="bg-white p-6 text-center rounded-xl border border-gray-200 text-gray-500">
            No history available yet.
          </div>
        ) : (
          <div className="grid gap-4 opacity-75">
            {historyRequests.map((req) => (
              <div key={req.id} className={`bg-gray-50 p-4 rounded-xl border-l-4 flex items-center justify-between ${req.status === 'Approved' ? 'border-green-500' : 'border-red-500'}`}>
                <div>
                  <p className="text-gray-900 font-semibold">{req.employeeName} • {req.leaveType} Leave</p>
                  <p className="text-gray-500 text-sm">{new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()} • <span className="font-bold">{req.totalDays} Days</span> {req.isHalfDay && `(${req.session})`}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 text-sm font-bold rounded-full ${req.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}