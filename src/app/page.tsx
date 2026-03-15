"use client";

import QRCode from "qrcode";
import { useState } from "react";

const normalizeUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("URL tidak boleh kosong.");
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  const parsed = new URL(withProtocol);
  return parsed.toString();
};

export default function Home() {
  const [urlInput, setUrlInput] = useState("");
  const [encodedUrl, setEncodedUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const generateFromValue = async (value: string) => {
    setErrorMessage("");
    setStatus("loading");

    try {
      const normalized = normalizeUrl(value);
      const dataUrl = await QRCode.toDataURL(normalized, {
        width: 560,
        margin: 1,
        errorCorrectionLevel: "M",
        color: {
          dark: "#111111",
          light: "#ffffff",
        },
      });

      setEncodedUrl(normalized);
      setQrDataUrl(dataUrl);
      setStatus("ready");
    } catch (error) {
      setQrDataUrl("");
      setEncodedUrl("");
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Masukkan URL yang valid.",
      );
    }
  };

  const handleGenerate = async () => {
    await generateFromValue(urlInput);
  };

  const handleUseSample = () => {
    const sample = "https://openai.com";
    setUrlInput(sample);
    void generateFromValue(sample);
  };

  const fileName = `qr-generathor-${new Date().toISOString().slice(0, 10)}.png`;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffe5f1,_#f7f4ff_40%,_#d7f2ff_100%)] px-6 py-10 text-slate-900 sm:px-10 lg:px-16">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="grid gap-4">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
            <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">
              QR GeneraThor
            </span>
            <span className="text-slate-500">URL to QR</span>
          </div>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Generate QR code dari URL apa pun, cepat dan 100% akurat.
          </h1>
          <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
            Masukkan URL, klik generate, lalu unduh QR code dalam format PNG.
            Tampilan bersih, warna cerah, dan hasil tajam siap dipakai.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur sm:p-8">
            <div className="grid gap-2">
              <label
                htmlFor="url-input"
                className="text-sm font-semibold text-slate-700"
              >
                URL tujuan
              </label>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  id="url-input"
                  type="text"
                  placeholder="contoh: https://namasite.com"
                  value={urlInput}
                  onChange={(event) => setUrlInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void handleGenerate();
                    }
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm outline-none ring-offset-2 transition focus:border-slate-300 focus:ring-2 focus:ring-sky-200"
                />
                <button
                  type="button"
                  onClick={() => void handleGenerate()}
                  className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  Generate
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>Tip: tanpa http juga bisa.</span>
                <button
                  type="button"
                  onClick={handleUseSample}
                  className="font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-900"
                >
                  Pakai contoh
                </button>
              </div>
            </div>

            <div className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Status
              </div>
              <div className="text-sm text-slate-700">
                {status === "idle" && "Masukkan URL lalu klik Generate."}
                {status === "loading" && "Sedang membuat QR code..."}
                {status === "ready" && "QR code siap diunduh!"}
                {status === "error" && (
                  <span className="text-rose-500">{errorMessage}</span>
                )}
              </div>
              {encodedUrl && (
                <div className="rounded-xl bg-white px-3 py-2 text-xs text-slate-500">
                  {encodedUrl}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl border border-white/60 bg-white/80 p-6 text-center shadow-lg backdrop-blur sm:p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Preview QR
            </div>
            <div className="grid place-items-center rounded-3xl border border-dashed border-slate-200 bg-white p-6">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR code untuk ${encodedUrl}`}
                  className="h-60 w-60 rounded-2xl object-contain shadow-md"
                />
              ) : (
                <div className="grid h-60 w-60 place-items-center rounded-2xl bg-gradient-to-br from-sky-100 via-rose-100 to-amber-100 text-sm text-slate-500">
                  QR preview akan muncul di sini
                </div>
              )}
            </div>
            <div className="grid gap-3">
              <a
                href={qrDataUrl || "#"}
                download={fileName}
                aria-disabled={!qrDataUrl}
                className={`rounded-2xl px-6 py-3 text-sm font-semibold transition ${
                  qrDataUrl
                    ? "bg-sky-500 text-white shadow-sm hover:bg-sky-600"
                    : "pointer-events-none cursor-not-allowed bg-slate-200 text-slate-400"
                }`}
              >
                Download PNG
              </a>
              <p className="text-xs text-slate-500">
                File PNG siap diunduh dengan resolusi tinggi.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
