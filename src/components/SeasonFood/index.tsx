import React, { useEffect, useState } from "react";
import axios from "axios";

interface SeasonalFoodListProps {
  selectedMonth: string;
}

interface FoodItem {
  PRDLST_NM: string; // 제품 이름
  IMG_URL?: string; // 이미지 URL
  IDNTFC_NO: string; // 식별 번호
  M_DISTCTNS: string; // 월별
  M_DISTCTNS_ITM: string; // 월별 항목
  PRDLST_CL: string; // 분류
  MTC_NM: string; // 주요 산지
  PRDCTN__ERA: string; // 생산 기간
  MAIN_SPCIES_NM: string; // 주요 품종
  EFFECT: string; // 효능
  PURCHASE_MTH: string; // 구매 방법
  COOK_MTH: string; // 요리 방법
  TRT_MTH: string; // 손질 방법
  REGIST_DE: string; // 등록일
  URL: string; // 자세히 보기 링크
}

const SeasonFood: React.FC<SeasonalFoodListProps> = ({ selectedMonth }) => {
  const [foods, setFoods] = useState<FoodItem[]>([]); // 제철 농산물 데이터
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  const fetchSeasonalFoods = async (month: string) => {
    const apiKey =
      "40dc7b48ad418f2d49063f0fda9c574054406f5e99b06a59b4f95b0470524c6e"; // API 키 입력
    const dataType = "json";
    const apiUrl = "Grid_20171128000000000572_1";
    const startIndex = 1;
    const endIndex = 10;
    const targetUrl = "http://211.237.50.150:7080/openapi";
    const endPoint = `${targetUrl}/${apiKey}/${dataType}/${apiUrl}/${startIndex}/${endIndex}`;

    const params = {
      M_DISTCTNS: month, // 선택한 월
    };

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(endPoint, { params });
      const foodData = response.data?.Grid_20171128000000000572_1?.row || [];
      setFoods(foodData); // 데이터를 상태에 저장
    } catch (error) {
      console.error("API 호출 오류:", error);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth) {
      fetchSeasonalFoods(selectedMonth); // 선택한 월로 데이터 가져오기
    }
  }, [selectedMonth]);

  // 로딩 상태 처리
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (foods.length === 0) return <p>현재 월에 해당하는 데이터가 없습니다.</p>;

  // 제철 농산물 리스트 렌더링
  return (
    <div>
      <h2>제철 농산물 리스트</h2>
      <div>
        {foods.map((food, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>{food.PRDLST_NM}</h3>
            <img
              src={food.IMG_URL || "/placeholder-image.png"}
              alt={food.PRDLST_NM}
              style={{ width: "200px", height: "150px", objectFit: "cover" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/placeholder-image.png";
              }}
            />
            <p>
              <strong>식별 번호:</strong> {food.IDNTFC_NO}
            </p>
            <p>
              <strong>월별:</strong> {food.M_DISTCTNS}
            </p>
            <p>
              <strong>월별 항목:</strong> {food.M_DISTCTNS_ITM}
            </p>
            <p>
              <strong>분류:</strong> {food.PRDLST_CL}
            </p>
            <p>
              <strong>주요 산지:</strong> {food.MTC_NM}
            </p>
            <p>
              <strong>생산 기간:</strong> {food.PRDCTN__ERA}
            </p>
            <p>
              <strong>주요 품종:</strong> {food.MAIN_SPCIES_NM}
            </p>
            <p>
              <strong>효능:</strong> {food.EFFECT}
            </p>
            <p>
              <strong>구매 방법:</strong> {food.PURCHASE_MTH}
            </p>
            <p>
              <strong>요리 방법:</strong> {food.COOK_MTH}
            </p>
            <p>
              <strong>손질 방법:</strong> {food.TRT_MTH}
            </p>
            <p>
              <strong>등록일:</strong> {food.REGIST_DE}
            </p>
            <a href={food.URL} target="_blank" rel="noopener noreferrer">
              자세히 보기
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonFood;
