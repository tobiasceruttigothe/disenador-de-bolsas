export default function Lienzo({ canvasRef }) {
  return (
    <div className="border rounded p-3 mt-3" style={{ height: "835px", border: "1px solid #00000013", borderRadius: "8px" }}>
      <canvas ref={canvasRef} />
    </div>
    
  );
}
