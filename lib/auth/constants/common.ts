import { v4 as uuid } from "uuid";

export const companyTypesOptList = [
  { id: uuid(), title: "Information Technology & Services", value: "IT_&_Service" },
  { id: uuid(), title: "Digital Marketing & Advertising", value: "digitalMarketing&Advertising" },
  { id: uuid(), title: "Engineering", value: "engineering" },
  { id: uuid(), title: "Accounting", value: "accounting" },
  { id: uuid(), title: "Outsourcing/Offshoring", value: "outSourcingOrOffshoring" },
  { id: uuid(), title: "Online Publishing", value: "onlinePublishing" },
  { id: uuid(), title: "Market Research", value: "marketResearch" },
  { id: uuid(), title: "Financial Services", value: "financialService" },
  { id: uuid(), title: "Computer Hardware/Software/Network", value: "computerHardware" },
  { id: uuid(), title: "E-Learning", value: "eLearning" },
  { id: uuid(), title: "Government sector", value: "governmentSector" },
  { id: uuid(), title: "Other", value: "other" },
];

export const sizeOfEmployeesOptList = [
  { id: uuid(), title: "1-10", value: "1-10" },
  { id: uuid(), title: "11-50", value: "11-50" },
  { id: uuid(), title: "51-100", value: "51-100" },
  { id: uuid(), title: "101-150", value: "101-150" },
  { id: uuid(), title: "150+", value: "150+" },
];

export const roleInCompanyOptList = [
  { id: uuid(), title: "Founder", value: "founder" },
  { id: uuid(), title: "Hiring Manager", value: "hiringManager" },
  { id: uuid(), title: "Executive", value: "executive" },
  { id: uuid(), title: "Interviewer", value: "interviewer" },
  { id: uuid(), title: "Recruiter", value: "recruiter" },
];
export const freelancerCompleteProfileStepsList = [
  { id: uuid(), title: "Residence Details" },
  { id: uuid(), title: "Professional Details" },
  { id: uuid(), title: "Education Details" },
  { id: uuid(), title: "About Your Self  " },
];
export const freelancerProfessionsList = [
  {
    id: uuid(),
    label: "Developer",
    isOptGroup: true,
    subMenuList: [
      { subOptId: uuid(), title: "Frontend Developer", value: "frontendDeveloper" },
      { subOptId: uuid(), title: "Backend Developer", value: "backendDeveloper" },
      { subOptId: uuid(), title: "Full-stack Developer", value: "fullStackDeveloper" },
      { subOptId: uuid(), title: "Mobile Developer", value: "mobileDeveloper" },
      { subOptId: uuid(), title: "Game Developer", value: "gameDeveloper" },
      { subOptId: uuid(), title: "Web Developer", value: "webDeveloper" },
      { subOptId: uuid(), title: "Software Developer", value: "softwareDeveloper" },
      { subOptId: uuid(), title: "DevOps Developer", value: "devOpsDeveloper" },
      { subOptId: uuid(), title: "Other", value: "other" },
    ],
    value: "",
  },
  {
    id: uuid(),
    label: "Designer",
    isOptGroup: true,
    subMenuList: [
      { subOptId: uuid(), title: "Web Designer", value: "webDesigner" },
      { subOptId: uuid(), title: "Frontend Designer", value: "frontendDesigner" },
      { subOptId: uuid(), title: "UI/UX Designer", value: "ui/uxDesigner" },
      { subOptId: uuid(), title: "Graphic Designer", value: "graphicDesigner" },
      { subOptId: uuid(), title: "Other", value: "other" },
    ],
    value: "",
  },
  { id: uuid(), label: "QA", isOptGroup: false, value: "QA", subMenuList: [] },
  { id: uuid(), label: "Project Manager", isOptGroup: false, value: "projectManager", subMenuList: [] },
  { id: uuid(), label: "BD/BA", value: "BD/BA", isOptGroup: false, subMenuList: [] },
  { id: uuid(), label: "Operation Manager", isOptGroup: false, value: "operationManager", subMenuList: [] },
  { id: uuid(), label: "Other", isOptGroup: false, value: "Other", subMenuList: [] },
];

export const higherEducationList = [
  { id: uuid(), title: "Ph.D", value: "Ph.D" },
  { id: uuid(), title: "Post Graduation", value: "postGraduation" },
  { id: uuid(), title: "Graduation", value: "graduation" },
  { id: uuid(), title: "Diploma", value: "diploma" },
];
export const yearsList = [
  { id: uuid(), title: "0", value: "0" },
  { id: uuid(), title: "1", value: "1" },
  { id: uuid(), title: "2", value: "2" },
  { id: uuid(), title: "3", value: "3" },
  { id: uuid(), title: "4", value: "4" },
  { id: uuid(), title: "5", value: "5" },
  { id: uuid(), title: "6", value: "6" },
  { id: uuid(), title: "7", value: "7" },
  { id: uuid(), title: "8", value: "8" },
  { id: uuid(), title: "9", value: "9" },
  { id: uuid(), title: "10", value: "10" },
  { id: uuid(), title: "11", value: "11" },
  { id: uuid(), title: "12", value: "12" },
  { id: uuid(), title: "more than 12", value: "12+" },
];
export const monthList = [
  { id: uuid(), title: "0", value: "0" },
  { id: uuid(), title: "1", value: "1" },
  { id: uuid(), title: "2", value: "2" },
  { id: uuid(), title: "3", value: "3" },
  { id: uuid(), title: "4", value: "4" },
  { id: uuid(), title: "5", value: "5" },
  { id: uuid(), title: "6", value: "6" },
  { id: uuid(), title: "7", value: "7" },
  { id: uuid(), title: "8", value: "8" },
  { id: uuid(), title: "9", value: "9" },
  { id: uuid(), title: "10", value: "10" },
  { id: uuid(), title: "11", value: "11" },
  { id: uuid(), title: "12", value: "12" },
];
export const SpecializationList = [
  { id: uuid(), title: "Computer engineering", value: "CE" },
  { id: uuid(), title: "Information & Technology", value: "IT" },
  { id: uuid(), title: "Computer Science and Equivalent", value: "CSE" },
  { id: uuid(), title: "Electronic & Communication", value: "EC" },
];
