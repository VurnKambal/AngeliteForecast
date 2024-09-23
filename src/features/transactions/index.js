import { useEffect, useState } from "react";
import axios from "axios";
import TitleCard from "../../components/Cards/TitleCard";
import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import SearchBar from "../../components/Input/SearchBar";

const TopSideButtons = ({ removeFilter, applyFilter, applySearch }) => {
  const [filterParams, setFilterParams] = useState({
    department: "",
    startYear: "",
    endYear: "",
    firstYear: "",
    secondYear: "",
    thirdYear: "",
    fourthYear: "",
    fifthYear: "",
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
    console.log(`Filter applied: ${department}`);
  };

  const removeAppliedFilter = () => {
    setFilterParams({
      startYear: "",
      endYear: "",
      semester: "",
      department: "",
      major: "",
      firstYear: "",
      secondYear: "",
      thirdYear: "",
      fourthYear: "",
      fifthYear: "",
    });
    setSearchText("");
    removeFilter();
    console.log("Filter and search reset");
  };

  useEffect(() => {
    if (searchText.trim() === "") {
      removeFilter();
    } else {
      applySearch(searchText);
      console.log(`Search applied: ${searchText}`);
    }
  }, [searchText]);

  return (
    <div className="inline-block float-right">
      <SearchBar
        searchText={searchText}
        styleClass="mr-4"
        setSearchText={setSearchText}
      />
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
    semester: "",
    department: "",
    major: "",
    firstYear: "",
    secondYear: "",
    thirdYear: "",
    fourthYear: "",
    fifthYear: "",
  });
  const [search, setSearch] = useState("");
  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);
  const [latestDataYear, setLatestDataYear] = useState(null);
  const [schoolYearOptions, setSchoolYearOptions] = useState([]);

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

      // Add search param to the URL
      if (search) {
        params.push(`search=${encodeURIComponent(search)}`);
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      console.log(`Fetching data with URL: ${url}`);

      const response = await axios.get(url);
      setTrans(response.data);
      console.log("Data fetched successfully:", response.data);
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

  // Fetch latest data year
  const fetchLatestDataYear = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/latest-data-year`
      );
      if (response.data && response.data.latestYear) {
        setLatestDataYear(response.data.latestYear);
      } else {
        console.error("Unexpected latest year data structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching latest data year:", error);
    }
  };

  useEffect(() => {
    fetchLatestDataYear();
  }, []);

  // Fetch majors based on department
  const fetchMajors = async (department) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/transactions/majors`,
        {
          params: { department },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setMajors(response.data);
      } else {
        console.error("Unexpected majors data structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching majors:", error);
    }
  };

  // Remove filter and fetch all data
  const removeFilter = () => {
    setFilterParams({
      startYear: "",
      endYear: "",
      semester: "",
      firstYear: "",
      secondYear: "",
      department: "",
      thirdYear: "",
      fourthYear: "",
      fifthYear: "",
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
  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setFilterParams((prevData) => ({
      ...prevData,
      department: department,
      major: "",
    }));
    fetchMajors(department);
  };

  // Handle major change
  const handleMajorChange = (e) => {
    console.log("major changee");
    const major = e.target.value;
    setFilterParams((prevData) => ({
      ...prevData,
      major: major,
    }));
  };

  // Generate school year options
  const fetchLowestYear = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/transactions/lowest-enrollment-year`
      );
      const lowestYear = response.data.lowestYear;
      if (latestDataYear) {
        const options = [];
        for (let year = lowestYear; year <= latestDataYear; year++) {
          options.push(`${year}-${parseInt(year) + 1}`);
        }
        setSchoolYearOptions(options);
      } else {
        console.log("Loading...");
      }
    } catch (error) {
      console.error("Error fetching lowest year:", error);
    }
  };

  useEffect(() => {
    if (latestDataYear) {
      fetchLowestYear();
    }
  }, [latestDataYear]);

  return (
    <>
      <TitleCard
        title="Past Enrollment Datasets [S.Y. 2016-2023]"
        topMargin="mt-2"
        TopSideButtons={
          <TopSideButtons
            applySearch={applySearch}
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
              </label>
              <select
                name="department"
                value={filterParams.department}
                onChange={handleDepartmentChange}
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>
                  Select Department
                </option>
                {departments.map((dept) => (
                  <option key={dept.Department} value={dept.Department}>
                    {dept.Department}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text required">Major</span>
              </label>
              <select
                name="major"
                value={filterParams.major}
                onChange={handleMajorChange}
                className="select select-bordered w-full"
                disabled={!filterParams.department}
                required
              >
                <option value="" disabled>
                  Select Major
                </option>
                {majors.map((major, index) => (
                  <option key={index} value={major.Major}>
                    {major.Major}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text required">School Year</span>
              </label>
              <select
                name="startYear"
                value={filterParams.startYear}
                onChange={(e) =>
                  setFilterParams({
                    ...filterParams,
                    startYear: e.target.value,
                  })
                }
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>
                  Select School Year
                </option>
                {schoolYearOptions.map((year) => (
                  <option key={year} value={year.split("-")[0]}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text required">Semester</span>
              </label>
              <select
                name="semester"
                value={filterParams.semester}
                onChange={(e) =>
                  setFilterParams({ ...filterParams, semester: e.target.value })
                }
                className="select select-bordered w-full"
                disabled={!filterParams.startYear}
                required
              >
                <option value="" disabled>
                  Select Semester
                </option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
              </select>
            </div>
          </div>
        </form>
        <div class="divider pt-8 pb-6"></div>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>School Year</th>
                <th>Semester</th>
                <th>Department</th>
                <th>Major</th>
                <th>First_Year</th>
                <th>Second_Year</th>
                <th>Third_Year</th>
                <th>Fourth_Year</th>
                <th>Fifth_Year</th>
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
                  (l["5th_Year"] || 0);

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
