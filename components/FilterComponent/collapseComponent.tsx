import { Collapse } from "antd";
import { FC, ReactNode } from "react";

interface ICollapseComponentProps {
  defaultActiveKeyList: [string] | [];
  customClass?: string;
  children: ReactNode;
  collapseTitle: string;
  itemKey: string;
}
const { Panel } = Collapse;

const CollapseComponent: FC<ICollapseComponentProps> = (props) => {
  const { defaultActiveKeyList, customClass, children, itemKey, collapseTitle } = props;
  return (
    <Collapse
      accordion
      defaultActiveKey={defaultActiveKeyList}
      ghost
      className={`h_filter_collapse_sec ${customClass || ""}`}
    >
      <Panel header={collapseTitle} key={itemKey}>
        {children}
      </Panel>
    </Collapse>
  );
};

CollapseComponent.defaultProps = {
  customClass: "",
};

export default CollapseComponent;
