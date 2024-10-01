import { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';
import axios from 'axios';
import PasswordStrengthMeter from './components/PasswordStrengthMeter';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Register() {
  const INITIAL_REGISTER_OBJ = {
    name: "",
    password: "",
    email: ""
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ);

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (registerObj.name.trim() === "") return setErrorMessage("Name is required!");
    if (registerObj.email.trim() === "") return setErrorMessage("Email is required!");
    if (registerObj.password.trim() === "") return setErrorMessage("Password is required!");
    else {
      setLoading(true);
      try {
        await axios.post(`${API_BASE_URL}/api/register`, registerObj);
        window.location.href = '/app/welcome';
      } catch (error) {
        console.log(error.response.data.errors[0].msg)
        if (error.response && error.response.data && error.response.data.errors) {
          setErrorMessage(error.response.data.errors[0].msg);
        } else {
          setErrorMessage("Registration failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setRegisterObj({ ...registerObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-start"> {/* Changed from items-center to items-start and added pt-16 */}
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid grid-cols-1 bg-base-100 rounded-xl">
          <div className='pt-8 pb-24 px-10'>
            <img
                style={{ height: "6rem", display: "block", margin: "0 auto" }}
                src="/logo landscape.png"
                alt="Angelite logo"
              />
            <h2 className='text-2xl font-semibold mb-2 text-center'>REGISTER NEW USER</h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <InputText defaultValue={registerObj.name} type="text" updateType="name" containerStyle="mt-4" labelTitle="Name" updateFormValue={updateFormValue} />
                <InputText 
                  defaultValue={registerObj.email} 
                  type="email" 
                  updateType="email" 
                  containerStyle="mt-4" 
                  labelTitle="Email" 
                  updateFormValue={updateFormValue} 
                  placeholder="useremail@hau.edu.ph"
                />
                <InputText defaultValue={registerObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue} />
                <InputText defaultValue={registerObj.confirmPassword} type="password" updateType="confirmPassword" containerStyle="mt-4" labelTitle="Confirm Password" updateFormValue={updateFormValue} />
              </div>
              <PasswordStrengthMeter password={registerObj.password} />
              <ErrorText styleClass="mt-8 text-red-500">{errorMessage}</ErrorText>
              <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;