export const emailRegex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

export const emailStandardRegex =
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Password data field Criteria - Minimum 8- Maximum 12 characters, one number, one uppercase letter, one lowercase letter, and one special character.
// export const passwordRegex = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])[a-zA-Z][a-zA-Z0-9]{7,}$/;
export const passwordRegex = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+*!=]).\S*$/;

// Only alphabet
export const onlyAlphabetRegex = /^[a-zA-Z]+$/;

export const onlyNumericRegex = /^[0-9]+$/;

// Verify that the “Company Name” field contains 60 characters. Display an error message if I write more   than 60 characters.
export const companyNameLengthRegex = /^.{3,60}$/;

// Verify that the “Company Registration Number” field contains 40 characters(Alphanumeric). Display an error message if I write more than 40 characters.
export const companyNumberAlphaNumericRegex = /^([a-zA-Z0-9_-]){3,40}$/;

// Verify that the “Address” field contains 255 characters (Alphanumeric). Display an error message if I write  more than 255 characters. And any special characters are not allowed except   “, “(Coma)

// export const addressFormatRegex = /^([a-zA-Z0-9_-]){3,255}$/;
export const addressFormatRegex = /^([a-zA-z0-9/\\''(),-\s]{2,255})$/;

// Verify that the “City” field contains 40 characters. Display an error message if I write more than 40 characters.
export const cityAlphabetRegex = /^([a-zA-Z]){3,40}$/;

// Verify that the “State” field contains 20 characters. Display error message if I write more than 20 characters.
export const stateAlphabetRegex = /^([a-zA-Z]){3,20}$/;

// Verify that the “Zip/ Postal Code” field contains 20 characters (Alphanumeric). Display error message IF write more than 20 characters.
export const zipPostalCodeRegex = /^([a-zA-Z0-9]){3,20}$/;

// Verify that the "verification code" field contain only 6 digit allow. Display error message IF write min or max 6 characters.
export const verificationCodeRegex = /^[0-9]{0,6}$/;

export const organizationAlphanumericRegex = /^([a-zA-Z0-9? ,_-]){3,80}$/;
export const onlyAllowNumbersRegex = /^[0-9]+$/;
export const passingYearRegex = /(?:(?:18|19|20|21)[0-9]{2})/;
export const textAreaMaxLengthRegex = /^[\s\S]{0,5000}$/;
