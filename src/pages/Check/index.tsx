import PriceComparisonTable from "components/PriceComparsion/index";
import SeasonFood from "components/SeasonFood";
const Check = () => {
  return (
    <div>
      <PriceComparisonTable selectedMonth="2"></PriceComparisonTable>
      <SeasonFood selectedMonth="3월"></SeasonFood>
    </div>
  );
};

export default Check;
