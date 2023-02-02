import { Pagination, PaginationProps } from "antd";
import { memo } from "react";

import s from "./pagination.module.less";

interface PaginationComponentProps {
  totalRecords: number;
  handlePageChange: (page: number, pageSize: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = (props) => {
  const { handlePageChange, totalRecords } = props;

  // Event methods
  const onChange: PaginationProps["onChange"] = (page: number, pageSize: number) => {
    handlePageChange(page, pageSize);
  };

  return (
    <Pagination
      defaultCurrent={1}
      total={totalRecords}
      responsive
      // size="small"
      className={s.h_pagination}
      showTotal={(total) => `Total ${total} items`}
      onChange={onChange}
    />
  );
};

export default memo(PaginationComponent);
