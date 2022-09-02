const getDayDifference = (startDateString: any, endDateString: any) => {
  const startDate = new Date(startDateString).getTime() / 1000;
  const endDate = new Date(endDateString).getTime() / 1000;

  if (startDate > endDate || !startDate || !endDate) {
    return 0;
  }

  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (60 * 60 * 24));
};
export const getDateAndTimeFormatter = (date: any) => {
  if (date) {
    const created = new Date(date);
    const dateObj = new Date();
    const result = getDayDifference(created, dateObj);
    return `${result} days ago`;
  }
  return 0;
};
export const getAttachmentFileName = (item: string) => {
  const url = item?.split("/")[3];
  const fileName = url?.split("?")[0];

  return fileName;
};

export const copyToClipboard = async (text: string, _onSuccess?: any) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      await navigator.clipboard.writeText(text);
      // toast.success("Copied Successfully");

      // onSuccess && onSuccess();
    } else {
      // text area method
      const textArea = document.createElement("textarea");
      textArea.value = text;
      // make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      // toast.success("Copied Successfully");
    }
  } catch (error) {
    //  onError && onError();
  }
};
