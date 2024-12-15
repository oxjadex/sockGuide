/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import axios from "axios";

interface SeasonalFoodListProps {
  selectedMonth: string;
  itemName: string; // 쉼표로 여러 값을 받을 수 있음 ("쌀, 감자")
}

interface FoodItem {
  PRDLST_NM: string;
  unit: string;
  dpr1: string;
  dpr5: string;
  dpr6: string;
  dpr7: string;
}

const PriceComparisonValue: React.FC<SeasonalFoodListProps> = ({
  itemName,
  selectedMonth,
}) => {
  const [selectedItems, setSelectedItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (item: string) => {
    const apiKeyForPrices = "72022e48-2028-4036-b462-e798246b67a1";
    const pricesApiUrl =
      "https://www.kamis.or.kr/service/price/xml.do?action=dailyPriceByCategoryList";
    const selectedDate = `${new Date().getFullYear()}-${selectedMonth
      .replace("월", "")
      .padStart(2, "0")}-15`;

    const params = {
      p_cert_key: apiKeyForPrices,
      p_cert_id: "5020",
      p_returntype: "json",
      p_product_cls_code: "01",
      p_item_category_code: "100",
      p_country_code: "2100",
      p_regday: selectedDate,
      p_convert_kg_yn: "Y",
    };

    try {
      const response = await axios.get(pricesApiUrl, { params });
      const data = response.data.data.item;

      const foundItem = data.find(
        (food: any) => food.item_name === item.trim()
      );

      if (foundItem) {
        return foundItem;
      }
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    }
    return null;
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    const items = itemName.split(","); // 쉼표로 나눠서 처리
    const promises = items.map((item) => fetchData(item));

    try {
      const results = await Promise.all(promises);
      const validResults = results.filter((item) => item !== null);
      setSelectedItems(validResults);
    } catch (error) {
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (itemName) {
      fetchAllData();
    }
  }, [itemName]);

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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full">
      {selectedItems.length > 0 ? (
        selectedItems.map((item, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-xl font-bold text-center mb-4">
              {item.PRDLST_NM} 가격 변동
            </h2>
            <table className="w-full border-collapse">
              <tbody>
                {[
                  { label: "현재", price: item.dpr1 },
                  { label: "전월", price: item.dpr5 },
                  { label: "전년", price: item.dpr6 },
                  { label: "평년", price: item.dpr7 },
                ].map((period, i, arr) => {
                  const change =
                    i > 0
                      ? calculatePriceChange(period.price, arr[i - 1].price)
                      : null;

                  return (
                    <tr key={period.label} className="border-b">
                      <td className="p-2 font-semibold">{period.label}</td>
                      <td className="p-2 text-right">
                        {item.unit} / {period.price}
                      </td>
                      <td className="p-2 text-right">
                        {change ? (
                          <span
                            className={
                              change.startsWith("-")
                                ? "text-red-500"
                                : "text-green-500"
                            }
                          >
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
          </div>
        ))
      ) : (
        <div>선택된 항목의 데이터가 없습니다.</div>
      )}
    </div>
  );
};

export default PriceComparisonValue;
