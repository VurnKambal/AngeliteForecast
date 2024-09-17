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
    "CCJEF",
    "SOC",
    "CROSS ENROLEE",
    "RETURNING",
    "SAS",
    "SBA",
    "SEA",
    "SED",
    "SHTM",
    "SNAMS",
    "TOTAL",
    "HAUSPELL",
    "TRANSFEREE",
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
  }, [searchText, applySearch]);

  return (
    <div className="flex items-center space-x-4">
      <SearchBar
        searchText={searchText}
        styleClass="mr-4"
        setSearchText={setSearchText}
      />
      {filterParams.department && (
        <button
          onClick={removeAppliedFilter}
          className="btn btn-xs btn-active btn-ghost normal-case"
          style={{ padding: "8px 12px" }}
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
          className="dropdown-content menu bg-secondary rounded-box z-[1] p-2 shadow"
          style={{ width: "200px" }}
        >
          {locationFilters.map((l, k) => (
            <li key={k}>
              <button
                onClick={() => showFiltersAndApply(l)}
                className="block w-full text-left py-2 px-4"
              >
                {l}
              </button>
            </li>
          ))}
          <div className="divider mt-0 mb-0"></div>
          <li>
            <button
              onClick={removeAppliedFilter}
              className="block w-full text-left py-2 px-4"
            >
              Remove Filter
            </button>
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
        title="External Factors"
        topMargin="mt-2"
        TopSideButtons={
          <div className="flex items-center space-x-4">
            <TopSideButtons
              applySearch={applySearch}
              applyFilter={applyFilter}
              removeFilter={removeFilter}
            />
          </div>
        }
      >
        <div className="overflow-x-auto w-full relative">
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
                  <td>{l.Start_Year || "-"}</td>
                  <td>{l.Department || "-"}</td>
                  <td>{l.Number_of_Applicants || "-"}</td>
                  <td>{l.Number_of_Enrolled_Applicants || "-"}</td>
                  <td>{l.CPI_Region3 || "-"}</td>
                  <td>{l.HFCE_Education || "-"}</td>
                  <td>{l.Inflation_Rate || "-"}</td>
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

//*TINATRY KO PA WAIT AHAHHAH */

// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import TitleCard from "../../components/Cards/TitleCard";
// import FunnelIcon from "@heroicons/react/24/outline/FunnelIcon";
// import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
// import SearchBar from "../../components/Input/SearchBar";

// const TopSideButtons = ({ removeFilter, applyFilter, applySearch }) => {
//   const [filterParams, setFilterParams] = useState({ department: "" });
//   const [searchText, setSearchText] = useState("");
//   const locationFilters = [
//     "CCJEF",
//     "SOC",
//     "CROSS ENROLEE",
//     "RETURNING",
//     "SAS",
//     "SBA",
//     "SEA",
//     "SED",
//     "SHTM",
//     "SNAMS",
//     "TOTAL",
//     "HAUSPELL",
//     "TRANSFEREE",
//   ];

//   const showFiltersAndApply = (department) => {
//     setFilterParams({ department });
//     applyFilter({ department });
//     console.log(`Filter applied: ${department}`);
//   };

//   const removeAppliedFilter = () => {
//     setFilterParams({ department: "" });
//     setSearchText("");
//     removeFilter();
//     console.log("Filter and search reset");
//   };

//   useEffect(() => {
//     applySearch(searchText);
//     console.log(`Search applied: ${searchText}`);
//   }, [searchText, applySearch]);

//   return (
//     <div className="flex items-center space-x-4">
//       <SearchBar
//         searchText={searchText}
//         styleClass="mr-4"
//         setSearchText={setSearchText}
//       />
//       {filterParams.department && (
//         <button
//           onClick={removeAppliedFilter}
//           className="btn btn-xs btn-active btn-ghost normal-case"
//           style={{ padding: "8px 12px" }}
//         >
//           {filterParams.department}
//           <XMarkIcon className="w-4 ml-2" />
//         </button>
//       )}
//       <div className="dropdown dropdown-bottom dropdown-end">
//         <label tabIndex={0} className="btn btn-sm btn-outline">
//           <FunnelIcon className="w-5 mr-2" /> Filter
//         </label>
//         <ul
//           tabIndex={0}
//           className="dropdown-content menu bg-secondary rounded-box z-[1] p-2 shadow"
//           style={{ width: "200px" }}
//         >
//           {locationFilters.map((l, k) => (
//             <li key={k}>
//               <button
//                 onClick={() => showFiltersAndApply(l)}
//                 className="block w-full text-left py-2 px-4"
//               >
//                 {l}
//               </button>
//             </li>
//           ))}
//           <div className="divider mt-0 mb-0"></div>
//           <li>
//             <button
//               onClick={removeAppliedFilter}
//               className="block w-full text-left py-2 px-4"
//             >
//               Remove Filter
//             </button>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// function Leads() {
//   const [trans, setTrans] = useState([]);
//   const [filterParams, setFilterParams] = useState({ department: "" });
//   const [search, setSearch] = useState("");
//   const [newData, setNewData] = useState({
//     ID: "", // Added ID for update functionality
//     Start_Year: "",
//     Department: "",
//     Number_of_Applicants: "",
//     Number_of_Enrolled_Applicants: "",
//     CPI_Region3: "",
//     HFCE_Education: "",
//     Inflation_Rate: "",
//   });
//   const [message, setMessage] = useState(""); // Added for success/error messages

//   const addDataRef = useRef(null);

//   const fetchData = async () => {
//     try {
//       let url = `${process.env.REACT_APP_API_BASE_URL}/api/leads`;
//       const params = [];

//       if (filterParams.department) {
//         params.push(
//           `department=${encodeURIComponent(filterParams.department)}`
//         );
//       }

//       if (search) {
//         params.push(`search=${encodeURIComponent(search)}`);
//       }

//       if (params.length > 0) {
//         url += `?${params.join("&")}`;
//       }

//       console.log(`Fetching data with URL: ${url}`);

//       const response = await axios.get(url);
//       setTrans(response.data);
//       console.log("Data fetched successfully:", response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [filterParams, search]);

//   const removeFilter = () => {
//     setFilterParams({ department: "" });
//     setSearch("");
//     fetchData();
//   };

//   const applyFilter = (params) => {
//     setFilterParams(params);
//   };

//   const applySearch = (value) => {
//     setSearch(value);
//   };

//   const handleChange = (e) => {
//     setNewData({
//       ...newData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const addOrUpdateData = async () => {
//     try {
//       let url;
//       const dataToSend = { ...newData };

//       if (dataToSend.ID) {
//         // If ID exists, update the existing data
//         url = `${process.env.REACT_APP_API_BASE_URL}/api/leads/${dataToSend.ID}`;
//         await axios.put(url, dataToSend);
//         setMessage("Data updated successfully");
//         console.log("Data updated successfully:", dataToSend);
//       } else {
//         // Otherwise, add new data
//         url = `${process.env.REACT_APP_API_BASE_URL}/api/leads`;
//         await axios.post(url, dataToSend);
//         setMessage("Data added successfully");
//         console.log("Data added successfully:", dataToSend);
//       }

//       fetchData(); // Refresh the data after adding or updating
//       setNewData({
//         ID: "", // Reset ID
//         Start_Year: "",
//         Department: "",
//         Number_of_Applicants: "",
//         Number_of_Enrolled_Applicants: "",
//         CPI_Region3: "",
//         HFCE_Education: "",
//         Inflation_Rate: "",
//       }); // Clear the form
//     } catch (error) {
//       let errorMessage = "Error adding or updating data";

//       if (error.response) {
//         // Server responded with a status other than 2xx
//         errorMessage = error.response.data.error || error.response.statusText;
//       } else if (error.request) {
//         // Request was made but no response was received
//         errorMessage = "No response from server";
//       } else {
//         // Something happened in setting up the request
//         errorMessage = error.message;
//       }

//       setMessage(`Error adding or updating data: ${errorMessage}`);
//       console.error("Error adding or updating data:", error);
//     }
//   };

//   const scrollToAddData = () => {
//     if (addDataRef.current) {
//       addDataRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   return (
//     <>
//       <TitleCard
//         title="External Factors"
//         topMargin="mt-2"
//         TopSideButtons={
//           <div className="flex items-center space-x-4">
//             <TopSideButtons
//               applySearch={applySearch}
//               applyFilter={applyFilter}
//               removeFilter={removeFilter}
//             />
//             <button onClick={scrollToAddData} className="btn btn-primary">
//               Go to Add Data
//             </button>
//           </div>
//         }
//       >
//         <div className="overflow-x-auto w-full relative">
//           <table className="table w-full">
//             <thead>
//               <tr>
//                 <th>Start Year</th>
//                 <th>Department</th>
//                 <th>Number of Applicants</th>
//                 <th>Number Enrolled</th>
//                 <th>CPI Region 3</th>
//                 <th>HFCE Education</th>
//                 <th>Inflation Rate</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {trans.map((l, k) => (
//                 <tr key={k}>
//                   <td>{l.Start_Year || "-"}</td>
//                   <td>{l.Department || "-"}</td>
//                   <td>{l.Number_of_Applicants || "-"}</td>
//                   <td>{l.Number_of_Enrolled_Applicants || "-"}</td>
//                   <td>{l.CPI_Region3 || "-"}</td>
//                   <td>{l.HFCE_Education || "-"}</td>
//                   <td>{l.Inflation_Rate || "-"}</td>
//                   <td>
//                     <button
//                       onClick={() => setNewData(l)}
//                       className="btn btn-sm btn-primary"
//                     >
//                       Edit
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div ref={addDataRef} className="p-4 border-t mt-4">
//             <h2 className="text-xl font-semibold">Add or Update Data</h2>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 addOrUpdateData();
//               }}
//             >
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Start Year
//                 </label>
//                 <input
//                   type="text"
//                   name="Start_Year"
//                   value={newData.Start_Year}
//                   onChange={handleChange}
//                   className="input"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Department
//                 </label>
//                 <input
//                   type="text"
//                   name="Department"
//                   value={newData.Department}
//                   onChange={handleChange}
//                   className="input"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Number of Applicants
//                 </label>
//                 <input
//                   type="text"
//                   name="Number_of_Applicants"
//                   value={newData.Number_of_Applicants}
//                   onChange={handleChange}
//                   className="input"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Number Enrolled
//                 </label>
//                 <input
//                   type="text"
//                   name="Number_of_Enrolled_Applicants"
//                   value={newData.Number_of_Enrolled_Applicants}
//                   onChange={handleChange}
//                   className="input"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   CPI Region 3
//                 </label>
//                 <input
//                   type="text"
//                   name="CPI_Region3"
//                   value={newData.CPI_Region3}
//                   onChange={handleChange}
//                   className="input"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   HFCE Education
//                 </label>
//                 <input
//                   type="text"
//                   name="HFCE_Education"
//                   value={newData.HFCE_Education}
//                   onChange={handleChange}
//                   className="input"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Inflation Rate
//                 </label>
//                 <input
//                   type="text"
//                   name="Inflation_Rate"
//                   value={newData.Inflation_Rate}
//                   onChange={handleChange}
//                   className="input"
//                 />
//               </div>
//               <button type="submit" className="btn btn-primary">
//                 Save Data
//               </button>
//             </form>
//           </div>
//         </div>
//       </TitleCard>
//       {message && <div className="message">{message}</div>}
//     </>
//   );
// }

// export default Leads;
