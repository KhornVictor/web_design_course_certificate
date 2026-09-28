export function getOrdinalSuffix(day: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = day % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function formatCertificateDates(startDateStr: string, completionDateStr: string) {
  // Fallbacks if dates are invalid
  if (!startDateStr || !completionDateStr) {
    return {
      startDay: 1,
      startSuffix: "st",
      startMonth: "September",
      startYear: 2024,
      endDay: 2,
      endSuffix: "nd",
      endMonth: "October",
      endYear: 2024,
      formattedDateRange: "From 1st September to 2nd October 2024",
      location: "Phnom Penh, Cambodia",
      fullLine: "From 1st September to 2nd October 2024, Phnom Penh, Cambodia.",
    };
  }

  const start = new Date(startDateStr);
  const end = new Date(completionDateStr);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const startDay = start.getDate();
  const startSuffix = getOrdinalSuffix(startDay);
  const startMonth = months[start.getMonth()];
  const startYear = start.getFullYear();

  const endDay = end.getDate();
  const endSuffix = getOrdinalSuffix(endDay);
  const endMonth = months[end.getMonth()];
  const endYear = end.getFullYear();

  let formattedDateRange = "";
  if (startYear === endYear) {
    if (startMonth === endMonth) {
      formattedDateRange = `From ${startDay}${startSuffix} to ${endDay}${endSuffix} ${endMonth} ${endYear}`;
    } else {
      formattedDateRange = `From ${startDay}${startSuffix} ${startMonth} to ${endDay}${endSuffix} ${endMonth} ${endYear}`;
    }
  } else {
    formattedDateRange = `From ${startDay}${startSuffix} ${startMonth} ${startYear} to ${endDay}${endSuffix} ${endMonth} ${endYear}`;
  }

  return {
    startDay,
    startSuffix,
    startMonth,
    startYear,
    endDay,
    endSuffix,
    endMonth,
    endYear,
    formattedDateRange,
    location: "Phnom Penh, Cambodia",
    fullLine: `${formattedDateRange}, Phnom Penh, Cambodia.`,
  };
}
