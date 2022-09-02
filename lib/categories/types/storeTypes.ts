export interface ICategoryObj {
  uid: string;
  title: string;
  speciality: [];
}

export interface categoriesDataProps {
  categoriesList: ICategoryObj | null;
  subCategoriesSkills: string[];
  specialityAllSkills: string[];
  currentRequestId: string;
  isLoading: boolean;
  error: any;
}

export interface SKillProps {
  subCategory_id: string;
}
