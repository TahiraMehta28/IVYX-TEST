import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle, ArrowLeft } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function CoachBooking() {
  const navigate = useNavigate();
  const [bookingStep, setBookingStep] = useState('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: '',
    preferredDate: '',
    preferredTime: '',
    additionalNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const purposeOptions = [
    { value: 'essay-review', label: 'Essay Review & Feedback', icon: '📝' },
    { value: 'college-selection', label: 'College Selection Strategy', icon: '🎓' },
    { value: 'interview-prep', label: 'Interview Preparation', icon: '💼' },
    { value: 'extracurricular', label: 'Extracurricular Planning', icon: '🏆' },
    { value: 'test-strategy', label: 'Test Strategy (SAT/ACT)', icon: '📊' },
    { value: 'scholarship', label: 'Scholarship Application', icon: '💰' },
    { value: 'general', label: 'General Guidance', icon: '🗺️' },
    { value: 'other', label: 'Other', icon: '💡' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
  if (!formData.name || !formData.email || !formData.phone || !formData.purpose || !formData.preferredDate || !formData.preferredTime) {
    alert('Please fill all required fields');
    return;
  }

  setIsSubmitting(true);

  try {
    const purposeLabel = purposeOptions.find(opt => opt.value === formData.purpose)?.label || formData.purpose;

    console.log('📤 API URL:', process.env.REACT_APP_API_URL);

    // 1. Save to MongoDB backend
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const backendResponse = await fetch(`${apiUrl}api/book-coach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const responseData = await backendResponse.json();
    console.log('📦 Response:', responseData);

    if (!backendResponse.ok) {
      throw new Error(responseData.message || 'Failed to save booking');
    }

    console.log('✅ Booking saved to database');

    // 2. Try sending emails (will fail gracefully if not configured)
    try {
      if (process.env.REACT_APP_EMAILJS_SERVICE_ID) {
        const userEmailParams = {
          to_email: formData.email,
          to_name: formData.name,
          user_name: formData.name,
          user_email: formData.email,
          user_phone: formData.phone,
          purpose: purposeLabel,
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime,
          additional_notes: formData.additionalNotes || 'None'
        };

        await emailjs.send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_USER_TEMPLATE_ID,
          userEmailParams,
          process.env.REACT_APP_EMAILJS_PUBLIC_KEY
        );

        const adminEmailParams = {
          to_email: process.env.REACT_APP_ADMIN_EMAIL || 'admin@ivyx.ai',
          user_name: formData.name,
          user_email: formData.email,
          user_phone: formData.phone,
          purpose: purposeLabel,
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime,
          additional_notes: formData.additionalNotes || 'None',
          booking_time: new Date().toLocaleString()
        };

        await emailjs.send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_ADMIN_TEMPLATE_ID,
          adminEmailParams,
          process.env.REACT_APP_EMAILJS_PUBLIC_KEY
        );

        console.log('✅ Emails sent');
      } else {
        console.log('⚠️ EmailJS not configured, skipping emails');
      }
    } catch (emailError) {
      console.warn('⚠️ Email failed (booking still saved):', emailError);
    }

    setBookingStep('success');

  } catch (error) {
    console.error('❌ Booking error:', error);
    alert('Failed to submit booking. Please try again. Error: ' + error.message);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d5442 0%, #083529 100%)', padding: '2rem' }}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .booking-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .back-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          margin-bottom: 2rem;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(-4px);
        }

        .booking-card {
          background: white;
          border-radius: 16px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .card-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .card-header h1 {
          font-size: 2.5rem;
          color: #0d5442;
          margin-bottom: 0.5rem;
          font-weight: 800;
        }

        .card-header p {
          color: #6b7280;
          font-size: 1.1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #1f2937;
          font-size: 0.95rem;
        }

        .form-label.required::after {
          content: ' *';
          color: #dc2626;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: #0d5442;
          box-shadow: 0 0 0 3px rgba(13, 84, 66, 0.1);
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        textarea.form-input {
          resize: vertical;
          min-height: 100px;
        }

        .purpose-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 0.75rem;
        }

        .purpose-option {
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .purpose-option:hover {
          border-color: #0d5442;
          background: #f0fdf4;
        }

        .purpose-option.selected {
          border-color: #0d5442;
          background: #e8f5f1;
        }

        .purpose-icon {
          font-size: 1.5rem;
        }

        .purpose-label {
          font-size: 0.95rem;
          font-weight: 500;
          color: #1f2937;
        }

        .date-time-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .submit-button {
          width: 100%;
          padding: 1rem 2rem;
          background: #fbbf24;
          color: #1f2937;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-button:hover {
          background: #f59e0b;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(251, 191, 36, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .success-container {
          text-align: center;
          padding: 2rem 0;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          animation: scaleIn 0.5s ease-out;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .success-icon svg {
          width: 48px;
          height: 48px;
          color: white;
        }

        .success-title {
          font-size: 2rem;
          color: #0d5442;
          margin-bottom: 1rem;
          font-weight: 800;
        }

        .success-message {
          color: #6b7280;
          font-size: 1.1rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .booking-details {
          background: #f9fafb;
          border-radius: 12px;
          padding: 1.5rem;
          margin: 2rem 0;
          text-align: left;
        }

        .booking-details h3 {
          color: #0d5442;
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row svg {
          color: #0d5442;
          flex-shrink: 0;
        }

        .detail-label {
          font-weight: 600;
          color: #4b5563;
          min-width: 120px;
        }

        .detail-value {
          color: #1f2937;
        }

        .home-button {
          background: #0d5442;
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .home-button:hover {
          background: #083529;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .booking-card {
            padding: 2rem 1.5rem;
          }

          .card-header h1 {
            font-size: 1.75rem;
          }

          .purpose-grid {
            grid-template-columns: 1fr;
          }

          .date-time-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="booking-container">
        {bookingStep === 'form' ? (
          <>
            <button className="back-button" onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
              Back to Home
            </button>

            <div className="booking-card">
              <div className="card-header">
                <h1>Book a Coach</h1>
                <p>Schedule a personalized coaching session to accelerate your journey</p>
              </div>

              <div>
                <div className="form-group">
                  <label className="form-label required">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">What do you need help with?</label>
                  <div className="purpose-grid">
                    {purposeOptions.map(option => (
                      <div
                        key={option.value}
                        className={`purpose-option ${formData.purpose === option.value ? 'selected' : ''}`}
                        onClick={() => handleInputChange({ target: { name: 'purpose', value: option.value }})}
                      >
                        <span className="purpose-icon">{option.icon}</span>
                        <span className="purpose-label">{option.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="date-time-row">
                  <div className="form-group">
                    <label className="form-label required">Preferred Date</label>
                    <input
                      type="date"
                      name="preferredDate"
                      className="form-input"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Preferred Time</label>
                    <input
                      type="time"
                      name="preferredTime"
                      className="form-input"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Notes</label>
                  <textarea
                    name="additionalNotes"
                    className="form-input"
                    placeholder="Share any specific topics or questions you'd like to discuss..."
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                  />
                </div>

                <button 
                  onClick={handleSubmit} 
                  className="submit-button" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                  {!isSubmitting && <Calendar size={20} />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="booking-card">
            <div className="success-container">
              <div className="success-icon">
                <CheckCircle size={48} />
              </div>
              <h1 className="success-title">Booking Confirmed!</h1>
              <p className="success-message">
                Thank you for booking a coaching session with IvyX.AI! We've sent a confirmation email to <strong>{formData.email}</strong> with all the details.
              </p>

              <div className="booking-details">
                <h3>Your Booking Details</h3>
                <div className="detail-row">
                  <User size={20} />
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{formData.name}</span>
                </div>
                <div className="detail-row">
                  <MessageSquare size={20} />
                  <span className="detail-label">Purpose:</span>
                  <span className="detail-value">
                    {purposeOptions.find(opt => opt.value === formData.purpose)?.label}
                  </span>
                </div>
                <div className="detail-row">
                  <Calendar size={20} />
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{formData.preferredDate}</span>
                </div>
                <div className="detail-row">
                  <Clock size={20} />
                  <span className="detail-label">Time:</span>
                  <span className="detail-value">{formData.preferredTime}</span>
                </div>
                <div className="detail-row">
                  <Mail size={20} />
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{formData.email}</span>
                </div>
                <div className="detail-row">
                  <Phone size={20} />
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{formData.phone}</span>
                </div>
              </div>

              <p className="success-message">
                Our team will reach out to you within 24 hours to confirm the appointment and provide joining instructions.
              </p>

              <button className="home-button" onClick={() => navigate('/')}>
                Return to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}