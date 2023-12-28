const convertDate = (isoDateString) => {
  var isoDate = new Date(isoDateString);
  return {
    year: isoDate.getFullYear(),
    month:
      isoDate.getMonth() /* Month in JS starting by 0 AND not adding 1 bcs array starts by 0 */,
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
  const dateDifference = new Date() - new Date(time);
  const millisecondsInADay = 24 * 60 * 60 * 1000;
  const difference = {
    days: Math.floor(dateDifference / millisecondsInADay),
    hours: Math.floor((dateDifference % millisecondsInADay) / (60 * 60 * 1000)),
    minutes: Math.floor((dateDifference % (60 * 60 * 1000)) / (60 * 1000)),
    seconds: Math.floor((dateDifference % (60 * 1000)) / 1000),
  };
  if (postedTime.year !== new Date().getFullYear()) {
    return `${postedTime.day} ${months[postedTime.month]} ${
      String(postedTime.year)[2] + String(postedTime.year)[3]
    }`;
  } else if (difference.days > 31) {
    return `${postedTime.day} ${months[postedTime.month]}`;
  } else if (difference.days < 31 && difference.days > 0)
    return `${difference.days} d`;
  else if (difference.hours < 24 && difference.hours > 0)
    return `${difference.hours} h`;
  else if (difference.minutes < 60 && difference.minutes > 0)
    return `${difference.minutes} m`;
  else if (difference.seconds < 60) return `${difference.seconds} s`;
};

module.exports = { convertDate, timeDifference };
