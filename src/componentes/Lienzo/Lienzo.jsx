export default function Lienzo({ canvasRef }) {
  return (
    <div
      className="mt-3 borde"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        overflow: "auto",
        backgroundColor:"#FCFCFC"
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%"}} />
    </div>
  );
}
