import TitleCard from "../../../components/Cards/TitleCard"

const userSourceData = [
    {Algorithm : "KNN", Test_SMAPE : "45.46%", Train_SMAPE : "0.00%"},
    {Algorithm : "Google Ads", count : "21,341", conversionPercent : 11.7},
    {Algorithm : "Instagram Ads", count : "34,379", conversionPercent : 12.4},
    {Algorithm : "Affiliates", count : "12,359", conversionPercent : 20.9},
    {Algorithm : "Organic", count : "10,345", conversionPercent : 10.3},
]

function UserChannels(){
    return(
        <TitleCard title={"User Signup Source"}>
             {/** Table Data */}
             <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th></th>
                        <th className="normal-case">Forecasting Algorithm</th>
                        <th className="normal-case">Test SMAPE</th>
                        <th className="normal-case">Train SMAPE</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            userSourceData.map((u, k) => {
                                return(
                                    <tr key={k}>
                                        <th>{k+1}</th>
                                        <td>{u.Algorithm}</td>
                                        <td>{u.Test_SMAPE}</td>
                                        <td>{u.Train_SMAPE}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </TitleCard>
    )
}

export default UserChannels