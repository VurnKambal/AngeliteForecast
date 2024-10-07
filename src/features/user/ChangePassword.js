import { useState } from 'react';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';
import axios from 'axios';
import zxcvbn from 'zxcvbn';
import PasswordStrengthMeter from './components/PasswordStrengthMeter';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function ChangePassword() {
  const INITIAL_PASSWORD_OBJ = {
    newPassword: "",
    confirmPassword: ""
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordObj, setPasswordObj] = useState(INITIAL_PASSWORD_OBJ);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (passwordObj.newPassword.trim() === "") return setErrorMessage("New password is required!");
    if (passwordObj.confirmPassword.trim() === "") return setErrorMessage("Confirm password is required!");
    if (passwordObj.newPassword !== passwordObj.confirmPassword) return setErrorMessage("Passwords do not match!");
    if (passwordStrength < 3) return setErrorMessage("Password is not strong enough!");

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/change-password`, 
        { newPassword: passwordObj.newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert("Password changed successfully!");
      window.location.href = '/app/welcome';
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setPasswordObj({ ...passwordObj, [updateType]: value });
    if (updateType === 'newPassword') {
      const result = zxcvbn(value);
      setPasswordStrength(result.score);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid grid-cols-1 bg-base-100 rounded-xl">
          <div className='pt-8 pb-24 px-10'>      
            <img
              style={{ height: "6rem", display: "block", margin: "0 auto" }}
              src="/logo landscape.png"
              alt="Angelite logo"
            />
            <h2 className='text-2xl font-semibold mb-2 text-center'>Change Password</h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <InputText 
                  defaultValue={passwordObj.newPassword} 
                  type="password" 
                  updateType="newPassword" 
                  containerStyle="mt-4" 
                  labelTitle="New Password" 
                  updateFormValue={updateFormValue}
                />
                <PasswordStrengthMeter password={passwordObj.newPassword} />

                <InputText 
                  defaultValue={passwordObj.confirmPassword} 
                  type="password" 
                  updateType="confirmPassword" 
                  containerStyle="mt-4" 
                  labelTitle="Confirm New Password" 
                  updateFormValue={updateFormValue}
                />
              </div>
              <ErrorText styleClass="mt-8 text-red-500">{errorMessage}</ErrorText>
              <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Change Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;