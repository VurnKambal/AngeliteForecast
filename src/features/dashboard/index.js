import DashboardStats from "./components/DashboardStats";
import AmountStats from "./components/AmountStats";
import PageStats from "./components/PageStats";
import TitleCard from "../../components/Cards/TitleCard";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import UserChannels from "./components/UserChannels";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import DashboardTopBar from "./components/DashboardTopBar";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";
import DoughnutChart from "./components/DoughnutChart";
import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const statsData = [
  {
    title: "2024-2025 1st sem Total",
    value: "14,796",
    icon: <UserGroupIcon className="w-8 h-8" />,
    description: "students",
  },
  {
    title: "2023 Inflation rate",
    value: "5.9780%",
    icon: <CreditCardIcon className="w-8 h-8" />,
    description: "Previous Year",
  },
  {
    title: "2024 HFCE",
    value: "4,216,127",
    icon: <CircleStackIcon className="w-8 h-8" />,
    description: "2nd Quarter",
  },
  {
    title: "2024 Consumer Price Index",
    value: "107.4",
    icon: <UsersIcon className="w-8 h-8" />,
    description: "Region 3",
  },
];

const combinedData = [
  {
    Algorithm:
      "Ensemble (Simple Exponential Smoothing + Random Forest + XGBoost DART)",
    Test_SMAPE: "29.11%",
    Train_SMAPE: "21.44%",
    Test_MAPE: "54.60%",
    Train_MAPE: "33.52%",
    Test_MAE: "9.1153",
    Train_MAE: "7.6305",
    Test_RMSE: "12.2706",
    Train_RMSE: "12.6801",
    Test_R2: "96.8033",
    Train_R2: "98.5265",
  },
  {
    Algorithm: "Simple Exponential Smoothing (EMA)",
    Test_SMAPE: "24.16%",
    Train_SMAPE: "27.07%",
    Test_MAPE: "31.16%",
    Train_MAPE: "34.90%",
    Test_MAE: "12.0113",
    Train_MAE: "13.1002",
    Test_RMSE: "18.4763",
    Train_RMSE: "23.0617",
    Test_R2: "92.7523",
    Train_R2: "95.1258",
  },
  {
    Algorithm: "SGD Regressor",
    Test_SMAPE: "33.25%",
    Train_SMAPE: "37.68%",
    Test_MAPE: "54.80%",
    Train_MAPE: "65.68%",
    Test_MAE: "12.3179",
    Train_MAE: "11.1350",
    Test_RMSE: "21.4592",
    Train_RMSE: "20.9905",
    Test_R2: "90.7759",
    Train_R2: "95.9606",
  },
  {
    Algorithm: "Ensemble (Simple Exponential Smoothing + Random Forest)",
    Test_SMAPE: "37.25%",
    Train_SMAPE: "28.87%",
    Test_MAPE: "73.05%",
    Train_MAPE: "60.61%",
    Test_MAE: "15.6855",
    Train_MAE: "8.8749",
    Test_RMSE: "23.7927",
    Train_RMSE: "19.5961",
    Test_R2: "90.6345",
    Train_R2: "96.5017",
  },
  {
    Algorithm: "XGBoost DART",
    Test_SMAPE: "38.52%",
    Train_SMAPE: "37.63%",
    Test_MAPE: "80.42%",
    Train_MAPE: "119.11%",
    Test_MAE: "16.7667",
    Train_MAE: "10.7518",
    Test_RMSE: "24.7067",
    Train_RMSE: "22.2941",
    Test_R2: "89.9011",
    Train_R2: "95.4623",
  },
  {
    Algorithm: "Random Forest",
    Test_SMAPE: "38.52%",
    Train_SMAPE: "28.58%",
    Test_MAPE: "81.23%",
    Train_MAPE: "73.51%",
    Test_MAE: "15.7459",
    Train_MAE: "7.0336",
    Test_RMSE: "23.6002",
    Train_RMSE: "14.6424",
    Test_R2: "90.7855",
    Train_R2: "98.0426",
  },
  {
    Algorithm: "SVR",
    Test_SMAPE: "43.28%",
    Train_SMAPE: "43.03%",
    Test_MAPE: "61.75%",
    Train_MAPE: "61.30%",
    Test_MAE: "12.6862",
    Train_MAE: "11.6088",
    Test_RMSE: "21.8212",
    Train_RMSE: "22.7144",
    Test_R2: "90.4620",
    Train_R2: "95.2699",
  },
  {
    Algorithm: "KNN",
    Test_SMAPE: "45.46%",
    Train_SMAPE: "0.00%",
    Test_MAPE: "93.18%",
    Train_MAPE: "0.00%",
    Test_MAE: "15.6051",
    Train_MAE: "0.0000",
    Test_RMSE: "20.1940",
    Train_RMSE: "0.0000",
    Test_R2: "91.3421",
    Train_R2: "100.0000",
  },
  {
    Algorithm: "Linear Regression",
    Test_SMAPE: "69.35%",
    Train_SMAPE: "0.00%",
    Test_MAPE: "94.98%",
    Train_MAPE: "0.00%",
    Test_MAE: "30.7678",
    Train_MAE: "0.0000",
    Test_RMSE: "48.3992",
    Train_RMSE: "0.0000",
    Test_R2: "53.7879",
    Train_R2: "100.0000",
  },
];

function Dashboard() {
  const [testSortConfig, setTestSortConfig] = useState({
    key: "Test_SMAPE",
    direction: "asc",
  });
  const [trainSortConfig, setTrainSortConfig] = useState({
    key: "Train_SMAPE",
    direction: "asc",
  });

  const handleTestSort = (key) => {
    const direction =
      testSortConfig.key === key && testSortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setTestSortConfig({ key, direction });
  };

  const handleTrainSort = (key) => {
    const direction =
      trainSortConfig.key === key && trainSortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setTrainSortConfig({ key, direction });
  };

  const sortedTestData = [...combinedData].sort((a, b) => {
    if (testSortConfig.direction === "asc") {
      return (
        parseFloat(a[testSortConfig.key]) - parseFloat(b[testSortConfig.key])
      );
    } else {
      return (
        parseFloat(b[testSortConfig.key]) - parseFloat(a[testSortConfig.key])
      );
    }
  });

  const sortedTrainData = [...combinedData].sort((a, b) => {
    if (trainSortConfig.direction === "asc") {
      return (
        parseFloat(a[trainSortConfig.key]) - parseFloat(b[trainSortConfig.key])
      );
    } else {
      return (
        parseFloat(b[trainSortConfig.key]) - parseFloat(a[trainSortConfig.key])
      );
    }
  });

  return (
    <>
      {/** ---------------------- Different stats content 1 ------------------------- */}
      <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
        {statsData.map((d, k) => {
          return <DashboardStats key={k} {...d} colorIndex={k} />;
        })}
      </div>

      {/** ---------------------- Different charts ------------------------- */}
      {/* <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <LineChart />
                <BarChart />
            </div> */}

      {/** ---------------------- Different stats content 2 ------------------------- */}
      {/* <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
                <AmountStats />
                <PageStats />
            </div> */}

      {/** ---------------------- Test Data Table ------------------------- */}
      <div>
        <TitleCard title="Test Data">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSort("Algorithm")}
                  >
                    Forecasting Algorithm
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSort("Test_SMAPE")}
                  >
                    Test SMAPE
                    {testSortConfig.key === "Test_SMAPE" &&
                      (testSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSort("Test_MAPE")}
                  >
                    Test MAPE
                    {testSortConfig.key === "Test_MAPE" &&
                      (testSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSort("Test_MAE")}
                  >
                    Test MAE
                    {testSortConfig.key === "Test_MAE" &&
                      (testSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSort("Test_RMSE")}
                  >
                    Test RMSE
                    {testSortConfig.key === "Test_RMSE" &&
                      (testSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSort("Test_R2")}
                  >
                    Test R2
                    {testSortConfig.key === "Test_R2" &&
                      (testSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTestData.map((u, k) => (
                  <tr key={k}>
                    <th>{k + 1}</th>
                    <td>{u.Algorithm}</td>
                    <td>{u.Test_SMAPE}</td>
                    <td>{u.Test_MAPE}</td>
                    <td>{u.Test_MAE}</td>
                    <td>{u.Test_RMSE}</td>
                    <td>{u.Test_R2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TitleCard>
      </div>

      {/** ---------------------- Train Data Table ------------------------- */}
      <div className="mt-10">
        <TitleCard title="Train Data" topMargin="mt-2">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Algorithm")}
                  >
                    Forecasting Algorithm
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Train_SMAPE")}
                  >
                    Train SMAPE
                    {trainSortConfig.key === "Train_SMAPE" &&
                      (trainSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Train_MAPE")}
                  >
                    Train MAPE
                    {trainSortConfig.key === "Train_MAPE" &&
                      (trainSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Train_MAE")}
                  >
                    Train MAE
                    {trainSortConfig.key === "Train_MAE" &&
                      (trainSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Train_RMSE")}
                  >
                    Train RMSE
                    {trainSortConfig.key === "Train_RMSE" &&
                      (trainSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Train_R2")}
                  >
                    Train R2
                    {trainSortConfig.key === "Train_R2" &&
                      (trainSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTrainData.map((u, k) => (
                  <tr key={k}>
                    <th>{k + 1}</th>
                    <td>{u.Algorithm}</td>
                    <td>{u.Train_SMAPE}</td>
                    <td>{u.Train_MAPE}</td>
                    <td>{u.Train_MAE}</td>
                    <td>{u.Train_RMSE}</td>
                    <td>{u.Train_R2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TitleCard>
      </div>
    </>
  );
}

export default Dashboard;
