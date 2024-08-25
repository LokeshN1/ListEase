// // src/components/SessionTimeoutModal.js
// import React from 'react';

// const SessionTimeoutModal = ({ show, onClose }) => {
//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-8 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold mb-4">Session Expired</h2>
//         <p className="mb-4">Your session has expired. Please log in again to continue.</p>
//         <button
//           onClick={onClose}
//           className="px-4 py-2 bg-sea-blue text-white rounded-lg shadow-md hover:bg-hover-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hover-blue"
//         >
//           Go to Login
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SessionTimeoutModal;
