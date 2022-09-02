import React, { ReactElement, ReactNode } from "react";

export interface IRenderIfProps {
  isTrue: boolean;
  children: ReactNode;
}

const RenderIf: React.FC<IRenderIfProps> = ({ isTrue, children }) => (isTrue ? (children as ReactElement<any>) : null);

export default RenderIf;
