import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import TitleCard from "../../components/Cards/TitleCard";
import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import SearchBar from "../../components/Input/SearchBar";

const TopSideButtons = ({ removeFilter, applyFilter, applySearch }) => {
  const [filterParams, setFilterParams] = useState({
    department: "",
    startYear: "",
    endYear: "",
    startYear_1: "",
    endYear_1: "",
    firstYear: "",
    secondYear: "",
    thirdYear: "",
    fourthYear: "",
    fifthYear: "",
    gradeEleven: "",
    gradeTwelve: "",
  });
  const [searchText, setSearchText] = useState("");
  const locationFilters = [
    "SBA",
    "SEA",
    "SAS",
    "SED",
    "SHTM",
    "SNAMS",
    "SOC",
    "CCJEF",
  ];

  const showFiltersAndApply = (department) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      department: department,
    }));
    applyFilter({
      ...filterParams,
      department: department,
    });
  };

  const removeAppliedFilter = () => {
    setFilterParams({
      startYear: "",
      endYear: "",
      startYear_1: "",
      endYear_1: "",
      semester: "",
      department: "",
      major: "",
      firstYear: "",
      secondYear: "",
      thirdYear: "",
      fourthYear: "",
      fifthYear: "",
      gradeEleven: "",
      gradeTwelve: "",
    });
    setSearchText("");
    removeFilter();
  };

  useEffect(() => {
    if (searchText.trim() === "") {
      removeFilter();
    } else {
      applySearch(searchText);
    }
  }, [searchText]);

  return (
    <div className="inline-block float-right">
      
      {filterParams.department && (
        <button
          onClick={removeAppliedFilter}
          className="btn btn-xs mr-2 btn-active btn-ghost normal-case"
        >
          {filterParams.department}
          <XMarkIcon className="w-4 ml-2" />
        </button>
      )}
      <div className="dropdown dropdown-bottom dropdown-end">
        <label tabIndex={0} className="btn btn-sm btn-outline">
          <FunnelIcon className="w-5 mr-2" /> Filter
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-secondary rounded-box z-[1] w-52 p-2 shadow"
        >
          {locationFilters.map((l, k) => (
            <li key={k}>
              <a onClick={() => showFiltersAndApply(l)}>{l}</a>
            </li>
          ))}
          <div className="divider mt-0 mb-0"></div>
          <li>
            <a onClick={removeAppliedFilter}>Remove Filter</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

function Transactions() {
  const [trans, setTrans] = useState([]);
  const [filterParams, setFilterParams] = useState({
    startYear: "",
    endYear: "",
    startYear_1: "",
    endYear_1: "",
    semester: [],
    department: "",
    major: "",
    firstYear: "",
    secondYear: "",
    thirdYear: "",
    fourthYear: "",
    fifthYear: "",
    gradeEleven: "",
    gradeTwelve: "",
  });
  const [search, setSearch] = useState("");
  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);
  const [latestDataYear, setLatestDataYear] = useState(null);
  const [schoolYearRange, setSchoolYearRange] = useState([2016, new Date().getFullYear()]);
  const [sliderValue, setSliderValue] = useState(schoolYearRange);

  // Fetch the lowest year and latest year
  const fetchYearRange = async () => {
    try {
      const [lowestYearResponse, latestYearResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/transactions/lowest-enrollment-year`),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/latest-data-year`)
      ]);

      const lowestYear = lowestYearResponse.data.lowestYear;
      const latestYear = latestYearResponse.data.latestYear;

      setSchoolYearRange([parseInt(lowestYear, 10), parseInt(latestYear, 10)]);
    } catch (error) {
      console.error("Error fetching year range:", error);
    }
  };

  useEffect(() => {
    fetchYearRange();
  }, []);

  // Fetch data with optional filter and search params
  const fetchData = async () => {
    try {
      let url = `${process.env.REACT_APP_API_BASE_URL}/api/transactions`;
      const params = [];

      // Add filter params to the URL
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value) {
          params.push(`${key}=${encodeURIComponent(value)}`);
        }
      });


      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }


      const response = await axios.get(url);
      console.log(response.data)
      setTrans(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch all data initially or when filter/search changes
  useEffect(() => {
    fetchData();
  }, [filterParams, search]);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/transactions/departments`
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

  // Fetch majors based on department
  const fetchMajors = async (departments) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/transactions/majors`,
        {
          params: { department: departments.join(",") },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        // Remove duplicates while preserving order
        const uniqueMajors = response.data.reduce((acc, major) => {
          if (!acc.some(m => m.Major === major.Major)) {
            acc.push(major);
          }
          return acc;
        }, []);

        setMajors(uniqueMajors);
        console.log("Unique majors:", uniqueMajors);
        return uniqueMajors;
      } else {
        console.error("Unexpected majors data structure:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching majors:", error);
      return [];
    }
  };

  // Remove filter and fetch all data
  const removeFilter = () => {
    setFilterParams({
      startYear: "",
      endYear: "",
      startYear_1: "",
      endYear_1: "",
      semester: [],
      major: [],
      firstYear: "",
      secondYear: "",
      department: "",
      thirdYear: "",
      fourthYear: "",
      fifthYear: "",
      gradeEleven: "",
      gradeTwelve: "",
    });
    setSearch("");
    fetchData(); // Fetch data
  };

  // Set filter parameters
  const applyFilter = (params) => {
    setFilterParams(params);
  };

  // Set search text
  const applySearch = (value) => {
    setSearch(value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Handle department change
  const handleDepartmentChange = async (selectedOptions) => {
    const selectedDepartments = selectedOptions.map(option => option.value);
    
    // Fetch majors for the selected departments
    await fetchMajors(selectedDepartments);
    
    // Ensure filterParams.major is an array
    const currentMajors = Array.isArray(filterParams.major) ? filterParams.major : [];
    console.log("majors:",currentMajors)

    // Filter the current majors to keep only those belonging to the selected departments
    const updatedMajors = [...new Set(currentMajors.filter(majorName => {
      const majorObj = majors.find(m => m.Major.trim() === majorName);
      return majorObj && selectedDepartments.includes(majorObj.Department);
    }))];

    console.log(updatedMajors, "majorssss")
    setFilterParams(prevData => ({
      ...prevData,
      department: selectedDepartments,
      major: updatedMajors
    }));
  };

  // Handle major change
  const handleMajorChange = (selectedOptions) => {
    const selectedMajors = selectedOptions.map(option => option.value);
    setFilterParams(prevData => ({
      ...prevData,
      major: selectedMajors
    }));
  };

  const semesterOptions = [
    { value: '1', label: '1st Semester' },
    { value: '2', label: '2nd Semester' }
  ];

  return (
    <>
      <TitleCard
        title="Past Enrollment Datasets [S.Y. 2016-2023]"
        topMargin="mt-2"
        TopSideButtons={
          <TopSideButtons
            applyFilter={applyFilter}
            removeFilter={removeFilter}
          />
        }
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text required">Department</span>
                <button
                  type="button"
                  onClick={() => setFilterParams({ ...filterParams, department: "", major: [] })}
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
                className="basic-multi-select absolute inset-0 z-10"  // Add these classes
                classNamePrefix="select"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text required">Major</span>
                <button
                  type="button"
                  onClick={() => setFilterParams({ ...filterParams, major: [] })}
                  className="btn btn-xs btn-ghost ml-2"
                >
                  Reset
                </button>
              </label>
              <Select
                name="major"
                value={(Array.isArray(filterParams.major) ? filterParams.major : []).map(majorName => {
                  const majorObj = majors.find(m => m.Major === majorName);
                  return majorObj ? { value: majorObj.Major, label: majorObj.Major } : null;
                }).filter(Boolean)}
                onChange={handleMajorChange}
                options={majors.map(major => ({ value: major.Major, label: major.Major }))}
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
                isDisabled={!filterParams.department.length}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text required">School Year</span>
                <button
                  type="button"
                  onClick={() => {
                    setFilterParams({
                      ...filterParams,
                      startYear: schoolYearRange[0],
                      endYear: schoolYearRange[0]+1,
                      startYear_1: schoolYearRange[1],
                      endYear_1: schoolYearRange[1]+1
                    })
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
                    endYear: value[0]+1,
                    startYear_1: value[1],
                    endYear_1: value[1]+1
                  });
                }}
                marks={{
                  [schoolYearRange[0]]: {
                    style: { 
                      whiteSpace: 'nowrap',
                      transform: 'translateX(0%)',
                      left: '0%'
                    },
                    label: `S.Y. ${schoolYearRange[0]}-${schoolYearRange[0] + 1}`
                  },
                  [schoolYearRange[1]]: {
                    style: { 
                      whiteSpace: 'nowrap',
                      transform: 'translateX(-100%)',
                      left: '100%'
                    },
                    label: `S.Y. ${schoolYearRange[1]}-${schoolYearRange[1] + 1}`
                  }
                }}
                step={1}
                tipFormatter={(value) => `S.Y. ${value}-${value + 1}`}
                styles={{
                  handle: {
                    borderColor: 'transparent',
                    height: 14,
                    width: 14,
                    marginTop: -5,
                    backgroundColor: '#fff',
                    boxShadow: '0 0 0 2px #1890ff'
                  },
                  track: {
                    backgroundColor: '#1890ff'
                  }
                }}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text required">Semester</span>
                <button
                  type="button"
                  onClick={() => setFilterParams({ ...filterParams, semester: [] })}
                  className="btn btn-xs btn-ghost ml-2"
                >
                  Reset
                </button>
              </label>
              <Select
                name="semester"
                value={semesterOptions.filter(option => filterParams.semester.includes(option.value))}
                onChange={(selectedOptions) => {
                  setFilterParams({
                    ...filterParams,
                    semester: selectedOptions.map(option => option.value)
                  });
                }}
                options={semesterOptions}
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
                required
              />
            </div>
          </div>
        </form>
        <div className="divider pt-8 pb-6"></div>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>School Year</th>
                <th>Semester</th>
                <th>Department</th>
                <th>Major</th>
                <th>1st Year</th>
                <th>2nd Year</th>
                <th>3rd Year</th>
                <th>4th Year</th>
                <th>5th Year</th>
                <th>Grade 11</th>
                <th>Grade 12</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {trans.map((l, k) => {
                const total =
                  (l["1st_Year"] || 0) +
                  (l["2nd_Year"] || 0) +
                  (l["3rd_Year"] || 0) +
                  (l["4th_Year"] || 0) +
                  (l["5th_Year"] || 0) + 
                  (l["Grade_11"] || 0) +
                  (l["Grade_12"] || 0);

                return (
                  <tr key={k}>
                    <td>
                      {l.Start_Year}-{l.End_Year}
                    </td>
                    <td>{l.Semester}</td>
                    <td>{l.Department}</td>
                    <td>{l.Major}</td>
                    <td>{l["1st_Year"] || 0}</td>
                    <td>{l["2nd_Year"] || 0}</td>
                    <td>{l["3rd_Year"] || 0}</td>
                    <td>{l["4th_Year"] || 0}</td>
                    <td>{l["5th_Year"] || 0}</td>
                    <td>{l["Grade_11"] || 0}</td>
                    <td>{l["Grade_12"] || 0}</td>
                    <td>{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </>
  );
}

export default Transactions;
