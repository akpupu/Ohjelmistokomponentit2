export default function muodostaSql(sqljson) {
  const lauseet = {};
  for (const avain of Object.keys(sqljson)) {
    lauseet[avain] = {};
    for (const kentta of Object.keys(sqljson[avain])) {
      lauseet[avain][kentta] = {};
      if (sqljson[avain][kentta].sql) {
        lauseet[avain][kentta].sql = sqljson[avain][kentta].sql.join(" ");
      }
      if (sqljson[avain][kentta].parametrijarjestys) {
        lauseet[avain][kentta].parametrijarjestys =
          sqljson[avain][kentta].parametrijarjestys;
      }
    }
    if (sqljson[avain].perusavain) {
      lauseet[avain].perusavain = sqljson[avain].perusavain;
    }
  }
  return lauseet;
}
