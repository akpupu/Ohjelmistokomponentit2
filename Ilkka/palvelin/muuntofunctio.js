export default function muunna(olio, kenttajarjestys) {
  const parametrit = [];

  for (const avain of kenttajarjestys) {
    parametrit.push(olio[avain]);
  }

  return parametrit;
}
