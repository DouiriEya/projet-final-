// Home.js
import React from 'react';
import LogInForm from '../components/Forms/LogInForm';
import './Home.css';
import logo from '../components/assets/logo.png';

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <img src={logo} alt="Tariki Logo" className="home-logo" />
        <nav className="home-nav-links">
          <a href="/aboutUs" className="home-nav-link">What is Tariki?</a>
          <a href="/touta" className="home-nav-link">Contact the Owner</a>
        </nav>
      </header>
      <div className="home-content">
        <LogInForm />
      </div>
      <footer className="home-footer">
        <p>&copy; All rights reserved 2024</p>
      </footer>
    </div>
  );
}

export default Home;
