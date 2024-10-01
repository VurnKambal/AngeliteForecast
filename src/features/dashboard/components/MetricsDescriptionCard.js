import React from 'react';
import TitleCard from "../../../components/Cards/TitleCard";
function MetricsDescriptionCard() {
  return (
    <TitleCard title="Metrics Description">
      <div className="space-y-2">
        <div>
          <h3 className="font-semibold">SMAPE (Symmetric Mean Absolute Percentage Error)</h3>
          <p>- Shows the average difference between predicted and actual values, treating both overestimates and underestimates equally.</p>
        </div>
        <div>
          <h3 className="font-semibold">MAPE (Mean Absolute Percentage Error)</h3>
          <p>- Shows the average error as a percentage of the actual values, helping to understand mistakes in relation to real data.</p>
        </div>
        <div>
          <h3 className="font-semibold">MAE (Mean Absolute Error)</h3>
          <p>- Measures the average size of mistakes, without considering whether the prediction was too high or too low.</p>
        </div>
        <div>
          <h3 className="font-semibold">RMSE (Root Mean Square Error)</h3>
          <p>- Measures the average size of the mistakes, giving more importance to bigger errors.</p>
        </div>
        <div>
          <h3 className="font-semibold">R2 (Coefficient of Determination)</h3>
          <p>- Shows how well the model’s predictions match the real data, where 1 means perfect accuracy.</p>
        </div>
      </div>
    </TitleCard>
  );
}
export default MetricsDescriptionCard;