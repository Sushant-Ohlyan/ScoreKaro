import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white text-center p-4 mt-4">
        <p>© 2025 Abhijeet All Rights Reserved.</p>
        <div className="flex justify-center mt-2 space-x-4">
          <a href="#" className="hover:text-gray-200"><i className="fab fa-facebook"></i></a>
          <a href="#" className="hover:text-gray-200"><i className="fab fa-instagram"></i></a>
        </div>
      </footer>
  )
}

export default Footer