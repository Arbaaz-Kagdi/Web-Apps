import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import s from './style.module.css';
import { Logo } from '../../components/Logo/Logo.jsx';
// import logoImg from '../../assets/images/icons8-tv-60.png';
import logoGif from "../../assets/images/home-logo.gif";
import sideImage from '../../assets/images/contact_illustration.png';
import { Telephone, Envelope, CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';

const EMAILJS_SERVICE_ID = 'service_2hiv2jp';
const EMAILJS_TEMPLATE_ID = 'template_es1g078';
const EMAILJS_PUBLIC_KEY = 'asktiB2kapg1ioODc';

const INITIAL_FORM = { name: '', email: '', phone: '', subject: '', message: '' };

export function Contact() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'
  const [toast, setToast] = useState(null); // { type: 'success'|'error', text: string }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('error', 'Please fill in Name, Email, and Message.');
      return;
    }

    setStatus('sending');

    // EmailJS sends the form fields as template variables.
    // The keys here must match the variable names in your EmailJS template.
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    };

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
      .then(() => {
        setStatus('success');
        setFormData(INITIAL_FORM);
        showToast('success', 'Message sent! We\'ll get back to you within 3 days. 🎉');
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        setStatus('error');
        showToast('error', 'Something went wrong. Please try again or email us directly.');
      })
      .finally(() => {
        setTimeout(() => setStatus(null), 3000);
      });
  };

  const isSending = status === 'sending';

  return (
    <div className={s.contactPageContainer}>
      {/* Toast Notification — rendered via portal with global classes (never clipped) */}
      {toast && createPortal(
        <div className={`ww-toast ${toast.type === 'success' ? 'ww-toast-success' : 'ww-toast-error'}`}>
          <span className="ww-toast-icon">
            {toast.type === 'success'
              ? <CheckCircleFill />
              : <XCircleFill />}
          </span>
          <span className="ww-toast-text">{toast.text}</span>
          <button className="ww-toast-close" onClick={() => setToast(null)} aria-label="Dismiss">✕</button>
        </div>,
        document.body
      )}

      {/* Header */}
      <header className={s.header}>
        <div className={s.logoContainer}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo
              img={logoGif}
              title="Watowatch"
              subtitle="Find a show you may like"
              color="#1a1a1a"
              subtitleColor="#666"
            />
          </Link>
        </div>
        <nav className={s.nav}>
          <Link to="/" className={s.navLink}>Home</Link>
          <Link to="/contact" className={s.navLinkActive}>Contact</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className={s.mainContent}>
        <div className={s.topSection}>
          <div className={s.textColumn}>
            <div className={s.titleArea}>
              <h1 className={s.title}>Contact Us</h1>
              <p className={s.subtitle}>
                Have a question or feedback? We'd love to hear from you.
                Send us a message and we'll respond within 3 days.
              </p>
            </div>

            {/* Mobile-only illustration — hidden on desktop via CSS */}
            <div className={s.mobileImageColumn}>
              <img src={sideImage} alt="Two people collaborating" />
            </div>

            <form ref={formRef} className={s.contactForm} onSubmit={handleSubmit} noValidate>
              <div className={s.formRow}>
                <div className={s.formGroup}>
                  <label htmlFor="contact-name">Name <span className={s.required}>*</span></label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={s.formGroup}>
                  <label htmlFor="contact-email">Email <span className={s.required}>*</span></label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className={s.formRow}>
                <div className={s.formGroup}>
                  <label htmlFor="contact-phone">Phone Number</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className={s.formGroup}>
                  <label htmlFor="contact-subject">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={s.formGroup}>
                <label htmlFor="contact-message">Message <span className={s.required}>*</span></label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="4"
                  placeholder="Anything else we should know?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className={`${s.submitBtn} ${isSending ? s.submitBtnSending : ''}`}
                disabled={isSending}
              >
                {isSending ? (
                  <>Sending… <span className={s.spinner} /></>
                ) : (
                  <>Send Message <span className={s.btnArrow}>↗</span></>
                )}
              </button>
            </form>
          </div>

          <div className={s.imageColumn}>
            <img src={sideImage} alt="Two people collaborating" className={s.sideImage} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className={s.bottomSection}>
          <div className={s.infoCard}>
            <Telephone className={s.infoIcon} />
            <h3>Call &amp; WhatsApp</h3>
            <p>+91 98929 70833</p>
          </div>
          <div className={s.infoCard}>
            <Envelope className={s.infoIcon} />
            <h3>Write to Us</h3>
            <p>arbaazkagdi@gmail.com</p>
          </div>
        </div>
      </main>
    </div>
  );
}
