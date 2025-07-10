import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';

const CustomerReport = () => {
  const [query, setQuery] = useState('');
  const [reports, setReports] = useState([]);
  const userEmail = localStorage.getItem('userEmail');
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '', // 'success' or 'error'
    title: ''
  });

  // Function to fetch reports
  const fetchReports = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reports/${userEmail}`);
      setReports(res.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      showNotification('Failed to fetch reports', 'Please try again later', 'error');
    }
  };

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, [userEmail]);

  // Show notification function
  const showNotification = (title, message, type) => {
    setNotification({
      show: true,
      title,
      message,
      type
    });
    
    setTimeout(() => {
      setNotification(prev => ({...prev, show: false}));
    }, 6000);
  };

  // Handle report submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/reports', {
        email: userEmail,
        query,
        status: 'pending',
      });
      showNotification('Success!', 'Report submitted successfully', 'success');
      setQuery('');
      fetchReports(); // Refresh reports after submission
    } catch (error) {
      console.error('Error submitting report:', error);
      showNotification('Error', 'Failed to submit report. Please try again.', 'error');
    }
  };

  return (
    <div className="relative">
      <Navbar/>
      
      {/* Notification */}
      <div className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-500 ease-out ${
        notification.show ? "translate-y-0" : "-translate-y-full"
      }`}>
        {notification.show && (
          <div className={`mt-4 w-full max-w-md mx-4 rounded-lg shadow-xl overflow-hidden ${
            notification.type === "success" 
              ? "bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200" 
              : "bg-gradient-to-r from-rose-50 to-rose-100 border border-rose-200"
          }`}>
            <div className="p-4">
              <div className="flex items-start">
                <div className={`flex-shrink-0 p-2 rounded-full ${
                  notification.type === "success" 
                    ? "bg-emerald-100 text-emerald-600" 
                    : "bg-rose-100 text-rose-600"
                }`}>
                  {notification.type === "success" ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    notification.type === "success" 
                      ? "text-emerald-800" 
                      : "text-rose-800"
                  }`}>
                    {notification.title}
                  </h3>
                  <div className={`mt-1 text-sm ${
                    notification.type === "success" 
                      ? "text-emerald-700" 
                      : "text-rose-700"
                  }`}>
                    <p>{notification.message}</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotification({...notification, show: false})}
                  className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className={`h-1 w-full ${
              notification.type === "success" 
                ? "bg-emerald-400" 
                : "bg-rose-400"
            }`}>
              <div 
                className={`h-full ${
                  notification.type === "success" 
                    ? "bg-emerald-600" 
                    : "bg-rose-600"
                }`}
                style={{
                  animation: 'progress 5s linear forwards',
                  transformOrigin: 'left'
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Report an Issue</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="mb-4">
              <label htmlFor="report" className="block text-sm font-medium text-gray-700 mb-2">
                Describe your issue
              </label>
              <textarea
                id="report"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
                placeholder="Please provide details about the issue you're experiencing..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                rows="5"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
            >
              Submit Report
            </button>
          </form>

          <div className="mt-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Your Reports</h3>
              <button
                onClick={fetchReports}
                className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 -ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Refresh
              </button>
            </div>

            {reports.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
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
                    strokeWidth="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h4 className="mt-4 text-lg font-medium text-gray-900">No reports yet</h4>
                <p className="mt-1 text-gray-500">Submit your first report using the form above</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report._id}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="flex items-center mb-3 md:mb-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-500">
                          Submitted on {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === 'Resolved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4 whitespace-pre-line">{report.query}</p>

                    {report.replyMessage && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-sm font-medium text-gray-600">Admin Response</span>
                        </div>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-line">
                          {report.replyMessage}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add this to your CSS or Tailwind config */}
      <style jsx global>{`
        @keyframes progress {
          0% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};

export default CustomerReport;