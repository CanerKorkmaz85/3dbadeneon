"use client";

import Image from "next/image";
import { useState } from "react";

const fonts = [
  "Junkyard",
  "Neoneon",
  "Quinzey",
  "Neontubes",
  "Kıona",
  "Beon",
  "Alexa",
  "Racket",
  "Beachfont",
  "Greenworld",
  "Loveneon",
  "Mayfair",
];
const colors = [
  { name: "Pembe", value: "#ff4cbd" },
  { name: "Gök mavisi", value: "#62eaff" },
  { name: "Mavi", value: "#2468ff" },
  { name: "Beyaz", value: "#ffffff" },
  { name: "Gün ışığı", value: "#ffe3a0" },
  { name: "Sarı", value: "#ffe943" },
  { name: "Yeşil", value: "#64e873" },
  { name: "Kırmızı", value: "#ff4b4b" },
  { name: "Turuncu", value: "#ff8845" },
  {
    name: "RGB",
    value: "linear-gradient(135deg,#ff4cbd,#62eaff,#d9ff3c,#ff8845)",
  },
];
const heights = ["30 cm", "40 cm", "50 cm", "70 cm", "90 cm", "Özel"];
const previewSizes: Record<string, string> = {
  "30 cm": "clamp(42px,4.5vw,54px)",
  "40 cm": "clamp(48px,5.4vw,66px)",
  "50 cm": "clamp(56px,6.3vw,78px)",
  "70 cm": "clamp(66px,7.5vw,94px)",
  "90 cm": "clamp(78px,9vw,116px)",
  Özel: "clamp(66px,7.5vw,94px)",
};

export default function TasarlaPage() {
  const [mode, setMode] = useState<"text" | "logo">("text");
  const [text, setText] = useState("3DbadeNeon");
  const [color, setColor] = useState(colors[0].value);
  const [height, setHeight] = useState("70 cm");
  const [font, setFont] = useState("Beachfont");
  const [align, setAlign] = useState<"left" | "center" | "right">("center");
  const [background, setBackground] = useState("gray");
  const [cut, setCut] = useState("Kontur");
  const [plateColor, setPlateColor] = useState("Saydam");
  const [usage, setUsage] = useState("İç mekan");
  const [transformer, setTransformer] = useState("Eklensin");
  const [notes, setNotes] = useState("");
  const [logoName, setLogoName] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [, setCartCount] = useState(0);
  const selectedIsRgb = color.includes("gradient");
  const preview = mode === "text" ? text || "3DbadeNeon" : "Logon";
  const fitSize = `${Math.max(42, Math.min(120, 560 / Math.max(preview.replace(/\n/g, "").length, 1)))}px`;

  return (
    <main className="tasarla-page">
      <section className="designer-section designer-standalone">
        <div className="designer-heading">
          <h1>Kendin Tasarla.</h1>
          <span>
            Yazını veya logonu seç; seçeneklerini değiştirerek neonunun ilk
            görünümünü oluştur.
          </span>
        </div>
        <div className="designer-layout">
          <div className={`designer-preview preview-${background}`}>
            <div className="preview-note">✦ CANLI ÖNİZLEME</div>
            <div
              className={`neon-preview align-${align} font-${font.toLowerCase()} ${mode === "text" && selectedIsRgb ? "rgb-preview" : ""} ${cut === "Plaka" ? "plexi-plate" : "plexi-contour"} plate-${plateColor.toLowerCase()}`}
              style={
                {
                  "--design-color": selectedIsRgb ? "#ffffff" : color,
                  "--preview-font-size": previewSizes[height],
                  "--text-fit-size": fitSize,
                } as React.CSSProperties
              }
            >
              {mode === "logo" ? (
                <>
                  {logoPreview ? (
                    <Image
                      unoptimized
                      className="uploaded-logo-preview"
                      src={logoPreview}
                      alt="Yüklenen logo"
                      width={640}
                      height={420}
                    />
                  ) : (
                    <b className="logo-preview-copy">Logon</b>
                  )}
                  <small>{logoName || "Logo dosyanı yükle"}</small>
                </>
              ) : (
                <span className="neon-copy">{preview}</span>
              )}
            </div>
            <div className="preview-background-picker">
              {[
                { id: "gray", label: "Gri duvar" },
                { id: "living", label: "Salon" },
                { id: "office", label: "Ofis" },
                { id: "youth", label: "Genç odası" },
              ].map((item) => (
                <button
                  key={item.id}
                  aria-label={`${item.label} arka planını seç`}
                  className={
                    background === item.id
                      ? `selected bg-${item.id}`
                      : `bg-${item.id}`
                  }
                  onClick={() => setBackground(item.id)}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <div className="preview-size">
              {height} · {cut === "Kontur" ? "Kontör" : cut} kesim · {usage}
            </div>
          </div>
          <div className="designer-controls">
            <div className="designer-tabs">
              <button
                className={mode === "text" ? "selected" : ""}
                onClick={() => setMode("text")}
              >
                KENDİN TASARLA
              </button>
              <button
                className={mode === "logo" ? "selected" : ""}
                onClick={() => setMode("logo")}
              >
                ◈ LOGONU YÜKLE
              </button>
            </div>
            {mode === "text" ? (
              <>
                <label>Ne yazsın?</label>
                <textarea
                  value={text}
                  maxLength={26}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Örn. CANER'S BAR"
                />
                <label>1. Yazı Tipi</label>
                <div className="font-options font-grid">
                  {fonts.map((item) => (
                    <button
                      key={item}
                      className={font === item ? "selected" : ""}
                      onClick={() => setFont(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <label>2. Satır</label>
                <div className="material-options text-align-options">
                  {[
                    { id: "left", label: "Solda" },
                    { id: "center", label: "Ortada" },
                    { id: "right", label: "Sağda" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      className={align === item.id ? "selected" : ""}
                      onClick={() =>
                        setAlign(item.id as "left" | "center" | "right")
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <label>2. Renk</label>
                <div className="color-options">
                  {colors.map((item) => (
                    <button
                      key={item.name}
                      title={item.name}
                      aria-label={`${item.name} rengini seç`}
                      className={color === item.value ? "selected" : ""}
                      style={{ background: item.value }}
                      onClick={() => setColor(item.value)}
                    >
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <label>Logonu veya görselini yükle</label>
                <label className="upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      setLogoName(file?.name || "");
                      setLogoPreview(file ? URL.createObjectURL(file) : "");
                    }}
                  />
                  <b>GÖRSEL SEÇ</b>
                  <span>{logoName || "PNG, JPG veya logo dosyan"}</span>
                </label>
              </>
            )}
            <label>
              {mode === "logo" ? "Logo Yüksekliği" : "3. Harf Yüksekliği"}
            </label>
            <div className="size-options height-options">
              {heights.map((item) => (
                <button
                  key={item}
                  className={height === item ? "selected" : ""}
                  onClick={() => setHeight(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <label>
              {mode === "logo" ? "Pleksi Kesim" : "4. Pleksi Kesim"}
            </label>
            <div className="material-options">
              {["Kontur", "Plaka"].map((item) => (
                <button
                  key={item}
                  className={cut === item ? "selected" : ""}
                  onClick={() => setCut(item)}
                >
                  {item === "Kontur" ? "Kontör" : item}
                </button>
              ))}
            </div>
            <label>{mode === "logo" ? "Plaka Rengi" : "5. Plaka Rengi"}</label>
            <div className="material-options">
              {["Saydam", "Siyah"].map((item) => (
                <button
                  key={item}
                  className={plateColor === item ? "selected" : ""}
                  onClick={() => setPlateColor(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <label>
              {mode === "logo" ? "Kullanım Yeri" : "6. Kullanım Yeri"}
            </label>
            <div className="material-options">
              {["İç mekan", "Dış mekan"].map((item) => (
                <button
                  key={item}
                  className={usage === item ? "selected" : ""}
                  onClick={() => setUsage(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <label>{mode === "logo" ? "Trafo" : "7. Trafo"}</label>
            <div className="material-options">
              {["Eklensin", "Eklenmesin"].map((item) => (
                <button
                  key={item}
                  className={transformer === item ? "selected" : ""}
                  onClick={() => setTransformer(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <label>{mode === "logo" ? "Notlar" : "8. Notlar"}</label>
            <textarea
              className="notes-area"
              value={notes}
              maxLength={300}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Tasarım ile ilgili notunuzu yazın..."
            />
            <div className="designer-price">
              <span>SANA ÖZEL ÜRETİM</span>
              <strong>TEKLİF VERİLECEK</strong>
              <small>Tasarımın incelenerek sana özel teklif hazırlanır.</small>
            </div>
            <button
              className="designer-add"
              onClick={() => setCartCount((count) => count + 1)}
            >
              TASARIMI SEPETE EKLE +
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
