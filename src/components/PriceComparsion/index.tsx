/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Main from "assets/main.svg";
import SeasonFood from "components/SeasonFood/index";

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

    return change.toFixed(2); // 퍼센트 기호 제거
  };

  const calculateAdjustedPrice = (base: string, adjustment: string): string => {
    const basePrice = parseFloat(base.replace(/,/g, "")); // 평년가
    const adjPrice = parseFloat(adjustment.replace(/,/g, "")); // dpr 값
    if (adjPrice < 3000)
      return (basePrice + adjPrice).toLocaleString("ko-KR"); // 합산 후 표시
    else if (adjPrice < 40000)
      return (20000 + adjPrice).toLocaleString("ko-KR");
    return adjPrice.toLocaleString("ko-KR");
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg max-w-4xl mx-auto px-20 py-4 w-full overflow-auto h-full">
      <div className="text-center mb-16">
        <div>
          <div className="flex justify-center py-2 items-center flex-col gap-20">
            <div> 📂 11월의 제철 음식 및 가격 변동 사항입니다.</div>
            <img src={Main} className="w-80"></img>
          </div>
        </div>
        <div>
          <div className="flex justify-center py-2 items-center flex-col">
            <div className="text-left">
              11월의 제철 식재료, 그 맛과 가격 이야기! 🍽️ <br />
              두릅부터 시작해볼까요? 10월, 청경채은 제철을 맞아 가장 맛있고
              영양가 높은 시기입니다. 미역은 더욱 특별해요. 전월 대비 무려 67%
              가격이 높은 시기입니다. 쌀은 더욱 특별해요. 전월 대비 무려 67%
              가격이 떨어져 1kg당 평균 1,983원에 구매 가능합니다. 입맛과 지갑을
              모두 만족시키는 11월의 식탁, 지금 바로 즐겨보세요! 만족시키는
              11월의 식탁, 지금 바로 즐겨보세요! 🌿🌊
            </div>
          </div>
        </div>
      </div>
      {selectedItem ? (
        <div className="rounded-md border border-gray-300 shadow-lg w-full h-112 flex justify-center items-center flex-col p-31 py-8">
          <div className="text-[60px] font-medium leading-[68px]">🛎️</div>
          <div className="text=[24px]  text-center font-pretendard  font-bold leading-[28px]">
            10월 쌀의
            <br />
            가격 변동
          </div>
          <table className="w-full border-collapse">
            <tbody>
              {[
                { label: "현재", price: selectedItem.dpr1 },
                { label: "전월", price: selectedItem.dpr5 },
                { label: "전년", price: selectedItem.dpr6 },
                { label: "평년", price: selectedItem.dpr7 },
              ].map((period, index, arr) => {
                const adjustedPreviousPrice = calculateAdjustedPrice(
                  selectedItem.dpr7,
                  selectedItem.dpr1
                );

                const adjustedCurrentPrice = calculateAdjustedPrice(
                  selectedItem.dpr7,
                  period.price
                );

                const change = adjustedPreviousPrice
                  ? calculatePriceChange(
                      adjustedCurrentPrice,
                      adjustedPreviousPrice
                    )
                  : null;

                return (
                  <div
                    key={period.label}
                    className="px-12 flex justify-between"
                  >
                    <td className="p-3  font-bold">{period.label}</td>
                    <div className="p-4 text-right flex flex-col flex-start">
                      {selectedItem.unit} /
                      {calculateAdjustedPrice(selectedItem.dpr7, period.price)}{" "}
                      <div className="text-left">
                        {change ? (
                          <span className="text-[#50ABB0]">등락 {change}%</span>
                        ) : (
                          "-"
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div>쌀 데이터가 존재하지 않습니다.</div>
      )}
      <div className="my-8 text-center ext-black font-[Pretendard] text-base not-italic font-medium leading-6">
        다른 식재료들의 가격도 궁금할 당신을 위해 준비했어요
      </div>
      <div>
        <SeasonFood selectedMonth="10월" />
      </div>
    </div>
  );
};

export default SeasonalFoodPriceComparison;
