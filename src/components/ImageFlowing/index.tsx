import Fruits from "assets/fruit.svg";

const ImageFlowing = () => {
  return (
    <div className="bg-white overflow-hidden relative flex flex-row gap-3">
      <div className="animate-slideHorizontalTop">
        <img src={Fruits} alt="Fruits" className="object-fill" />
      </div>
      <div className="animate-slideHorizontalBottom">
        <img src={Fruits} alt="Fruits" className="object-fill" />
      </div>
    </div>
  );
};

export default ImageFlowing;
