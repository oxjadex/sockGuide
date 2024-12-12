import Fruits from "assets/fruits.svg";

const ImageFlowing = () => {
  return (
    <div className="bg-white w-full overflow-hidden relative flex flex-row gap-3">
      <div className="animate-slideHorizontalTop">
        <img src={Fruits} alt="Fruits" className="max-w-none max-h-none" />
      </div>
      <div className="animate-slideHorizontalBottom">
        <img src={Fruits} alt="Fruits" className="max-w-none max-h-none" />
      </div>
    </div>
  );
};

export default ImageFlowing;
