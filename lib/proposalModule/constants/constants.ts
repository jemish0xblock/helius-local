import { v4 as uuid } from "uuid";

export const declinedInvitationReasons = [
  { id: uuid(), label: "Job is not a fit for my skills", value: "Job-is-not-a-fit-for-my-skills" },
  { id: uuid(), label: "Not interested in work described", value: "Not-interested-in-work-described" },
  { id: uuid(), label: "Too busy on other projects", value: "Too-busy-on-other-projects" },
  {
    id: uuid(),
    label: "Client has too little Helius experience",
    value: "Client-has-too-little-Helius-experience",
  },
  { id: uuid(), label: "Proposed rate or budget too low", value: "Proposed-rate-or-budget-too-low" },
  { id: uuid(), label: "Spam", value: "Spam" },
  { id: uuid(), label: "Client asked for free work", value: "Client-asked-for-free-work" },
  {
    id: uuid(),
    label: "Client asked to work outside Helius",
    value: "Client-asked-to-work-outside-Helius",
  },
  { id: uuid(), label: "Other", value: "Other" },
];

export const checkTermsNameExits = ["andTerms", "orTerms", "exactTerms", "excludeTerms", "titleTerm"];

export const reviewProposalsOfFreelancerTabs = [
  { id: uuid(), tabName: "All Proposals", key: "allProposals" },
  { id: uuid(), tabName: "Shortlisted", key: "shortlisted" },
  { id: uuid(), tabName: "Message", key: "message" },
  { id: uuid(), tabName: "Archived", key: "archived" },
];
export const declinedProposalOfJobByClientOpt = [
  { id: uuid(), name: "Ignored instructions in Job Posting" },
  { id: uuid(), name: "Insufficient Helius history" },
  { id: uuid(), name: "Lacks desired skills or qualifications" },
  { id: uuid(), name: "Rate/bid too high" },
  { id: uuid(), name: "Just preferred other applicants" },
  { id: uuid(), name: "Spam application - recycled cover letter" },
  { id: uuid(), name: "Spam application - obvious qualifications mismatch" },
  { id: uuid(), name: "Applicant requesting to work outside of Helius" },
  { id: uuid(), name: "Other" },
];
