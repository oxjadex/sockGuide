import Fruits from "assets/fruites.svg";

const ImageFlowing = () => {
  return (
    <div className="bg-white overflow-hidden relative w-full">
      <div className="animate-slide-horizontal w-full flex flex-row">
        <img
          src={Fruits}
          alt="Fruits"
          className="w-full object-cover h-[60px]"
        />
        <img
          src={Fruits}
          alt="Fruits"
          className="w-full object-cover h-[60px]"
        />
      </div>
    </div>
  );
};

export default ImageFlowing;
