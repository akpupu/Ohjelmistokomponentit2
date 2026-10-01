import express from "express";
import cors from "cors";

import Tietokanta from "./tietokanta.js";
import muodostaSql from "./muodostajaSql.js";
import muunna from "./muuntofunctio.js";

import yhteystiedot from "./yhteystiodet.json" with { type: "json" };
import sql from "./sql.json" with { type: "json" };

const port = 4000;
const host = "localhost";

const lauseet = muodostaSql(sql);
const varasto = new Tietokanta(yhteystiedot);

const RESURSSI = "kukkatukku";

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("./public"));

// Hae kaikki
app.get(`/${RESURSSI}/hae_kaikki/:taulu`, (req, res) => {
  const taulu = req.params.taulu;

  varasto
    .suoritaKysely(lauseet[taulu].hae_kaikki.sql, [])
    .then((tulos) => res.json(tulos))
    .catch((tila) => res.json(tila));
});

app.get(`/${RESURSSI}/haelista/:taulu/:hakuavain`, (req, res) => {
  const taulu = req.params.taulu;
  const avain = req.params.hakuavain;

  varasto
    .suoritaKysely(lauseet[taulu][avain].sql, [])
    .then((tulos) => res.json(tulos))
    .catch((tila) => res.json(tila));
});

app.get(`/${RESURSSI}/hae/:taulu/:hakuavain/:arvo`, (req, res) => {
  const taulu = req.params.taulu;
  const avain = req.params.hakuavain;
  const arvo = req.params.arvo;

  varasto
    .suoritaKysely(lauseet[taulu][avain].sql, [arvo])
    .then((tulos) => res.json(tulos))
    .catch((tila) => res.json(tila));
});

app.post(`/${RESURSSI}/lisaa/:taulu`, (req, res) => {
  const uusi = req.body;
  const taulu = req.params.taulu;

  varasto
    .suoritaKysely(
      lauseet[taulu].lisaa.sql,
      muunna(
        uusi,
        lauseet[taulu].lisaa.parametrijarjestys
      )
    )
    .then((tulos) => res.json(tulos))
    .catch((virhe) => res.json(virhe));
});

// Päivitä
app.put(`/${RESURSSI}/paivita/:taulu/:avain`, (req, res) => {
  const uusi = req.body;
  const taulu = req.params.taulu;
  const avain = req.params.avain;

  varasto
    .suoritaKysely(
      lauseet[taulu][avain].sql,
      muunna(
        uusi,
        lauseet[taulu][avain].parametrijarjestys
      )
    )
    .then((tulos) => res.json(tulos))
    .catch((tila) => res.json(tila));
});

// Poista kukka
app.delete(`/${RESURSSI}/poista/kukka/:nimi`, async (req, res) => {
  const nimi = req.params.nimi;

  try {
    await varasto.suoritaKysely(
      "delete from `viljelijän_kukat` where kukan_nimi=?",
      [nimi]
    );

    const tulos = await varasto.suoritaKysely(
      "delete from kukka where nimi=?",
      [nimi]
    );

    res.json(tulos);
  } catch (virhe) {
    res.json(virhe);
  }
});

// Poista viljelijä
app.delete(
  `/${RESURSSI}/poista/viljelija/:viljelijannro`,
  async (req, res) => {
    const viljelijannro = req.params.viljelijannro;

    try {
      await varasto.suoritaKysely(
        "delete from `viljelijän_kukat` where viljelijannro=?",
        [viljelijannro]
      );

      const tulos = await varasto.suoritaKysely(
        "delete from `viljelijä` where viljelijannro=?",
        [viljelijannro]
      );

      res.json(tulos);
    } catch (virhe) {
      res.json(virhe);
    }
  }
);

// Käynnistetään palvelin
app.listen(port, host, () =>
  console.log(`http://${host}:${port} palvelee...`)
);
