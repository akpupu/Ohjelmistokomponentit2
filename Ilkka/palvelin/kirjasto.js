// const perusurl='http://localhost:4000'
const perusurl = "";
const resurssiurl = "/kukkatukku";

const url = `${perusurl}${resurssiurl}`;

async function haeKaikki(taulu) {
  try {
    const data = await fetch(`${url}/hae_kaikki/${taulu}`, { mode: "cors" });
    const tulos = await data.json();
    return Promise.resolve(tulos.kyselynTulos);
  } catch (virhe) {
    return Promise.resolve([]);
  }
}

async function hae(taulu, hakuavain, arvo) {
  try {
    const data = await fetch(`${url}/hae/${taulu}/${hakuavain}/${arvo}`, {
      mode: "cors",
    });
    const tulos = await data.json();

    return Promise.resolve(tulos.kyselynTulos);
  } catch (virhe) {
    return Promise.resolve([]);
  }
}

async function lisaa(taulu, uusi) {
  const optiot = {
    method: "POST",
    body: JSON.stringify(uusi),
    headers: { "Content-Type": "application/json" },
    mode: "cors",
  };

  try {
    const data = await fetch(`${url}/lisaa/${taulu}`, optiot);
    const tulos = await data.json();
    if (tulos.kyselynTulos.muutetutRivitLkm > 0) {
      return Promise.resolve("lisäys onnistui");
    }

    return Promise.resolve("ei lisätty");
  } catch (virhe) {
    return Promise.reject("lisäys epäonnistui");
  }
}

async function paivita(taulu, avain, uusi) {
  const optiot = {
    method: "PUT",
    body: JSON.stringify(uusi),
    headers: { "Content-Type": "application/json" },
    mode: "cors",
  };
  try {
    const data = await fetch(`${url}/paivita/${taulu}/${avain}`, optiot);
    const tulos = await data.json();
    if (tulos.kyselynTulos.muutetutRivitLkm > 0) {
      return Promise.resolve("paivitys onnistui");
    }
    return Promise.resolve("ei päivitetty");
  } catch (virhe) {
    return Promise.reject("lisäys epäonnistui");
  }
}

export { haeKaikki, hae, lisaa, paivita };
