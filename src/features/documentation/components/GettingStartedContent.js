import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Subtitle from "../../../components/Typography/Subtitle";
import { setPageTitle } from "../../common/headerSlice";

function GettingStartedContent() {
  const dispatch = useDispatch();

  return (
    <>
      <article className="prose">
        <h1 className="">Getting Started</h1>

        {/* Introduction */}
        <h2 className="" id="getstarted1">
          Introduction
        </h2>
        <p>
          Welcome to the <span className="font-bold">Angelite Forecast</span>, a
          dedicated browser-based system designed to forecast student enrollment
          for various college programs at Holy Angel University. This website
          leverages both traditional statistical methods and advanced machine
          learning algorithms to provide accurate and insightful predictions for
          enrollment numbers through key features such as demographic trends,
          historical enrollment data, and economic indicators like the Consumer
          Price Index and Inflation Rate.
        </p>
        <p>
          Our goal is to identify the most effective algorithm for enrollment
          forecasting by comparing the results from traditional and machine
          learning-based models. The system is built to be user-friendly,
          allowing you to easily input relevant data, choose your forecasting
          method, and receive enrollment predictions. Whether you are planning
          for future semesters or assessing the number of enrollees, our
          platform provides the tools you need to forecast enrollment.
        </p>

        {/* How to Use */}
        <h2 id="getstarted2">Website Features</h2>
        <ul>
          <li>
            {" "}
            <span className="font-bold">Light/dark</span> mode toggle
          </li>
          <li> Token based user authentication</li>
          <li>
            {" "}
            <span className="font-bold">Submenu support</span> in sidebar
          </li>
          <li>
            {" "}
            Store management using{" "}
            <span className="font-bold">redux toolkit</span>
          </li>
          <li>
            {" "}
            <span className="font-bold">Daisy UI</span> components
          </li>
          <li>
            {" "}
            <span className="font-bold">Right and left sidebar</span>, Universal
            loader, notifications and other components
          </li>
          <li>
            {" "}
            React <span className="font-bold">chart js 2</span> examples
          </li>
        </ul>

        {/* Tailwind CSS*/}
        <h2 id="getstarted3">Installation</h2>

        <p>
          Just clone the repository from github and then run following command (Make
          sure you have node js installed )<br />
          <a
            href="https://github.com/srobbin01/daisyui-admin-dashboard-template"
            className="text-sm text-blue-500"
            target="_blank"
          >
            Repository Link
          </a>
          <br />
          <code>npm install</code>
          <br />
          <code>npm start</code>
        </p>

{/*         <h4> Core libraries used - </h4>
        <ul>
          <li>
            <a href="https://reactjs.org/" target="_blank">
              React JS v18.2.0
            </a>
          </li>
          <li>
            <a href="https://reactrouter.com/en/main" target="_blank">
              React Router v6.4.3
            </a>
          </li>
          <li>
            <a href="https://tailwindcss.com/" target="_blank">
              Tailwind CSS v3.3.6
            </a>
          </li>
          <li>
            <a href="https://daisyui.com/" target="_blank">
              Daisy UI v4.4.19
            </a>
          </li>
          <li>
            <a href="https://heroicons.com/" target="_blank">
              HeroIcons v2.0.13
            </a>
          </li>
          <li>
            <a href="https://redux-toolkit.js.org/" target="_blank">
              Redux toolkit v1.9.0
            </a>
          </li>
          <li>
            <a href="https://react-chartjs-2.js.org/" target="_blank">
              React ChartJS 2 v5.0.1
            </a>
          </li>
        </ul> */}

        {/* Daisy UI */}
        <h2 id="getstarted4">How to use?</h2>
        <div class="carousel w-full">
          <div id="item1" class="carousel-item w-full">
          <div class="card bg-secondary w-100">
              <div class="card-body">
                <h2 class="card-title">Step 1: Access The Dashboard</h2>
                <p>
                  Upon logging into the website, you will be directed to the
                  main dashboard. Here, you can view an overview of the current
                  forecasting data and trends.
                </p>
              </div>
            </div>
          </div>
          <div id="item2" class="carousel-item w-full">
            <div class="card bg-secondary w-100">
              <div class="card-body">
                <h2 class="card-title">Step 2: Input Data</h2>
                <p>
                  Navigate to the "Data Input" section where you can upload or
                  manually enter relevant data such as historical enrollment
                  numbers, demographic information, and economic indicators
                  (e.g., CPI, Inflation Rate).
                </p>
              </div>
            </div>
          </div>
          <div id="item3" class="carousel-item w-full">
            <div class="card bg-base-100 w-100">
              <div class="card-body">
                <h2 class="card-title">Step 3: Choose Forecasting Algorithm</h2>
                <p>
                  Traditional Statistical Methods: Select this option to use
                  conventional forecasting techniques, includes exponential
                  smoothing algorithm and Dean's Prediction. Machine Learning
                  Algorithms: Choose from various machine learning models,
                  including Random Forest, to generate predictions based on
                  complex patterns in the data.
                </p>
              </div>
            </div>
          </div>
          <div id="item4" class="carousel-item w-full">
            <div class="card bg-base-100 w-100">
              <div class="card-body">
                <h2 class="card-title">Step 4: Run Forecast</h2>
                <p>
                  Once your data is inputted and the forecasting method is
                  selected, click on the "Run Forecast" button. The system will
                  process the data and generate enrollment predictions.
                </p>
              </div>
            </div>
          </div>
          <div id="item5" class="carousel-item w-full">
            <div class="card bg-base-100 w-100">
              <div class="card-body">
                <h2 class="card-title">Step 5: Analyze Results</h2>
                <p>
                  After the forecast is complete, you can view the results in
                  the "Forecast Results" section. The predictions will be
                  displayed alongside key performance metrics, allowing you to
                  compare the effectiveness of different forecasting methods.
                </p>
              </div>
            </div>
          </div>
          <div id="item6" class="carousel-item w-full">
            <div class="card bg-base-100 w-100">
              <div class="card-body">
                <h2 class="card-title">Step 6: Download and Export</h2>
                <p>
                  If needed, you can download the forecast results in various
                  formats (e.g., CSV, PDF) for further analysis or presentation.
                </p>
              </div>
            </div>
          </div>
          <div id="item7" class="carousel-item w-full">
            <div class="card bg-base-100 w-100">
              <div class="card-body">
                <h2 class="card-title">Step 7: Evaluation and Feedback</h2>
                <p>
                  Use the "Evaluation" section to assess the quality of the
                  forecasting models based on the ISO/IEC 25010 software quality
                  model standard. You can provide feedback to improve future
                  predictions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex w-full justify-center gap-2 py-2">
          <a href="#item1" class="btn btn-m">
            1
          </a>
          <a href="#item2" class="btn btn-m">
            2
          </a>
          <a href="#item3" class="btn btn-m">
            3
          </a>
          <a href="#item4" class="btn btn-m">
            4
          </a>
          <a href="#item5" class="btn btn-m">
            5
          </a>
          <a href="#item6" class="btn btn-m">
            6
          </a>
          <a href="#item7" class="btn btn-m">
            7
          </a>
        </div>

        {/* Chart JS */}
        <h2 id="getstarted5">Forecasting Algorithms</h2>
      </article>
    </>
  );
}

export default GettingStartedContent;
