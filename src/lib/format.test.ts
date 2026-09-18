import { describe, it, expect, vi, afterEach } from "vitest";
import { parseIsoDuration, formatRelativeDate } from "./format";

describe("parseIsoDuration", () => {
  it("formatea horas, minutos y segundos como HH:MM:SS", () => {
    expect(parseIsoDuration("PT1H2M3S")).toBe("1:02:03");
  });

  it("formatea minutos y segundos como MM:SS cuando no hay horas", () => {
    expect(parseIsoDuration("PT5M30S")).toBe("5:30");
  });

  it("formatea solo segundos con minutos en 0", () => {
    expect(parseIsoDuration("PT45S")).toBe("0:45");
  });

  it("formatea PT0S como 0:00", () => {
    expect(parseIsoDuration("PT0S")).toBe("0:00");
  });

  it("maneja duraciones sin componente de segundos", () => {
    expect(parseIsoDuration("PT10M")).toBe("10:00");
  });

  it("maneja duraciones de solo horas, rellenando minutos y segundos", () => {
    expect(parseIsoDuration("PT2H")).toBe("2:00:00");
  });

  it("devuelve 0:00 ante una entrada que no matchea el formato ISO 8601", () => {
    expect(parseIsoDuration("no-es-una-duracion")).toBe("0:00");
  });
});

describe("formatRelativeDate", () => {
  const NOW = new Date("2026-01-15T12:00:00.000Z");

  afterEach(() => {
    vi.useRealTimers();
  });

  function agoBySeconds(seconds: number): Date {
    return new Date(NOW.getTime() - seconds * 1000);
  }

  it('devuelve "Hace instantes" para diferencias menores a un minuto', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    expect(formatRelativeDate(agoBySeconds(30))).toBe("Hace instantes");
  });

  it("formatea minutos", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    expect(formatRelativeDate(agoBySeconds(10 * 60))).toBe("hace 10 minutos");
  });

  it("formatea horas", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    expect(formatRelativeDate(agoBySeconds(5 * 60 * 60))).toBe("hace 5 horas");
  });

  it("formatea días", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    expect(formatRelativeDate(agoBySeconds(3 * 60 * 60 * 24))).toBe("hace 3 días");
  });

  it("formatea semanas", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    expect(formatRelativeDate(agoBySeconds(2 * 60 * 60 * 24 * 7))).toBe(
      "hace 2 semanas",
    );
  });

  it("formatea meses", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    expect(formatRelativeDate(agoBySeconds(2 * 60 * 60 * 24 * 30))).toBe(
      "hace 2 meses",
    );
  });

  it("formatea años", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    expect(formatRelativeDate(agoBySeconds(2 * 60 * 60 * 24 * 365))).toBe(
      "hace 2 años",
    );
  });

  it("acepta un string ISO además de un objeto Date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    // Se usan 4 días (no 1) para evitar la forma especial "ayer" que
    // Intl.RelativeTimeFormat con numeric:"auto" aplica al valor 1.
    const isoString = agoBySeconds(4 * 60 * 60 * 24).toISOString();
    expect(formatRelativeDate(isoString)).toBe("hace 4 días");
  });
});
