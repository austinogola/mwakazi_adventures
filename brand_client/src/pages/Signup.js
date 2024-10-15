import React, { useState } from 'react';
import { useParams,useNavigate,useLocation,Link,useSearchParams } from 'react-router-dom';
import { useCookies } from 'react-cookie'

import Navbar from '../components/Navbar'

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies(['ma_auth_token']);

  const [searchParams] = useSearchParams();
  const bounce = searchParams.get('bounce')

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

    // const serverUrl='http://localhost:5010'
  // const serverUrl='https://server.mwakaziadventures.com'
  const serverUrl=process.env.REACT_APP_SERVER_URL

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setPasswordVisible(!passwordVisible);
    } else {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const res=await response.json()

      console.log(res)

      if(res.status==='fail'){
        return setError(res.message)
      }

      let ma_auth_token=res.token
      const date = new Date();
      date.setTime(date.getTime() + (21 * 24 * 60 * 60 * 1000)); // 21 days from now
      setCookie('ma_auth_token',ma_auth_token,{path:'/',expires:date})

      if(bounce){
        navigate(`/${bounce}`)
      }else{
        navigate('/dashboard');
      }

      

      // if (!response.ok) {
      //   throw new Error('Signup failed');
      // }

      // const data = await response.json();
      // console.log('Signup successful:', data);
      // Handle successful signup (e.g., redirect to login page)
    } catch (error) {
      console.error('Error:', error);
      setError('There was an error during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
        <Navbar/>
    <div className="container">
        
      <h1>Sign Up</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-input">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="visibility-toggle"
              onClick={() => togglePasswordVisibility('password')}
            >
              {passwordVisible ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <div className="password-input">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="visibility-toggle"
              onClick={() => togglePasswordVisibility('confirmPassword')}
            >
              {confirmPasswordVisible ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
        <div className="links">
        <Link to={`/login?bounce=${bounce}`}>Already have an account? Log in</Link>
      </div>
      </form>
      
      <style jsx>{`
        .container {
          max-width: 400px;
          margin: 0 auto;
          {/* padding: 20px; */}
          font-family: Arial, sans-serif;
          padding-bottom:50px;
        }
        h1 {
          text-align: center;
          color: #333;
        }
        .error {
          background-color: #ffebee;
          color: #c62828;
          padding: 10px;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        .password-input {
          position: relative;
          display: flex;
          align-items: center;
        }
        .visibility-toggle {
          position: absolute;
          right: 5px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 20px;
        }
        button[type="submit"] {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 15px;
          font-size: 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }
        button[type="submit"]:hover {
          background-color: #0056b3;
        }
        button[type="submit"]:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        .links {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .links a {
          color: #007bff;
          text-decoration: none;
          margin: 5px 0;
        }
        .links a:hover {
          text-decoration: underline;
        }
        @media (max-width: 480px) {
          .container {
            padding: 10px;
          }
          input, button[type="submit"] {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
    </div>
  );
};

export default Signup;