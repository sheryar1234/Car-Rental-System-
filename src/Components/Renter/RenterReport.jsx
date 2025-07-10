import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RenterNavbar from './RenterNavbar';

const RenterReport = () => {
  const [query, setQuery] = useState('');
  const [reports, setReports] = useState([]);
  const userEmail = localStorage.getItem('userEmail');
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '' // 'success' or 'error'
  });

  // Show notification function
  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
    
    setTimeout(() => {
      setNotification(prev => ({...prev, show: false}));
    }, 5000);
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/renter/reports/${userEmail}`);
        setReports(res.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
        showNotification('Failed to fetch reports', 'error');
      }
    };
    fetchReports();
  }, [userEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/renter/reports', {
        email: userEmail,
        query,
        status: 'pending'
      });
      showNotification('Report submitted successfully', 'success');
      setQuery('');
      // Refresh reports after submission
      const res = await axios.get(`http://localhost:5000/api/renter/reports/${userEmail}`);
      setReports(res.data);
    } catch (error) {
      console.error('Error submitting report:', error);
      showNotification('Failed to submit report', 'error');
    }
  };

  return (
    <div className="relative">
      <RenterNavbar/>
      
      {/* Notification */}
      <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-out ${
        notification.show ? "translate-y-0" : "-translate-y-full"
      }`}>
        {notification.show && (
          <div className={`mt-4 px-6 py-4 rounded-lg shadow-lg flex items-center ${
            notification.type === "success" 
              ? "bg-emerald-100 border-emerald-400 text-emerald-800" 
              : "bg-rose-100 border-rose-400 text-rose-800"
          } border-l-4`}>
            {notification.type === "success" ? (
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}
      </div>

      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Report an Issue</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              placeholder="Describe your issue here..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
            />
            <button
              type="submit"
              className="mt-4 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Submit
            </button>
          </form>

          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Your Reports</h3>
            {reports.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-4 text-gray-600">No reports submitted yet</p>
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report._id}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow-lg mb-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-gray-700">
                      <span className="font-semibold text-gray-600">Query:</span> {report.query}
                    </p>
                  </div>

                  <div className="flex items-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-gray-700">
                      <span className="font-semibold text-gray-600">Status:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          report.status === "Resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {report.status}
                      </span>
                    </p>
                  </div>

                  {report.replyMessage && (
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                      </svg>
                      <p className="text-gray-700">
                        <span className="font-semibold text-gray-600">Admin Reply:</span>{" "}
                        {report.replyMessage}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenterReport;