import React, { useEffect, useState } from "react";
import axios from "axios";
import { LeafIcon, InfoIcon, CookingPotIcon } from "lucide-react";

interface SeasonalFoodListProps {
  selectedMonth: string;
}

interface FoodItem {
  PRDLST_NM: string;
  IMG_URL?: string;
  IDNTFC_NO: string;
  M_DISTCTNS: string;
  M_DISTCTNS_ITM: string;
  PRDLST_CL: string;
  MTC_NM: string;
  PRDCTN__ERA: string;
  MAIN_SPCIES_NM: string;
  EFFECT: string;
  PURCHASE_MTH: string;
  COOK_MTH: string;
  TRT_MTH: string;
  REGIST_DE: string;
  URL: string;
}

const SeasonFood: React.FC<SeasonalFoodListProps> = ({ selectedMonth }) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedFood, setExpandedFood] = useState<string | null>(null);

  const fetchSeasonalFoods = async (month: string) => {
    const apiKey =
      "40dc7b48ad418f2d49063f0fda9c574054406f5e99b06a59b4f95b0470524c6e";
    const dataType = "json";
    const apiUrl = "Grid_20171128000000000572_1";
    const startIndex = 1;
    const endIndex = 10;
    const targetUrl = "http://211.237.50.150:7080/openapi";
    const endPoint = `${targetUrl}/${apiKey}/${dataType}/${apiUrl}/${startIndex}/${endIndex}`;

    const params = {
      M_DISTCTNS: month,
    };

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(endPoint, { params });
      const foodData = response.data?.Grid_20171128000000000572_1?.row || [];
      setFoods(foodData);
    } catch (error) {
      console.error("API 호출 오류:", error);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth) {
      fetchSeasonalFoods(selectedMonth);
    }
  }, [selectedMonth]);

  const toggleFoodDetails = (foodName: string) => {
    setExpandedFood(expandedFood === foodName ? null : foodName);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 animate-pulse">
          제철 농산물을 불러오는 중...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );

  if (foods.length === 0)
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-center">
        <InfoIcon className="mr-2 text-yellow-600" />
        <p className="text-yellow-800">현재 월에 해당하는 데이터가 없습니다.</p>
      </div>
    );

  return (
    <div className="space-y-4">
      {foods.map((food, index) => (
        <div
          key={index}
          className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div
            className="flex items-center p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleFoodDetails(food.PRDLST_NM)}
          >
            <img
              src={food.IMG_URL || "/placeholder-image.png"}
              alt={food.PRDLST_NM}
              className="w-24 h-24 object-cover rounded-md mr-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/placeholder-image.png";
              }}
            />
            <div>
              <h3 className="text-xl font-semibold text-green-800 flex items-center">
                <LeafIcon className="mr-2 text-green-600" size={20} />
                {food.PRDLST_NM}
              </h3>
              <p className="text-gray-600">{food.PRDLST_CL}</p>
            </div>
          </div>

          {expandedFood === food.PRDLST_NM && (
            <div className="p-4 bg-green-50 border-t">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-green-700 mb-2 flex items-center">
                    <InfoIcon className="mr-2 text-green-600" size={18} />
                    농산물 정보
                  </h4>
                  <p>
                    <strong>주요 산지:</strong> {food.MTC_NM}
                  </p>
                  <p>
                    <strong>생산 기간:</strong> {food.PRDCTN__ERA}
                  </p>
                  <p>
                    <strong>주요 품종:</strong> {food.MAIN_SPCIES_NM}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-green-700 mb-2 flex items-center">
                    <CookingPotIcon className="mr-2 text-green-600" size={18} />
                    요리 및 건강 정보
                  </h4>
                  <p>
                    <strong>효능:</strong> {food.EFFECT}
                  </p>
                  <p>
                    <strong>구매 방법:</strong> {food.PURCHASE_MTH}
                  </p>
                  <p>
                    <strong>요리 방법:</strong> {food.COOK_MTH}
                  </p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <a
                  href={food.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 hover:text-green-900 underline flex items-center justify-end"
                >
                  <InfoIcon className="mr-2" size={16} />
                  자세히 보기
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SeasonFood;
