import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MyLeaves() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchMyLeaves = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5071/api/Leave/my-leaves', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setLeaves(data);
        }
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };
    fetchMyLeaves();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Leave History</h2>
      
      {leaves.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500 text-lg">You haven't applied for any leaves yet.</p>
          <Link to="/dashboard" className="text-blue-600 font-semibold hover:underline mt-2 inline-block">
            Apply for your first leave here
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Reviewed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaves.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {l.leaveType}
                    {l.isHalfDay && (
                      <div className="text-[10px] uppercase font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded w-max mt-1">
                        Half Day ({l.session})
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {l.totalDays} Days
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    <div>{new Date(l.startDate).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-400">to {new Date(l.endDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      l.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                      l.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {l.status !== 'Pending' && l.approver ? (
                      <span className="font-medium text-gray-900">{l.approver.name}</span>
                    ) : (
                      <span className="text-gray-400 italic text-xs">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}