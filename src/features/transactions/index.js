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
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Start_Year</th>
                <th>End_Year</th>
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
                    <td>{l.Start_Year}</td> 
                    <td>{l.End_Year}</td> 
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
