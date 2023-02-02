import { Collapse } from "antd";
import { FC, ReactNode } from "react";

interface ICollapseComponentProps {
  defaultActiveKeyList: [string] | [];
  customClass?: string;
  children: ReactNode;
  collapseTitle: string;
  itemKey: string;
  visiblePanel: boolean;
}
const { Panel } = Collapse;

const CollapseComponent: FC<ICollapseComponentProps> = (props) => {
  const { defaultActiveKeyList, visiblePanel, customClass, children, itemKey, collapseTitle } = props;
  return (
    <Collapse
      accordion
      defaultActiveKey={defaultActiveKeyList}
      ghost
      className={`${visiblePanel ? "h_filter_collapse_sec" : ""} ${customClass || ""}`}
    >
      {visiblePanel ? (
        <Panel header={collapseTitle} key={itemKey}>
          {children}
        </Panel>
      ) : null}
    </Collapse>
  );
};

CollapseComponent.defaultProps = {
  customClass: "",
};

export default CollapseComponent;
