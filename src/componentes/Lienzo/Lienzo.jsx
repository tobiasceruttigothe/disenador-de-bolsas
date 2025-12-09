export default function Lienzo({ canvasRef }) {
  return (
    <div
      className="border rounded p-3 mt-3"
      style={{
        width: "100%",
        height: "100%",
        border: "1px solid #00000013",
        borderRadius: "8px",
        overflow: "hidden"
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
