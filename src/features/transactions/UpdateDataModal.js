import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../common/modalSlice";
import axios from "axios";

function UpdateDataModal({ isOpen, onClose, fetchData }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    Start_Year: "",
    End_Year: "",
    Semester: "",
    Department: "",
    Major: "",
    "1st_Year": "",
    "2nd_Year": "",
    "3rd_Year": "",
    "4th_Year": "",
    "5th_Year": "",
    Grade_11: "",
    Grade_12: ""
  });

  const [isCollege, setIsCollege] = useState(true);

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/departments`);
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    setIsCollege(formData.Department.toLowerCase() !== 'shs');
  }, [formData.Department]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/transactions/update`, formData);
      dispatch(closeModal());
      fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => {
            if (
              (isCollege && ['Grade_11', 'Grade_12'].includes(key)) ||
              (!isCollege && ['1st_Year', '2nd_Year', '3rd_Year', '4th_Year', '5th_Year'].includes(key))
            ) {
              return null;
            }
            return (
              <div key={key} className="form-control">
                <label className="label">
                  <span className="label-text">{key.replace(/_/g, " ")}</span>
                </label>
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="input input-bordered"
                />
              </div>
            );
          })}
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Update
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => dispatch(closeModal())}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateDataModal;
