export default function addTwoTimes(start = "00:00:00", end = "00:00:00") {
  var a = start.split(":");
  var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
  var b = end.split(":");
  var seconds2 = +b[0] * 60 * 60 + +b[1] * 60 + +b[2];

  var date = new Date(1970, 0, 1);
  date.setSeconds(seconds + seconds2);

  var c = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  return c;
}
