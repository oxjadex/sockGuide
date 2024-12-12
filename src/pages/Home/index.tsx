import ImageFlowing from "components/ImageFlowing";
import Main from "assets/main.svg";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[640px] mx-auto bg-white h-screen sm:w-full sm:h-screen">
      <div className="py-6 flex justify-between h-full flex-col box-border">
        <ImageFlowing />
        <div className="flex justify-center flex-col items-center gap-12">
          <img src={Main} className="w-80"></img>
          <div className="text-center">
            계절에 맞는 신선한 식재료를 활용하면 영양가가 높고 맛도 좋습니다!
            <br />
            자취생들의 건강한 식단을 위하여!
          </div>
          <button
            onClick={() => {
              navigate("/check");
            }}
            className="border-solid border rounded-3xl border-[#D9D9D9] py-3 px-28 active:bg-[#EFEFEF]"
          >
            지금 확인하러 가기
          </button>
        </div>
        <ImageFlowing />
      </div>
    </div>
  );
};

export default Home;
