import React from "react";
import "../style/Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* Heading */}
        <h1>Contact Us</h1>
        <p className="intro">
          Have questions or suggestions about our Cricket Scoring Website?  
          We’d love to hear from you!
        </p>

        {/* Contact Form */}
        <form className="contact-form">
          <div className="form-group">
            <label>Name</label>
            <input type="text" placeholder="Your name" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea placeholder="Write your message..." rows="4"></textarea>
          </div>

          <button type="submit">Send Message</button>
        </form>

        <hr />

        {/* Contact Info */}
        <div className="contact-info">
          <p><strong>Email:</strong> support@cricketscore.com</p>
          <p><strong>Phone:</strong> +91 98765 43210</p>
          <p><strong>Address:</strong> Wankhede Stadium, Mumbai, India</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
