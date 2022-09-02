import React from "react";

import FreelancersController from "@/lib/freelancers/freelancesController";

const FreelancerDetail: React.FC = () => <FreelancersController viewType="freelancerDetail" />;

// export const getServerSideProps: GetServerSideProps = async (context: any) => {
//   const freelancerId = context?.query?.freelancerId;
//   const freelancerData = await asyncGetFreelancerDetails(freelancerId);
//   return {
//     props: {
//       freelancerData: freelancerData?.data?.data || null,
//     }, // will be passed to the page component as props
//   };
// };

export default FreelancerDetail;
