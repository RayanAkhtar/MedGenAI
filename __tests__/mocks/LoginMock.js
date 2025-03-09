import React, { useState } from 'react';

// This is a simplified version of your Login component for testing
const LoginMock = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    
    try {
      await signInWithEmailAndPassword(email, password);
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        
        {error && <div className="error">{error}</div>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default LoginMock; 