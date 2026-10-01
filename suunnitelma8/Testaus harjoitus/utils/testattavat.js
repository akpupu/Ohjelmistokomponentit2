export function kertaaKaksi(luku) {
  return luku * 2;
}

export function onParillinen(luku) {
  return luku % 2 === 0;
}

export function muodostaNimi(etunimi, sukunimi) {
  return `${etunimi.trim()} ${sukunimi.trim()}`;
}
