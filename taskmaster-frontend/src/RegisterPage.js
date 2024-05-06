import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory(); 

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
      });
      const data = await response.json();
      if (data.success) {
        // Display alert for successful registration
        window.alert('Registration successful');

        // Redirect user to login page
        history.push('/');
      } else {
        // Registration failed, show error message
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="register-page">
      <div className="register-form">
        <h2>Register</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleRegister}>Register</button>
        <p>Already have an account? <Link to="/">Login</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;