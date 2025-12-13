export default function Lienzo({ canvasRef }) {
  return (
    <div
      className="p-2 mt-3 borde"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        overflow: "hidden"
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
