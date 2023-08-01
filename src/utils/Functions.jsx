export const getErrorMessage = (err) => {
  const parts = err.split(":");

  // Check if there are at least two parts after splitting
  if (parts.length >= 2) {
    const extractedData = parts.slice(1).join(":").trim();
    return extractedData;
  } else {
    console.log("No data found after the first colon.");
  }
};
