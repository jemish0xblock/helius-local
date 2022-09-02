import { Pagination, PaginationProps } from "antd";
import { memo } from "react";

import s from "./pagination.module.less";

interface PaginationComponentProps {
  totalRecords: number;
  pageSize: number;
  handlePageChange: (page: number, isInitialCall?: boolean) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = (props) => {
  const { handlePageChange, totalRecords, pageSize } = props;

  // Event methods
  const onChange: PaginationProps["onChange"] = (_page) => {
    handlePageChange(_page, false);
  };

  return (
    <Pagination
      defaultCurrent={1}
      total={totalRecords}
      responsive
      // size="small"
      pageSize={pageSize}
      className={s.h_pagination}
      showTotal={(total) => `Total ${total} items`}
      onChange={onChange}
    />
  );
};

export default memo(PaginationComponent);
