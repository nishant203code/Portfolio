import { ImageResponse } from "next/og";

export const alt = "Nishant Porwal — Software Developer. Engineering and applied AI. NIT Delhi, class of 2027.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "#0c1013", display: "flex", padding: 52 }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", background: "#101317", border: "1px solid #30343c", borderRadius: 32, padding: 64, width: "100%" }}>
        <div style={{ color: "#e9a2c2", fontSize: 18, letterSpacing: 3 }}>ENGINEERING & APPLIED AI</div>
        <div style={{ color: "#eef0f6", fontSize: 76, fontWeight: 700, marginTop: 28 }}>Nishant Porwal</div>
        <div style={{ color: "#9bcaff", fontSize: 34, marginTop: 12 }}>Software Developer</div>
        <div style={{ color: "#a0a7b3", fontSize: 24, marginTop: 36 }}>NIT Delhi · Computer Science · Class of 2027</div>
      </div>
    </div>, size,
  );
}
