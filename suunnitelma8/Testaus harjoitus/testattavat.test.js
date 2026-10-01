import { describe, it, expect } from "vitest";
import {
  kertaaKaksi,
  onParillinen,
  muodostaNimi,
} from "./utils/testattavat.js";

describe("Tehtävän funktioiden testit", () => {
  // 1. kertaaKaksi -funktion testit
  it("kertoo positiivisen luvun kahdella", () => {
    expect(kertaaKaksi(4)).toBe(8);
  });
  it("toimii nollalla ja negatiivisilla luvuilla", () => {
    expect(kertaaKaksi(0)).toBe(0);
    expect(kertaaKaksi(-3)).toBe(-6);
  });

  // 2. onParillinen -funktion testit
  it("palauttaa true, kun luku on parillinen", () => {
    expect(onParillinen(4)).toBe(true);
  });
  it("palauttaa false, kun luku on pariton", () => {
    expect(onParillinen(7)).toBe(false);
  });

  // 3. muodostaNimi -funktion testit
  it("yhdistää etunimen ja sukunimen välilyönnillä", () => {
    expect(muodostaNimi("Matti", "Meikäläinen")).toBe("Matti Meikäläinen");
  });
  it("poistaa ylimääräiset tyhjät välilyönnit reunoilta", () => {
    expect(muodostaNimi("  Liisa  ", " Virtanen ")).toBe("Liisa Virtanen");
  });
});
