const convertDate = (isoDateString) => {
  const isoDate = new Date(isoDateString);
  return {
    year: isoDate.getFullYear(),
    month: isoDate.getMonth(), // Month starts from 0
    day: isoDate.getDate(),
  };
};

const calculateTimeDifference = (time) => {
  const dateDifference = new Date() - new Date(time);
  const millisecondsInADay = 24 * 60 * 60 * 1000;

  return {
    days: Math.floor(dateDifference / millisecondsInADay),
    hours: Math.floor((dateDifference % millisecondsInADay) / (60 * 60 * 1000)),
    minutes: Math.floor((dateDifference % (60 * 60 * 1000)) / (60 * 1000)),
    seconds: Math.floor((dateDifference % (60 * 1000)) / 1000),
  };
};

const formatPostedDate = (postedTime, months) => {
  if (postedTime.year !== new Date().getFullYear()) {
    return `${postedTime.day} ${months[postedTime.month]} ${String(
      postedTime.year
    ).slice(-2)}`;
  } else {
    return `on ${postedTime.day} ${months[postedTime.month]}`;
  }
};

const formatTimeDifference = (difference) => {
  if (difference.days >= 2) {
    return `${difference.days} days ago`;
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
  const difference = calculateTimeDifference(time);

  if (
    difference.days === 0 &&
    difference.hours === 0 &&
    difference.minutes === 0
  ) {
    return "Just now";
  } else {
    const postedDateString = formatPostedDate(postedTime, months);
    const timeDifferenceString = formatTimeDifference(difference);
    if (difference.days < 30) return timeDifferenceString;
    else return postedDateString;
  }
};

module.exports = { timeDifference };
