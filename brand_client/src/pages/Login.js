import React, { useState } from 'react';
import Navbar from '../components/Navbar'
import { useParams,useNavigate,useLocation,Link,useSearchParams } from 'react-router-dom';
import { useCookies } from 'react-cookie'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${serverUrl}/auth/login`, {
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
      if(bounce && bounce.length>2){
        navigate(`/${bounce}`)
      }else{
        navigate('/dashboard');
      }



    //   const data = await response.json();
    //   console.log('Login successful:', data);
      // Handle successful login (e.g., store token, redirect to dashboard)
    } catch (error) {
      console.error('Error:', error);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
    <Navbar/>
    <div className="container">
      <h1>Log In</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
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
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <div className="links">
        <Link href="/forgot-password">Forgot Password?</Link>
        <Link to={`/signup?bounce=${bounce}`}>Don't have an account? Sign Up</Link>
      </div>
      <style jsx>{`
        .container {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
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

export default Login;