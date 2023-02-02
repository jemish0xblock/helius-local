// Verify that the “Project Description” field contains 5000 characters. Display an error message if I write more than 5000 characters.
export const descriptionValidationRegex = /^[\s\S]{0,5000}$/;

// Verify that the “Project Title” field contains 100 characters. Display an error message if I write more than 100 characters.
export const titleValidationRegex = /^[\s\S]{0,100}$/;

// Verify that the “Project Title” field contains 100 characters. Display an error message if I write more than 100 characters.
export const onlyAllowNumbersRegex = /^[0-9]{0,2}$/;

// Verify that the “Project Title” field contains 100 characters. Display an error message if I write more than 100 characters.
export const onlyAllowNumbersForMaxBudgetAndMin = /^[0-9]{1,3}$/;

// Verify that the “Project Title” field contains 500 characters. Display an error message if I write more than 500 characters.
export const milestoneDescriptionValidationRegex = /^[\s\S]{0,500}$/;
