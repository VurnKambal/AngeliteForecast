import axios from "axios"
import { jwtDecode } from 'jwt-decode'; 

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const checkAuth = () => {
  const TOKEN = localStorage.getItem("token")
  const PUBLIC_ROUTES = ["login"]

  const isPublicPage = PUBLIC_ROUTES.some(r => window.location.href.includes(r))

  if (!TOKEN && !isPublicPage) {
      window.location.href = '/login'
      return null;
  } else if (TOKEN) {
      try {
          const decodedToken = jwtDecode(TOKEN);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
              // Token has expired
              localStorage.removeItem("token");
              window.location.href = '/login'
              return null;
          }

          // Token is valid
          axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`

          axios.interceptors.request.use(function (config) {
              document.body.classList.add('loading-indicator');
              return config
          }, function (error) {
              return Promise.reject(error);
          });
        
          axios.interceptors.response.use(function (response) {
              document.body.classList.remove('loading-indicator');
              return response;
          }, function (error) {
              document.body.classList.remove('loading-indicator');
              return Promise.reject(error);
          });

          return TOKEN;
      } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
          window.location.href = '/login'
          return null;
      }
  }
  return null;
}

export default checkAuth

export const checkAdminStatus = async () => {
  try {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    if (!token) {
      console.error('No token found');
      return false;
    }

    const response = await axios.get(`${API_BASE_URL}/api/check-role`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response)
    return response.data.role === 'Admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}