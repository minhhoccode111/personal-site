import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// Update the locale to ensure that dayjs outputs the day names and month names correctly
dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years",
  },
});

export default function formatDate(dateString: string) {
  const date = dayjs(dateString);

  // Relative time
  const relativeTime = date.fromNow();

  // Time (12:34)
  const time = date.format("HH:mm");

  // Full date (Mon, January 6, 2024)
  const fullDate = date.format("ddd, MMMM D, YYYY");

  return `${relativeTime} - ${time} - ${fullDate}`;
}
