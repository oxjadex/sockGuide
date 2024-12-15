import PriceComparisonTable from "components/PriceComparsion/index";
const Check = () => {
  return (
    <div className="max-w-[640px] mx-auto bg-white h-screen sm:w-full sm:h-screen">
      <PriceComparisonTable selectedMonth="10월" />
    </div>
  );
};

export default Check;
