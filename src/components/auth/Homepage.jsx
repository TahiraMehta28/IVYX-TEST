import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Target, DollarSign, Users, BookOpen, Play, Menu, X, ChevronRight, Check, Mail, Phone, MapPin } from 'lucide-react';

export default function IvyXLandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="landing-page">
      <style>{`
        /* CSS Variables for Theme */
        :root {
          --primary-green: #0d5442;
          --secondary-green: #1a6b54;
          --accent-yellow: #fbbf24;
          --dark-green: #083529;
          --light-green: #e8f5f1;
          --text-dark: #1f2937;
          --text-light: #6b7280;
          --white: #ffffff;
          --red-accent: #dc2626;
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: var(--text-dark);
          line-height: 1.6;
          overflow-x: hidden;
        }

        .landing-page {
          width: 100%;
          overflow-x: hidden;
        }

        /* Navigation */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: var(--white);
          transition: var(--transition);
          padding: 1rem 0;
        }

        .navbar.scrolled {
          box-shadow: var(--shadow-md);
          padding: 0.75rem 0;
        }

        .nav-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-green);
          cursor: pointer;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: var(--primary-green);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
        }

        .logo-icon svg {
          width: 24px;
          height: 24px;
        }

        .nav-links {
          display: flex;
          gap: 2.5rem;
          align-items: center;
        }

        .nav-links a {
          color: var(--text-dark);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition);
          position: relative;
          cursor: pointer;
        }

        .nav-links a:hover {
          color: var(--primary-green);
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--primary-green);
          transition: var(--transition);
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        .btn-yellow {
          background: var(--accent-yellow);
          color: var(--text-dark);
          padding: 0.75rem 1.75rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
          font-size: 0.95rem;
        }

        .btn-yellow:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          background: #f59e0b;
        }

        .hamburger {
          display: none;
          background: none;
          border: none;
          color: var(--primary-green);
          cursor: pointer;
          padding: 0.5rem;
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 73px;
          left: 0;
          right: 0;
          background: var(--white);
          box-shadow: var(--shadow-lg);
          padding: 1.5rem;
          flex-direction: column;
          gap: 1.5rem;
          animation: slideDown 0.3s ease-out;
        }

        .mobile-menu.open {
          display: flex;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-menu a {
          color: var(--text-dark);
          text-decoration: none;
          font-weight: 500;
          padding: 0.75rem;
          border-radius: 6px;
          transition: var(--transition);
          cursor: pointer;
        }

        .mobile-menu a:hover {
          background: var(--light-green);
          color: var(--primary-green);
        }

        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--dark-green) 100%);
          color: var(--white);
          padding: 10rem 2rem 6rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.5;
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero h1 {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .hero-subtext {
          font-size: 1.25rem;
          line-height: 1.8;
          margin-bottom: 3rem;
          opacity: 0.95;
          max-width: 750px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 4rem;
        }

        .btn-primary {
          background: var(--accent-yellow);
          color: var(--text-dark);
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-md);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
          background: #f59e0b;
        }

        .btn-secondary {
          background: transparent;
          color: var(--white);
          padding: 1rem 2.5rem;
          border: 2px solid var(--white);
          border-radius: 10px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-secondary:hover {
          background: var(--white);
          color: var(--primary-green);
          transform: translateY(-3px);
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 2rem;
          border-radius: 16px;
          text-align: center;
          transition: var(--transition);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .feature-card .icon {
          width: 48px;
          height: 48px;
          color: var(--accent-yellow);
          margin-bottom: 1.5rem;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .feature-card p {
          opacity: 0.9;
          font-size: 1.05rem;
        }

        /* Section Styling */
        .section {
          padding: 6rem 2rem;
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .section-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header h2 {
          font-size: 2.75rem;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .section-header p {
          font-size: 1.25rem;
          color: var(--text-light);
          max-width: 700px;
          margin: 0 auto;
        }

        /* Challenges Section */
        .challenges {
          background: var(--light-green);
        }

        .challenges-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .challenge-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .challenge-item {
          display: flex;
          gap: 1.5rem;
          padding: 2rem;
          background: var(--white);
          border-radius: 12px;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }

        .challenge-item:hover {
          transform: translateX(8px);
          box-shadow: var(--shadow-md);
        }

        .challenge-icon {
          width: 56px;
          height: 56px;
          min-width: 56px;
          background: #fee2e2;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--red-accent);
        }

        .challenge-item h3 {
          font-size: 1.35rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .challenge-item p {
          color: var(--text-light);
          font-size: 1.05rem;
        }

        .video-placeholder {
          background: var(--white);
          border-radius: 16px;
          padding: 4rem 3rem;
          text-align: center;
          box-shadow: var(--shadow-md);
          position: relative;
          overflow: hidden;
        }

        .video-placeholder::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%);
          opacity: 0.05;
        }

        .play-button {
          width: 80px;
          height: 80px;
          background: var(--accent-yellow);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-md);
        }

        .play-button:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-lg);
        }

        .play-button svg {
          width: 36px;
          height: 36px;
          color: var(--text-dark);
          margin-left: 4px;
        }

        .video-placeholder p {
          font-size: 1.15rem;
          color: var(--text-dark);
          font-weight: 600;
        }

        /* Why Choose Us Section */
        .why-choose {
          background: var(--white);
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2.5rem;
          margin-top: 3rem;
        }

        .benefit-card {
          padding: 2.5rem;
          background: var(--white);
          border: 2px solid var(--light-green);
          border-radius: 12px;
          transition: var(--transition);
        }

        .benefit-card:hover {
          border-color: var(--primary-green);
          box-shadow: var(--shadow-lg);
          transform: translateY(-5px);
        }

        .benefit-icon {
          width: 64px;
          height: 64px;
          background: var(--light-green);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: var(--primary-green);
        }

        .benefit-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .benefit-card p {
          color: var(--text-light);
          font-size: 1.05rem;
          line-height: 1.7;
        }

        .benefit-list {
          list-style: none;
          margin-top: 1rem;
        }

        .benefit-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          color: var(--text-light);
        }

        .benefit-list li svg {
          color: var(--primary-green);
          flex-shrink: 0;
        }

        /* Testimonials Section */
        .testimonials {
          background: var(--light-green);
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2.5rem;
          margin-top: 3rem;
        }

        .testimonial-card {
          background: var(--white);
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          position: relative;
        }

        .testimonial-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
        }

        .testimonial-card::before {
          content: '"';
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          font-size: 5rem;
          color: var(--light-green);
          font-family: Georgia, serif;
          line-height: 1;
        }

        .testimonial-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--white);
        }

        .avatar.green {
          background: var(--primary-green);
        }

        .avatar.red {
          background: var(--red-accent);
        }

        .testimonial-info h4 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.25rem;
        }

        .testimonial-info p {
          color: var(--text-light);
          font-size: 0.95rem;
        }

        .testimonial-text {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--text-dark);
          font-style: italic;
        }

        /* CTA Section */
        .cta {
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--dark-green) 100%);
          color: var(--white);
          padding: 6rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .cta-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .cta h2 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .cta p {
          font-size: 1.35rem;
          margin-bottom: 2.5rem;
          opacity: 0.95;
        }

        .cta-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Footer */
        .footer {
          background: var(--dark-green);
          color: var(--white);
          padding: 4rem 2rem 2rem;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer-brand h3 {
          font-size: 1.75rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .footer-brand p {
          opacity: 0.8;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .footer-section h4 {
          font-size: 1.15rem;
          margin-bottom: 1.25rem;
          font-weight: 700;
        }

        .footer-links {
          list-style: none;
        }

        .footer-links li {
          margin-bottom: 0.75rem;
        }

        .footer-links a {
          color: var(--white);
          text-decoration: none;
          opacity: 0.8;
          transition: var(--transition);
          cursor: pointer;
        }

        .footer-links a:hover {
          opacity: 1;
          padding-left: 5px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          opacity: 0.8;
        }

        .contact-item svg {
          width: 18px;
          height: 18px;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 2rem;
          text-align: center;
          opacity: 0.8;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .challenges-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .hamburger {
            display: block;
          }

          .hero {
            padding: 8rem 1.5rem 4rem;
          }

          .hero h1 {
            font-size: 2.25rem;
          }

          .hero-subtext {
            font-size: 1.1rem;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: stretch;
          }

          .section {
            padding: 4rem 1.5rem;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .section-header p {
            font-size: 1.1rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
          }

          .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .cta h2 {
            font-size: 2rem;
          }

          .cta p {
            font-size: 1.15rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: stretch;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            padding: 0 1rem;
          }

          .logo {
            font-size: 1.25rem;
          }

          .logo-icon {
            width: 36px;
            height: 36px;
          }

          .hero h1 {
            font-size: 1.75rem;
          }

          .btn-primary,
          .btn-secondary {
            padding: 0.875rem 1.75rem;
            font-size: 1rem;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="logo" onClick={() => scrollToSection('home')}>
            <div className="logo-icon">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
              </svg>
            </div>
            <span>IvyX.AI</span>
          </div>
          <div className="nav-links">
            <a onClick={() => scrollToSection('home')}>Home</a>
            <a onClick={() => scrollToSection('features')}>Features</a>
            <a onClick={() => scrollToSection('testimonials')}>Testimonials</a>
            <a onClick={() => scrollToSection('contact')}>Contact Us</a>
          </div>
          <button className="btn-yellow" onClick={handleAuthClick}>Login / Signup</button>
          <button className="hamburger" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <a onClick={() => scrollToSection('home')}>Home</a>
        <a onClick={() => scrollToSection('features')}>Features</a>
        <a onClick={() => scrollToSection('testimonials')}>Testimonials</a>
        <a onClick={() => scrollToSection('contact')}>Contact Us</a>
        <button className="btn-yellow" style={{width: '100%'}} onClick={handleAuthClick}>Login / Signup</button>
      </div>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Your Path to Ivy League Success<br />Starts Here</h1>
          <p className="hero-subtext">
            IvyX is your personalized guide to Ivy League admissions success. With our AI-driven tools, tailored recommendations, and progress tracking, you'll craft an application that stands out in a sea of brilliance.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleGetStarted}>
              Get Started Today <ChevronRight size={20} />
            </button>
            <button className="btn-secondary" onClick={handleGetStarted}>
              Book a Coach
            </button>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <TrendingUp className="icon" />
              <h3>Ivy Score™</h3>
              <p>Track your admission readiness with precision.</p>
            </div>
            <div className="feature-card">
              <Target className="icon" />
              <h3>Goal Setting</h3>
              <p>Create and achieve your dreams systematically.</p>
            </div>
            <div className="feature-card">
              <DollarSign className="icon" />
              <h3>Scholarship Tracker</h3>
              <p>Never miss an opportunity for financial aid.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section id="features" className="section challenges">
        <div className="section-container">
          <div className="section-header">
            <h2>The Challenges Between You and Ivy League Success</h2>
            <p>Challenges Meritorious Students Face</p>
          </div>
          <div className="challenges-content">
            <div className="challenge-list">
              <div className="challenge-item">
                <div className="challenge-icon">
                  <Users size={28} />
                </div>
                <div>
                  <h3>Fierce Competition</h3>
                  <p>With acceptance rates under 5%, standing out is tough.</p>
                </div>
              </div>

              <div className="challenge-item">
                <div className="challenge-icon">
                  <DollarSign size={28} />
                </div>
                <div>
                  <h3>Lack of Resources</h3>
                  <p>High-cost counselors create inequities.</p>
                </div>
              </div>

              <div className="challenge-item">
                <div className="challenge-icon">
                  <BookOpen size={28} />
                </div>
                <div>
                  <h3>Overwhelming Options</h3>
                  <p>Too many decisions, too little clarity.</p>
                </div>
              </div>
            </div>

            <div className="video-placeholder">
              <div className="play-button">
                <Play />
              </div>
              <p>Watch how IvyX has helped students like you!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section why-choose">
        <div className="section-container">
          <div className="section-header">
            <h2>Why Choose IvyX.AI</h2>
            <p>Empowering students with the tools and guidance they need to succeed</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <Target size={32} />
              </div>
              <h3>Personalized Guidance</h3>
              <p>Our AI-powered platform adapts to your unique strengths, goals, and timeline.</p>
              <ul className="benefit-list">
                <li><Check size={20} /> Custom roadmap creation</li>
                <li><Check size={20} /> Real-time progress tracking</li>
                <li><Check size={20} /> Adaptive recommendations</li>
              </ul>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Data-Driven Insights</h3>
              <p>Make informed decisions with comprehensive analytics and predictive modeling.</p>
              <ul className="benefit-list">
                <li><Check size={20} /> Ivy Score™ assessment</li>
                <li><Check size={20} /> Competitive benchmarking</li>
                <li><Check size={20} /> Success probability metrics</li>
              </ul>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Users size={32} />
              </div>
              <h3>Expert Support</h3>
              <p>Connect with experienced coaches who understand the Ivy League admissions process.</p>
              <ul className="benefit-list">
                <li><Check size={20} /> 1-on-1 coaching sessions</li>
                <li><Check size={20} /> Essay review & feedback</li>
                <li><Check size={20} /> Interview preparation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section testimonials">
        <div className="section-container">
          <div className="section-header">
            <h2>What Students Say</h2>
            <p>Hear from students who achieved their Ivy League dreams with IvyX</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar green">AG</div>
                <div className="testimonial-info">
                  <h4>Ananya Gupta</h4>
                  <p>Class of 2025</p>
                </div>
              </div>
              <p className="testimonial-text">
                IvyX helped me land my dream school with ease! The personalized roadmap and AI-driven insights were game-changers in my application process.
              </p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar red">RS</div>
                <div className="testimonial-info">
                  <h4>Rahul Sharma</h4>
                  <p>Class of 2024</p>
                </div>
              </div>
              <p className="testimonial-text">
                The AI feedback was incredibly valuable for my essays! I was able to refine my narrative and present my best self to admissions committees.
              </p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar green">PM</div>
                <div className="testimonial-info">
                  <h4>Priya Mehta</h4>
                  <p>Class of 2026</p>
                </div>
              </div>
              <p className="testimonial-text">
                IvyX made the overwhelming process actually manageable! The scholarship tracker alone saved me thousands of dollars in potential aid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of students achieving their Ivy League dreams</p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={handleGetStarted}>
              Get Started Today <ChevronRight size={20} />
            </button>
            <button className="btn-secondary" onClick={handleGetStarted}>
              Book a Coach
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>IvyX.AI</h3>
              <p>
                Empowering students worldwide to achieve their Ivy League dreams through innovative AI-driven tools and personalized guidance.
              </p>
              <div className="contact-item">
                <Mail size={18} />
                <span>support@ivyx.ai</span>
              </div>
              <div className="contact-item">
                <Phone size={18} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <MapPin size={18} />
                <span>San Francisco, CA</span>
              </div>
            </div>

            <div className="footer-section">
              <h4>Platform</h4>
              <ul className="footer-links">
                <li><a onClick={() => scrollToSection('features')}>Features</a></li>
                <li><a>Ivy Score™</a></li>
                <li><a>Goal Tracker</a></li>
                <li><a>Scholarships</a></li>
                <li><a>Pricing</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Resources</h4>
              <ul className="footer-links">
                <li><a>Blog</a></li>
                <li><a>Success Stories</a></li>
                <li><a>Guides</a></li>
                <li><a>FAQ</a></li>
                <li><a>Support</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><a>About Us</a></li>
                <li><a>Careers</a></li>
                <li><a>Press</a></li>
                <li><a>Privacy Policy</a></li>
                <li><a>Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 IvyX.AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}