import convertHHMMSSToSeconds from "../convertHHMMSSToSeconds";

export default function (report: any) {
  const totalRatingTimeSeconds = convertHHMMSSToSeconds(
    report.total_rating_time
  );
  const totalCallTimeHrs =
    convertHHMMSSToSeconds(report.total_call_length) / 3600;
    console.log()
  const tr =  totalRatingTimeSeconds / 3600;;
  return tr.toFixed(2);
}
