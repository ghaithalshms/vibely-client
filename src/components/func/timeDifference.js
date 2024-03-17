const convertDate = (isoDateString) => {
  const isoDate = new Date(isoDateString);
  return {
    year: isoDate.getFullYear(),
    month: isoDate.getMonth(), // Month starts from 0
    day: isoDate.getDate(),
  };
};

const timeDifference = (time) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const postedTime = convertDate(time);

  // time difference in milliseconds
  const dateDifference = new Date() - new Date(time);
  const millisecondsInADay = 24 * 60 * 60 * 1000;

  const difference = {
    days: Math.floor(dateDifference / millisecondsInADay),
    hours: Math.floor((dateDifference % millisecondsInADay) / (60 * 60 * 1000)),
    minutes: Math.floor((dateDifference % (60 * 60 * 1000)) / (60 * 1000)),
    seconds: Math.floor((dateDifference % (60 * 1000)) / 1000),
  };

  if (postedTime.year !== new Date().getFullYear()) {
    return `${postedTime.day} ${months[postedTime.month]} ${String(
      postedTime.year
    ).slice(-2)}`;
  } else if (difference.days >= 2) {
    return `on ${postedTime.day} ${months[postedTime.month]}`;
  } else if (difference.days === 1) {
    return `1 day ago`;
  } else if (difference.hours >= 1) {
    return `${difference.hours} hour${difference.hours > 1 ? "s" : ""} ago`;
  } else if (difference.minutes >= 1) {
    return `${difference.minutes} minute${
      difference.minutes > 1 ? "s" : ""
    } ago`;
  } else {
    return `${difference.seconds} second${
      difference.seconds > 1 ? "s" : ""
    } ago`;
  }
};

module.exports = { convertDate, timeDifference };
