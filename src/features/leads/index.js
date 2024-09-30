import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import TitleCard from "../../components/Cards/TitleCard";

function Leads() {
  const [trans, setTrans] = useState([]);
  const [filterParams, setFilterParams] = useState({
    department: [],
    startYear: "",
    endYear: "",
  });
  const [departments, setDepartments] = useState([]);
  const [schoolYearRange, setSchoolYearRange] = useState([2018, new Date().getFullYear()]);
  const [sliderValue, setSliderValue] = useState(schoolYearRange);

  // Fetch the lowest year and latest year
  const fetchYearRange = async () => {
    try {
      const [lowestYearResponse, latestYearResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/leads/lowest-year`),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/latest-data-year`)
      ]);

      const lowestYear = 2018 //lowestYearResponse.data.lowestYear;
      const latestYear = latestYearResponse.data.latestYear;

      setSchoolYearRange([parseInt(lowestYear, 10), parseInt(latestYear, 10)]);
      setSliderValue([parseInt(lowestYear, 10), parseInt(latestYear, 10)]);

      setFilterParams(prevParams => ({
        ...prevParams,
        startYear: parseInt(lowestYear, 10),
        endYear: parseInt(latestYear, 10)
      }));
    } catch (error) {
      console.error("Error fetching year range:", error);
    }
  };

  useEffect(() => {
    fetchYearRange();
  }, []);

  const fetchData = async () => {
    try {
      let url = `${process.env.REACT_APP_API_BASE_URL}/api/leads`;
      const params = [];

      if (filterParams.department.length > 0) {
        params.push(`department=${encodeURIComponent(filterParams.department.join(','))}`);
      }
      if (filterParams.startYear) {
        params.push(`start_year=${encodeURIComponent(filterParams.startYear)}`);
      }
      if (filterParams.endYear) {
        params.push(`end_year=${encodeURIComponent(filterParams.endYear)}`);
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }
      console.log(`Fetching data with URL: ${url}`);

      const response = await axios.get(url);
      console.log(response.data)
      setTrans(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("Fetching")
    console.log(filterParams)
  }, [filterParams]);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/departments`
        );
        if (response.data && Array.isArray(response.data)) {
          setDepartments(response.data);
        } else {
          console.error("Unexpected department data structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleDepartmentChange = (selectedOptions) => {
    const selectedDepartments = selectedOptions.map(option => option.value);
    setFilterParams(prevParams => ({
      ...prevParams,
      department: selectedDepartments
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <>
      <TitleCard title="External Factors" topMargin="mt-2">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text required">Department</span>
                <button
                  type="button"
                  onClick={() => setFilterParams({ ...filterParams, department: [] })}
                  className="btn btn-xs btn-ghost ml-2"
                >
                  Reset
                </button>
              </label>
              <Select
                name="department"
                value={departments.filter(dept => filterParams.department.includes(dept.Department)).map(dept => ({ value: dept.Department, label: dept.Department }))}
                onChange={handleDepartmentChange}
                options={departments.map(dept => ({ value: dept.Department, label: dept.Department }))}
                isMulti
                className="basic-multi-select z-60"
                classNamePrefix="select"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text required">Year Range</span>
                <button
                  type="button"
                  onClick={() => {
                    setFilterParams({
                      ...filterParams,
                      startYear: schoolYearRange[0],
                      endYear: schoolYearRange[1]
                    });
                    setSliderValue(schoolYearRange);
                  }}
                  className="btn btn-xs btn-ghost ml-2"
                >
                  Reset
                </button>
              </label>
              <Slider
                range
                min={schoolYearRange[0]}
                max={schoolYearRange[1]}
                value={sliderValue}
                onChange={(value) => setSliderValue(value)}
                onChangeComplete={(value) => {
                  setFilterParams({
                    ...filterParams,
                    startYear: value[0],
                    endYear: value[1]
                  });
                }}
                marks={{
                  [sliderValue[0]]: {
                    style: { 
                      whiteSpace: 'nowrap',
                      transform: sliderValue[0] === schoolYearRange[0] ? 'translateX(0%)' : 'translateX(-50%)',
                      color: '#1890ff',
                      fontWeight: 'bold',
                    },
                    label: `${sliderValue[0]}`
                  },
                  [sliderValue[1]]: {
                    style: { 
                      whiteSpace: 'nowrap',
                      transform: sliderValue[1] === schoolYearRange[1] ? 'translateX(-100%)' : 'translateX(-50%)',
                      color: '#1890ff',
                      fontWeight: 'bold'
                    },
                    label: `${sliderValue[1]}`
                  }
                }}
                step={1}
                tipFormatter={(value) => `${value}`}
                styles={{
                  handle: {
                    borderColor: 'transparent',
                    height: 14,
                    width: 14,
                    marginTop: -5,
                    backgroundColor: '#fff',
                    boxShadow: '0 0 0 2px #1890ff',
                    zIndex: 0
                  },
                  track: {
                    backgroundColor: '#1890ff'
                  },
                  rail: {
                    backgroundColor: '#d9d9d9'
                  },
                  mark: {
                    display: 'none'  // Hide default marks
                  }
                }}
                className="z-1"
              />
            </div>
          </div>
          
        </form>
        <div className="divider pt-8 pb-6"></div>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Start Year</th>
                <th>Department</th>
                <th>Number of Applicants</th>
                <th>CPI Education</th>
                <th>HFCE Education</th>
                <th>Overall HFCE</th>
                <th>Inflation Rate</th>
              </tr>
            </thead>
            <tbody>
              {trans.map((l, k) => (
                <tr key={k}>
                  <td>{l.Start_Year}</td>
                  <td>{l.Department}</td>
                  <td>{l.Number_of_Applicants}</td>
                  <td>{l.CPI_Region3}</td>
                  <td>{l.HFCE_Education}</td>
                  <td>{l.Overall_HFCE}</td>
                  <td>{l.Inflation_Rate_Past}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  );
}

export default Leads;