import { memo } from "react";
import Rating from "react-rating";
import InlineSVG from "svg-inline-react";

import { emptyStar, filledStar } from "@/utils/allSvgs";

import s from "./rating.module.less";

interface IRatngComponentProps {
  rating: number;
  // eslint-disable-next-line react/no-unused-prop-types
  isBigStar?: boolean;
  readOnly?: boolean;
  onChangeRating?: (value: any) => void;
}
const RatingComponent = (props: IRatngComponentProps) => {
  const { onChangeRating, rating, readOnly } = props;
  const handleRatingChange = async (value: any) => {
    if (onChangeRating) {
      onChangeRating(value);
    }
  };

  // let isStarReadOnly = readOnly | true;
  // if (isStarReadOnly || isStarReadOnly === false) {
  //   isStarReadOnly = false;
  // }
  return (
    <Rating
      emptySymbol={
        <div className={s.h_star}>
          <InlineSVG src={emptyStar} />
        </div>
      }
      fullSymbol={
        <div className={s.h_star}>
          <InlineSVG src={filledStar} />
        </div>
      }
      onHover={handleRatingChange}
      onClick={handleRatingChange}
      readonly={readOnly}
      initialRating={rating || 0}
    />
  );
};

RatingComponent.defaultProps = {
  readOnly: true,
  isBigStar: false,
  onChangeRating: () => {},
};

export default memo(RatingComponent);
