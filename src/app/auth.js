import axios from "axios"
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const checkAuth = () => {
/*  Getting token value stored in localstorage, if token is not present we will open login page 
    for all internal dashboard routes  */
    const TOKEN = localStorage.getItem("token")
    const PUBLIC_ROUTES = ["login"]

    const isPublicPage = PUBLIC_ROUTES.some( r => window.location.href.includes(r))

    if(!TOKEN && !isPublicPage){
        window.location.href = '/login'
        return;
    }else{
        axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`

        axios.interceptors.request.use(function (config) {
            // UPDATE: Add this code to show global loading indicator
            document.body.classList.add('loading-indicator');
            return config
          }, function (error) {
            return Promise.reject(error);
          });
          
          axios.interceptors.response.use(function (response) {
            // UPDATE: Add this code to hide global loading indicator
            document.body.classList.remove('loading-indicator');
            return response;
          }, function (error) {
            document.body.classList.remove('loading-indicator');
            return Promise.reject(error);
          });
        return TOKEN
    }
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