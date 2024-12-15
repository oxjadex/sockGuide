/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LeafIcon } from "lucide-react";
import PriceComparsionValue from "components/PriceComparsionValue";

interface SeasonalFoodListProps {
  selectedMonth: string;
}

interface FoodItem {
  PRDLST_NM: string; // 이름
  IMG_URL?: string; // 이미지
  PRDLST_CL: string; // 식품 분류
  MTC_NM: string; // 산지
  EFFECT: string; // 효능
}

const SeasonalFoodPriceComparison: React.FC<SeasonalFoodListProps> = ({
  selectedMonth,
}) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 제철 음식 데이터 호출
  const fetchSeasonalFoods = async () => {
    const apiKey =
      "40dc7b48ad418f2d49063f0fda9c574054406f5e99b06a59b4f95b0470524c6e";
    const baseUrl = "http://211.237.50.150:7080/openapi";
    const dataType = "json";
    const seasonalFoodsApiUrl = "Grid_20171128000000000572_1";
    const startIndex = 1;
    const endIndex = 20;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${baseUrl}/${apiKey}/${dataType}/${seasonalFoodsApiUrl}/${startIndex}/${endIndex}`,
        { params: { M_DISTCTNS: selectedMonth } }
      );

      const data = response.data?.Grid_20171128000000000572_1?.row || [];
      setFoods(data);
      if (data.length > 0) setSelectedItem(data[0]); // 첫 번째 항목을 기본값으로 설정
    } catch (err) {
      console.error("API 호출 오류:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth) {
      fetchSeasonalFoods();
    }
  }, [selectedMonth]);

  return (
    <div className="rounded-md border border-gray-300 shadow-lg w-full h-112 flex justify-center items-center flex-col p-31 py-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        📂 {selectedMonth}의 제철 음식 정보
      </h2>

      {loading ? (
        <div className="text-center text-gray-500">
          데이터를 불러오는 중입니다...
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div>
          <div className="text-center mb-6">
            <select
              className="w-1/2 p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setSelectedItem(
                  foods.find((item) => item.PRDLST_NM === e.target.value) ||
                    null
                )
              }
              value={selectedItem?.PRDLST_NM || ""}
            >
              {foods.map((food, index) => (
                <option key={index} value={food.PRDLST_NM}>
                  {food.PRDLST_NM}
                </option>
              ))}
            </select>
          </div>
          {selectedItem && (
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <img
                src={selectedItem.IMG_URL || "https://via.placeholder.com/150"}
                alt={selectedItem.PRDLST_NM}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold text-green-700 flex items-center mb-2">
                <LeafIcon size={20} className="mr-2 text-green-500" />
                {selectedItem.PRDLST_NM}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong>분류:</strong> {selectedItem.PRDLST_CL}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>산지:</strong> {selectedItem.MTC_NM}
              </p>
              <p className="text-sm text-gray-600">
                <strong>효능:</strong> {selectedItem.EFFECT}
              </p>
            </div>
          )}
        </div>
      )}
      {selectedItem && (
        <PriceComparsionValue
          selectedMonth="10월"
          itemName={`${selectedItem.PRDLST_NM}, 감자`}
        />
      )}
    </div>
  );
};

export default SeasonalFoodPriceComparison;
