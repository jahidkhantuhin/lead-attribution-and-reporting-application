export default function convertHHMMSSToSeconds(hms = "00:00:00") {
  let a = hms.split(":");

  return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
}
