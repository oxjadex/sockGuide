/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
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

const SeasonalFoodPriceComparison: React.FC<SeasonalFoodListProps> = ({
  selectedMonth,
}) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    const apiKeyForPrices = "72022e48-2028-4036-b462-e798246b67a1";
    const pricesApiUrl =
      "https://www.kamis.or.kr/service/price/xml.do?action=dailyPriceByCategoryList";
    const selectedDate = `${new Date().getFullYear()}-10-15`; // 10월 기준

    const params = {
      p_cert_key: apiKeyForPrices,
      p_cert_id: "5020",
      p_returntype: "json",
      p_product_cls_code: "01",
      p_item_category_code: "100", // 곡류
      p_country_code: "2100",
      p_regday: selectedDate,
      p_convert_kg_yn: "Y",
    };

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(pricesApiUrl, { params });
      const riceItem = response.data.data.item.find(
        (item: any) => (item: any) =>
          item.item_name === "쌀" && item.kind_name === "20kg(1kg)"
      );

      if (riceItem) {
        setSelectedItem(riceItem); // 쌀 데이터 고정 설정
        setFoods([riceItem]); // 쌀만 목록에 저장
      }
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculatePriceChange = (
    current: string,
    previous: string
  ): string | null => {
    if (!current || !previous || parseFloat(previous) === 0) return null;
    const currentValue = parseFloat(current.replace(/,/g, ""));
    const previousValue = parseFloat(previous.replace(/,/g, ""));
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return change.toFixed(2);
  };

  const calculateAdjustedPrice = (base: string, adjustment: string): string => {
    const basePrice = parseFloat(base.replace(/,/g, "")); // 평년가
    const adjPrice = parseFloat(adjustment.replace(/,/g, "")); // dpr 값
    if (adjPrice < 3000) return (basePrice + adjPrice).toLocaleString("ko-KR"); // 합산 후 표시
    return basePrice.toLocaleString("ko-KR");
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg max-w-4xl mx-auto p-8">
      <div className="text-center mb-6">
        <div className="text-2xl font-bold mb-2">10월 쌀의 가격 변동</div>
      </div>
      {selectedItem ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">기준</th>
              <th className="p-3 text-right">가격</th>
              <th className="p-3 text-right">변동률</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "현재", price: selectedItem.dpr1 },
              { label: "전월", price: selectedItem.dpr2 },
              { label: "전년", price: selectedItem.dpr6 },
              { label: "평년", price: selectedItem.dpr7 },
            ].map((period, index, arr) => {
              const previousPrice =
                index > 0 ? arr[index - 1].price : undefined;
              const change = previousPrice
                ? calculatePriceChange(period.price, previousPrice)
                : null;

              return (
                <tr key={period.label} className="border-b">
                  <td className="p-3">{period.label}</td>
                  <td className="p-2 text-right font-bold text-blue-600">
                    {calculateAdjustedPrice(selectedItem.dpr7, period.price)}{" "}
                    {selectedItem.unit}
                  </td>
                  <td className="p-3 text-right">
                    {change ? (
                      <span
                        className={`flex items-center justify-end ${
                          parseFloat(change) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {parseFloat(change) >= 0 ? (
                          <ChevronUpIcon size={16} />
                        ) : (
                          <ChevronDownIcon size={16} />
                        )}
                        {change}%
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div>쌀 데이터가 존재하지 않습니다.</div>
      )}
    </div>
  );
};

export default SeasonalFoodPriceComparison;
