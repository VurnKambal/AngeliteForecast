import React from 'react';
import TitleCard from "../../../components/Cards/TitleCard";
function MetricsDescriptionCard() {
  return (
    <TitleCard title="Metrics Description">
      <div className="space-y-2">
        <div>
          <h3 className="font-semibold">SMAPE (Symmetric Mean Absolute Percentage Error)</h3>
          <p>Measures the percentage difference between predicted and actual values, accounting for both positive and negative errors.</p>
        </div>
        <div>
          <h3 className="font-semibold">MAPE (Mean Absolute Percentage Error)</h3>
          <p>Calculates the average percentage difference between predicted and actual values.</p>
        </div>
        <div>
          <h3 className="font-semibold">MAE (Mean Absolute Error)</h3>
          <p>Measures the average magnitude of errors in a set of predictions, without considering their direction.</p>
        </div>
        <div>
          <h3 className="font-semibold">RMSE (Root Mean Square Error)</h3>
          <p>Represents the standard deviation of the residuals (prediction errors), giving higher weight to larger errors.</p>
        </div>
        <div>
          <h3 className="font-semibold">R2 (Coefficient of Determination)</h3>
          <p>Indicates the proportion of the variance in the dependent variable that is predictable from the independent variable(s).</p>
        </div>
      </div>
    </TitleCard>
  );
}
export default MetricsDescriptionCard;