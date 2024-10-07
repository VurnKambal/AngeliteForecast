import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import TitleCard from "../../components/Cards/TitleCard";
import { Select as AntSelect } from 'antd';

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
  const [startYear, setStartYear] = useState(schoolYearRange[0]);
  const [endYear, setEndYear] = useState(schoolYearRange[1]);

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

  const handleStartYearChange = (value) => {
    setStartYear(value);
    if (value > endYear) {
      setEndYear(value);
    }
    setFilterParams({
      ...filterParams,
      startYear: value,
      endYear: Math.max(value, endYear)
    });
  };

  const handleEndYearChange = (value) => {
    setEndYear(value);
    if (value < startYear) {
      setStartYear(value);
    }
    setFilterParams({
      ...filterParams,
      startYear: Math.min(startYear, value),
      endYear: value
    });
  };

  useEffect(() => {
    // Update local state when filterParams change
    setStartYear(filterParams.startYear);
    setEndYear(filterParams.endYear);
  }, [filterParams.startYear, filterParams.endYear]);

  return (
    <>
      <TitleCard 
        title={`Past Trends [${schoolYearRange[0]} - ${schoolYearRange[1]}]`}
        topMargin="mt-2"
      >
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
              <div className="flex items-center space-x-4 w-full">
                <div className="flex-grow flex items-center space-x-2">
                  <AntSelect
                    value={startYear}
                    onChange={handleStartYearChange}
                    className="flex-1"
                  >
                    {Array.from({ length: schoolYearRange[1] - schoolYearRange[0] + 1 }, (_, i) => schoolYearRange[0] + i).map(year => (
                      <AntSelect.Option key={year} value={year}>{year}</AntSelect.Option>
                    ))}
                  </AntSelect>
                  <span>-</span>
                  <AntSelect
                    value={endYear}
                    onChange={handleEndYearChange}
                    className="flex-1"
                  >
                    {Array.from({ length: schoolYearRange[1] - startYear + 1 }, (_, i) => startYear + i).map(year => (
                      <AntSelect.Option key={year} value={year}>{year}</AntSelect.Option>
                    ))}
                  </AntSelect>
                </div>
              </div>
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