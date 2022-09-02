import Image from "next/image";
import { useState, useEffect, FC } from "react";

import { staticImagesUrl } from "@utils/constants";

interface IImageProps {
  url: string | any;
  width?: number;
  height?: number;
  className?: string;
}
const NextImageComponentWithUpdate: FC<IImageProps> = (props) => {
  // States & props
  const { url, width, height, className } = props;

  const [imgUrl, setUrl] = useState(url || staticImagesUrl.siteLogo);
  const [isError, setIsError] = useState(!url);

  // Life cycle methods
  useEffect(() => {
    if (url !== imgUrl) {
      setUrl(url);
    }
  }, [imgUrl, props, url]);
  // console.log(url, "imag", imgUrl, isError, !url);
  // Event Methods
  const onError = () => {
    setIsError(true);
  };
  const myLoader = () => `${imgUrl}`;
  const setDefaultImage = () => "img/siteLogo.png";

  return (
    <Image
      loader={myLoader}
      src={isError ? setDefaultImage() : imgUrl}
      alt=""
      width={width}
      height={height}
      className={`imgCover ${className || ""}`}
      layout="fill"
      onError={onError}
    />
  );
};

NextImageComponentWithUpdate.defaultProps = {
  width: 200,
  height: 200,
  className: "",
};

export default NextImageComponentWithUpdate;
