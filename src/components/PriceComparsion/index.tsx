/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LeafIcon,
  InfoIcon,
  CookingPotIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "lucide-react";
import Main from "assets/main.svg";

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
  unit: string;
  day1: string;
  day2: string;
  day3: string;
  day4: string;
  day5: string;
  day6: string;
  day7: string;
  dpr1: string;
  dpr2: string;
  dpr3: string;
  dpr4: string;
  dpr5: string;
  dpr6: string;
  dpr7: string;
}

interface Period {
  label: string;
  day: keyof FoodItem;
  dpr: keyof FoodItem;
}

const SeasonalFoodPriceComparison: React.FC<SeasonalFoodListProps> = ({
  selectedMonth,
}) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [expandedFood, setExpandedFood] = useState<string | null>(null);

  const fetchData = async (month: string) => {
    const apiKeyForSeasonalFoods =
      "40dc7b48ad418f2d49063f0fda9c574054406f5e99b06a59b4f95b0470524c6e";
    const apiKeyForPrices = "72022e48-2028-4036-b462-e798246b67a1";
    const dataType = "json";
    const seasonalFoodsApiUrl = "Grid_20171128000000000572_1";
    const pricesApiUrl =
      "https://www.kamis.or.kr/service/price/xml.do?action=dailyPriceByCategoryList";
    const startIndex = 1;
    const endIndex = 10;
    const targetUrl = "http://211.237.50.150:7080/openapi";
    const seasonalFoodsEndPoint = `${targetUrl}/${apiKeyForSeasonalFoods}/${dataType}/${seasonalFoodsApiUrl}/${startIndex}/${endIndex}`;
    const selectedDate = `${new Date().getFullYear()}-${String(month.replace("월", "").trim()).padStart(2, "0")}-01`;

    const pricesParams = {
      p_cert_key: apiKeyForPrices,
      p_cert_id: "5020",
      p_returntype: "json",
      p_product_cls_code: "01",
      p_item_category_code: "100",
      p_country_code: "2100",
      p_regday: selectedDate,
      p_convert_kg_yn: "Y",
    };

    setLoading(true);
    setError(null);

    try {
      const [seasonalFoodsResponse, pricesResponse] = await Promise.all([
        axios.get(seasonalFoodsEndPoint, { params: { M_DISTCTNS: month } }),
        axios.get(pricesApiUrl, { params: pricesParams }),
      ]);

      const seasonalFoodsData =
        seasonalFoodsResponse.data?.Grid_20171128000000000572_1?.row || [];
      const pricesData = pricesResponse.data.data.item;

      const combinedData = seasonalFoodsData.map((food: any) => ({
        ...food,
        ...pricesData.find((item: any) => item.item_name === food.PRDLST_NM),
      }));

      setFoods(combinedData);
      setSelectedItem(combinedData[0]);
    } catch (error) {
      console.error("API 호출 오류:", error);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth) {
      fetchData(selectedMonth);
    }
  }, [selectedMonth]);

  const calculatePriceChange = (
    current: string | undefined,
    previous: string | undefined
  ): number | null => {
    if (!current || !previous) return null;
    const change =
      ((parseFloat(current) - parseFloat(previous)) / parseFloat(previous)) *
      100;
    return change;
  };

  const renderPriceChangeIndicator = (change: number | null) => {
    if (change === null) return null;
    return (
      <span
        className={`ml-2 flex items-center ${
          change >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {change >= 0 ? (
          <ChevronUpIcon size={16} />
        ) : (
          <ChevronDownIcon size={16} />
        )}
        {Math.abs(change).toFixed(1)}%
      </span>
    );
  };

  const periods: Period[] = [
    { label: "현재", day: "day1", dpr: "dpr1" },
    { label: "1일 전", day: "day2", dpr: "dpr2" },
    { label: "1주일 전", day: "day3", dpr: "dpr3" },
    { label: "2주일 전", day: "day4", dpr: "dpr4" },
    { label: "1개월 전", day: "day5", dpr: "dpr5" },
    { label: "1년 전", day: "day6", dpr: "dpr6" },
    { label: "평년", day: "day7", dpr: "dpr7" },
  ];

  const toggleFoodDetails = (foodName: string) => {
    setExpandedFood(expandedFood === foodName ? null : foodName);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        {error}
      </div>
    );
  }

  if (!foods || foods.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        월을 선택하여 데이터를 불러와 주세요.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto px-14">
      <div>
        <div className="flex justify-center py-2 items-center flex-col gap-20">
          <div> 📂 11월의 제철 음식 및 가격 변동 사항입니다.</div>
          <img src={Main} className="w-80"></img>
        </div>
      </div>
      <div>
        <div className="flex justify-center py-2 items-center flex-col">
          <div>
            11월의 제철 식재료, 그 맛과 가격 이야기! 🍽️ <br />
            두릅부터 시작해볼까요? 10월, 청경채은 제철을 맞아 가장 맛있고 영양가
            높은 시기입니다. 미역은 더욱 특별해요. 전월 대비 무려 67% 가격이
            떨어져 1kg당 평균 1,983원에 구매 가능합니다. 입맛과 지갑을 모두
            만족시키는 11월의 식탁, 지금 바로 즐겨보세요!
          </div>
        </div>
        <select
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
          onChange={(e) =>
            setSelectedItem(
              foods.find((item) => item.PRDLST_NM === e.target.value) || null
            )
          }
          value={selectedItem?.PRDLST_NM || ""}
        ></select>
        <table className="w-full">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기준
              </th>
              <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                가격
              </th>
              <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                변동률
              </th>
            </tr>
          </thead>
          <tbody>
            {periods.map((period, index) => {
              const currentPrice = selectedItem?.[period.dpr];
              const previousPrice =
                index > 0 ? selectedItem?.[periods[index - 1].dpr] : undefined;

              const priceChange = calculatePriceChange(
                currentPrice,
                previousPrice
              );

              return (
                <tr
                  key={period.label}
                  className="border-b hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="p-3 text-gray-700">
                    {period.label} ({selectedItem?.[period.day]})
                  </td>
                  <td className="p-3 text-right font-semibold text-gray-900">
                    {currentPrice} {selectedItem?.unit}
                  </td>
                  <td className="p-3 text-right">
                    {renderPriceChangeIndicator(priceChange)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 p-4">
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
                      <CookingPotIcon
                        className="mr-2 text-green-600"
                        size={18}
                      />
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
    </div>
  );
};

export default SeasonalFoodPriceComparison;
