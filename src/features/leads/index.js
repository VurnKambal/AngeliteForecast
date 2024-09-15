import { useEffect, useState } from "react";
import axios from "axios";
import TitleCard from "../../components/Cards/TitleCard";
import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import SearchBar from "../../components/Input/SearchBar";

const TopSideButtons = ({ removeFilter, applyFilter, applySearch }) => {
  const [filterParams, setFilterParams] = useState({ department: "" });
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
    setFilterParams({ department });
    applyFilter({ department });
    console.log(`Filter applied: ${department}`);
  };

  const removeAppliedFilter = () => {
    setFilterParams({ department: "" });
    setSearchText("");
    removeFilter();
    console.log("Filter and search reset");
  };

  useEffect(() => {
    applySearch(searchText);
    console.log(`Search applied: ${searchText}`);
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

function Leads() {
  const [trans, setTrans] = useState([]);
  const [filterParams, setFilterParams] = useState({ department: "" });
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      let url = `${process.env.REACT_APP_API_BASE_URL}/api/leads`;
      const params = [];

      if (filterParams.department) {
        params.push(
          `department=${encodeURIComponent(filterParams.department)}`
        );
      }

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

  useEffect(() => {
    fetchData();
  }, [filterParams, search]);

  const removeFilter = () => {
    setFilterParams({ department: "" });
    setSearch("");
    fetchData();
  };

  const applyFilter = (params) => {
    setFilterParams(params);
  };

  const applySearch = (value) => {
    setSearch(value);
  };

  return (
    <>
      <TitleCard
        title="Admission and Enrollment Data"
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
                <th>Start Year</th>
                <th>Department</th>
                <th>Number of Applicants</th>
                <th>Number Enrolled</th>
                <th>CPI Region 3</th>
                <th>HFCE Education</th>
                <th>Inflation Rate</th>
              </tr>
            </thead>
            <tbody>
              {trans.map((l, k) => (
                <tr key={k}>
                  <td>{l.Start_Year}</td>
                  <td>{l.Department}</td>
                  <td>{l.Number_of_Applicants}</td>
                  <td>{l.Number_of_Enrolled_Applicants}</td>
                  <td>{l.CPI_Region3}</td>
                  <td>{l.HFCE_Education}</td>
                  <td>{l.Inflation_Rate}</td>
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
