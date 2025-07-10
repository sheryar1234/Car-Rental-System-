import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

const ReportsByCustomer = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
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
        const res = await axios.get('http://localhost:5000/api/reports');
        setReports(res.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
        showNotification('Failed to fetch reports', 'error');
      }
    };
    fetchReports();
  }, []);

  const handleResolve = async (id) => {
    try {
      if (!replyMessage.trim()) {
        showNotification('Please enter a reply message', 'error');
        return;
      }

      await axios.put(`http://localhost:5000/api/reports/${id}`, { 
        status: 'resolved', 
        replyMessage 
      });
      
      setReports(reports.map(report => 
        report._id === id ? { ...report, status: 'resolved', replyMessage } : report
      ));
      
      setSelectedReport(null);
      setReplyMessage('');
      showNotification('Reply sent successfully', 'success');
    } catch (error) {
      console.error('Error resolving report:', error);
      showNotification('Failed to send reply', 'error');
    }
  };

  return (
    <div className="relative">
      <AdminNavbar/>
      
      {/* Notification */}
      <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-out ${
        notification.show ? "translate-y-0" : "-translate-y-full"
      }`}>
        {notification.show && (
          <div className={`mt-4 px-6 py-4 rounded-lg shadow-lg flex items-center ${
            notification.type === "success" 
              ? "bg-green-100 border-green-400 text-green-700" 
              : "bg-red-100 border-red-400 text-red-700"
          } border-l-4`}>
            {notification.type === "success" ? (
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}
      </div>

      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Reports by Customers</h2>
        
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
            <p className="mt-4 text-gray-600">No reports found</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Query</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3">{report.email}</td>
                    <td className="p-3">{report.query}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        report.status === 'pending' 
                          ? 'bg-yellow-200 text-yellow-800' 
                          : 'bg-green-200 text-green-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {report.status === 'pending' ? (
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-gray-500">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Popup for sending reply */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Send Reply to {selectedReport.email}</h3>
              <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                <p className="font-medium text-gray-700">Customer Query:</p>
                <p className="mt-1 text-gray-600">{selectedReport.query}</p>
              </div>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Enter your reply..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedReport(null);
                    setReplyMessage('');
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleResolve(selectedReport._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsByCustomer;