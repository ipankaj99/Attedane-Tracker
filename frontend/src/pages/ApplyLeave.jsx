import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
export default function ApplyLeave() {
  const [leaveType, setLeaveType] = useState('Sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const { refreshUser, user } = useContext(AuthContext);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [session, setSession] = useState('Morning');


  const [applied, setApplied] = useState(false);

  if (!user) return <div>Loading...</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApplied(true);
    setMessage('');

    // 1. Calculate Total Days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time to midnight for accurate comparison

    // 1. Validate: Start date cannot be in the past
    if (start < today) {
        setMessage('❌ Start date cannot be in the past.');
        setApplied(false); // Re-enable button
        return;
    }

    // 2. Validate: End date cannot be before start date
    if (end < start) {
        setMessage('❌ End date cannot be before the start date.');
        setApplied(false); // Re-enable button
        return;
    }

    // Calculate difference in days (adding 1 for inclusive range)
    let calculatedDays = (end - start) / (1000 * 60 * 60 * 24) + 1;

    // 2. Apply half-day deduction if checked
    if (isHalfDay) {
      calculatedDays -= 0.5;
    }

    const token = localStorage.getItem('token');

    // 3. Prepare payload matching your updated DTO
    const payload = {
      leaveType,
      startDate,
      endDate,
      reason,
      isHalfDay,
      session: isHalfDay ? session : "",
      totalDays: calculatedDays // Send the calculated value to the backend
    };

    try {
      const response = await fetch('http://localhost:5071/api/Leave/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Leave request submitted successfully!');
        await refreshUser();
        // Reset state
        setStartDate('');
        setEndDate('');
        setReason('');

        setIsHalfDay(false);
      } else {
        setMessage(`❌ Error: ${data.message || 'Failed to apply'}`);
      }
    } catch (err) {

      setMessage('❌ Cannot connect to server.');
    }
    finally {
      setApplied(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Leave Balance Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500">Sick Leave</p>
          <p className="text-4xl font-bold text-gray-900">{user.sickLeave} <span className="text-sm font-normal text-gray-500"> left</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500">Casual Leave</p>
          <p className="text-4xl font-bold text-gray-900">{user.casualLeave} <span className="text-sm font-normal text-gray-500">left</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500">Earned Leave</p>
          <p className="text-4xl font-bold text-gray-900">{user.earnedLeave} <span className="text-sm font-normal text-gray-500">left</span></p>
        </div>
      </div>
      <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Apply for Leave</h2>

        {message && <div className="mb-6 p-4 rounded-lg bg-gray-50 font-medium text-gray-700">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Sick">Sick Leave</option>
              <option value="Casual">Casual Leave</option>
              <option value="Earned">Earned Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date" required
                value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date" required
                value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <textarea
              required rows="3"
              value={reason} onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Brief reason for your leave..."
            />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isHalfDay} onChange={(e) => setIsHalfDay(e.target.checked)} />
              <span className="text-sm font-medium text-gray-700">Apply for Half Day</span>
            </label>

            {isHalfDay && (
              <select value={session} onChange={(e) => setSession(e.target.value)} className="text-sm border rounded-lg p-1">
                <option value="Morning">Morning Session</option>
                <option value="Evening">Evening Session</option>
              </select>
            )}
          </div>

          <button
            type="submit"
            disabled={applied}
            className={`w-full py-2.5 rounded-lg font-semibold transition-colors ${applied ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
          >
            {applied ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}