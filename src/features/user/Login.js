import { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Login() {
  const INITIAL_LOGIN_OBJ = {
    password: "",
    email: ""
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (loginObj.email.trim() === "") return setErrorMessage("Email is required! (use any value)");
    if (loginObj.password.trim() === "") return setErrorMessage("Password is required! (use any value)");
    else {
      setLoading(true);
      try {
        const response = await axios.post(`${API_BASE_URL}/api/login`, loginObj);
        localStorage.setItem("token", response.data.token);
        window.location.href = '/app/welcome';
      } catch (error) {
        setErrorMessage("Invalid credentials. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid grid-cols-1 bg-base-100 rounded-xl">
{/*           <div className=''>
            <LandingIntro />
          </div> */}
          
          <div className='pt-8 pb-24 px-10'>      
            <img
              style={{ height: "6rem", display: "block", margin: "0 auto" }}
              src="/logo landscape.png"
              alt="Angelite logo"
            />
            <h2 className='text-2xl font-semibold mb-2 text-center'>LOGIN</h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <InputText type="email" defaultValue={loginObj.email} updateType="email" containerStyle="mt-4" labelTitle="Email" updateFormValue={updateFormValue} />
                <InputText defaultValue={loginObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue} />
              </div>
              <div className='text-right text-primary'><Link to="/forgot-password"><span className="text-sm inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Forgot Password?</span></Link></div>
              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Login</button>
              <div className='text-center mt-4'>Don't have an account yet? <Link to="/register"><span className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Register</span></Link></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 