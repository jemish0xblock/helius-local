import React from "react";

const ProposalContext = React.createContext<any>({});

export const ProposalProvider = ProposalContext.Provider;

export default ProposalContext;
