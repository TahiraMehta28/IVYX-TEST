// src/components/AppWrapper.jsx
import React, { useState, useEffect } from 'react';
import App from './auth/auth.jsx'; // Your existing App with auth

const AppWrapper = () => {
  const [currentPage, setCurrentPage] = useState('calculator');
  const [user, setUser] = useState(null);
  const [assessmentHistory, setAssessmentHistory] = useState([]);

  // Load user on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        fetchHistory(userData.id);
      } catch (e) {
        console.error('Error loading user:', e);
      }
    }
  }, []);

  // Fetch history from MongoDB
  const fetchHistory = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/history/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setAssessmentHistory(data.history);
        console.log('✅ Loaded', data.history.length, 'assessments from MongoDB');
      }
    } catch (error) {
      console.error('❌ Error fetching history:', error);
    }
  };

  // Save assessment to MongoDB
  const saveAssessmentToDatabase = async (formData, results) => {
    if (!user) return;

    try {
      const response = await fetch('http://localhost:5000/api/history/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          formData,
          results
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Assessment saved to MongoDB');
        await fetchHistory(user.id);
      }
    } catch (error) {
      console.error('❌ Error saving assessment:', error);
    }
  };

  const deleteAssessment = async (assessmentId) => {
    if (!window.confirm('Delete this assessment?')) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/history/${user.id}/${assessmentId}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      
      if (data.success) {
        await fetchHistory(user.id);
      }
    } catch (error) {
      console.error('❌ Error deleting:', error);
    }
  };

  const clearAllHistory = async () => {
    if (!window.confirm('Delete ALL assessment history? This cannot be undone.')) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/history/${user.id}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      
      if (data.success) {
        setAssessmentHistory([]);
      }
    } catch (error) {
      console.error('❌ Error clearing history:', error);
    }
  };

  // If on calculator page, show your original App
  if (currentPage === 'calculator') {
    return (
      <>
        {user && (
          <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-[60] h-16">
            <div className="flex items-center justify-between px-4 h-full max-w-7xl mx-auto">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-red-900 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    I
                  </div>
                  <h1 className="text-2xl font-bold text-red-900">IvyX.AI</h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage('calculator')}
                    className="px-4 py-2 rounded-lg font-semibold bg-red-900 text-white shadow-md"
                  >
                    Calculator
                  </button>
                  
                  <button
                    onClick={() => setCurrentPage('history')}
                    className="px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-all relative"
                  >
                    History
                    {assessmentHistory.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {assessmentHistory.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setCurrentPage('profile')}
                    className="px-4 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-all"
                  >
                    Profile
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}
        <div style={{ paddingTop: user ? '64px' : '0' }}>
          <App onSaveAssessment={saveAssessmentToDatabase} />
        </div>
      </>
    );
  }

  // History Page
  if (currentPage === 'history') {
    return <HistoryPage history={assessmentHistory} user={user} onDelete={deleteAssessment} onClearAll={clearAllHistory} onBack={() => setCurrentPage('calculator')} />;
  }

  // Profile Page
  if (currentPage === 'profile') {
    return <ProfilePage user={user} assessmentCount={assessmentHistory.length} onBack={() => setCurrentPage('calculator')} />;
  }
};

// History Page Component
const HistoryPage = ({ history, user, onDelete, onClearAll, onBack }) => {
  const [selectedId, setSelectedId] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Assessment History Yet</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Complete your first Ivy Score assessment to start tracking your progress!
            </p>
            <button
              onClick={onBack}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-4 rounded-lg shadow-lg transition-all"
            >
              Take Your First Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-900 mb-2">Assessment History</h1>
            <p className="text-gray-600">Track your progress • {history.length} total assessments</p>
          </div>
          
          <button onClick={onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold">
            ← Back to Calculator
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {history.map((assessment, index) => (
            <div key={assessment.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-red-900 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                      #{history.length - index}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{formatDate(assessment.date)}</h3>
                      <p className="text-sm text-gray-500">
                        Grades: {assessment.formData.grade9 || 'N/A'}, {assessment.formData.grade10 || 'N/A'}, {assessment.formData.grade11 || 'N/A'}, {assessment.formData.grade12 || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Overall Score</p>
                      <p className={`text-3xl font-bold ${getScoreColor(assessment.results.overallScore)}`}>
                        {assessment.results.overallScore}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Academic</p>
                      <p className={`text-3xl font-bold ${getScoreColor(assessment.results.academicScore)}`}>
                        {assessment.results.academicScore}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                      <p className="text-sm text-gray-600 mb-1">Extracurricular</p>
                      <p className={`text-3xl font-bold ${getScoreColor(assessment.results.extracurricularScore)}`}>
                        {assessment.results.extracurricularScore}
                      </p>
                    </div>
                  </div>

                  {selectedId === assessment.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">Summary:</h4>
                      <p className="text-gray-700 mb-4">{assessment.results.summary}</p>
                      
                      <h4 className="font-bold text-gray-800 mb-2">Strengths:</h4>
                      <ul className="list-disc list-inside text-gray-700 mb-4">
                        {assessment.results.strengths?.map((s, i) => <li key={i} className="mb-1">{s}</li>)}
                      </ul>

                      <h4 className="font-bold text-gray-800 mb-2">Improvements:</h4>
                      <ul className="list-disc list-inside text-gray-700">
                        {assessment.results.improvements?.map((imp, i) => <li key={i} className="mb-1">{imp}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button onClick={() => setSelectedId(selectedId === assessment.id ? null : assessment.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button onClick={() => onDelete(assessment.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button onClick={onClearAll} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg shadow-md">
            Clear All History
          </button>
        </div>
      </div>
    </div>
  );
};

// Profile Page Component
const ProfilePage = ({ user, assessmentCount, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-red-900">Your Profile</h1>
          <button onClick={onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold">
            ← Back to Calculator
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-red-900 rounded-full flex items-center justify-center text-white font-bold text-4xl">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{user?.fullName}</h2>
              <p className="text-gray-600 text-lg">{user?.email}</p>
              <p className="text-gray-500">{user?.country}</p>
              <p className="text-gray-500">Grade {user?.grade}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Total Assessments</p>
              <p className="text-4xl font-bold text-blue-700">{assessmentCount}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <p className="text-sm text-gray-600 mb-2">Member Since</p>
              <p className="text-2xl font-bold text-green-700">2025</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <p className="text-sm text-gray-600 mb-2">Account Type</p>
              <p className="text-2xl font-bold text-purple-700">Premium</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">🎓 Your Journey to Excellence</h3>
          <p className="text-lg">Keep tracking your progress and watch your Ivy Score improve with each assessment!</p>
        </div>
      </div>
    </div>
  );
};

export default AppWrapper;