export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  return date.toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" });
};

export const getTimeDifference = (timestamp) => {
  if (!timestamp) return "Unknown";

  const dateNow = new Date();
  const dateParam = new Date(timestamp);

  const diffTime = Math.abs(dateParam - dateNow);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = diffDays / 7;
  const diffMonths = diffDays / 30;
  const diffYears = diffDays / 365;

  if (diffYears >= 1) {
    const plural = diffYears > 1 ? "" : "s";
    return `${Math.round(diffYears * 10) / 10} year${plural} ago`;
  } else if (diffMonths >= 1) {
    const plural = diffMonths > 1 ? "" : "s";
    return `${Math.trunc(diffMonths)} month${plural} ago`;
  } else if (diffWeeks >= 1) {
    const plural = diffWeeks > 1 ? "" : "s";
    return `${Math.trunc(diffWeeks)} week${plural} ago`;
  } else if (diffDays >= 1) {
    const plural = diffDays > 1 ? "" : "s";
    return `${Math.trunc(diffDays)} day${plural} ago`;
  }
};
