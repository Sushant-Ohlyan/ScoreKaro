import React from 'react'
import { FaInstagram } from "react-icons/fa"; 
import { FaFacebook } from "react-icons/fa";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { MdOutlineWeb } from "react-icons/md";
import '../style/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-main">
        <p>© 2025 Abhijeet All Rights Reserved.</p>
        <div className="media-icons">
          <a href="#" className="hover:text-gray-200"><i className="fab fa-facebook"><FaFacebook size={30} /></i></a>
          <a href="#" className="hover:text-gray-200"><i className="fab fa-instagram"><FaInstagram size={30} /></i></a>
          <a href="#" className="hover:text-gray-200"><i className="fab fa-twitter"><TwitterIcon /></i></a>
          <a href="#" className="hover:text-gray-200"><i className="fab fa-linkedin"><LinkedInIcon /></i></a>
          <a href="#" className="hover:text-gray-200"><i className="fas fa-globe"><MdOutlineWeb size={30} /></i></a>
        </div>
      </footer>
  )
}

export default Footer