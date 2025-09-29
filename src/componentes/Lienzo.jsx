export default function Lienzo({ canvasRef }) {
  return (
    <div className="border rounded p-3 mt-3">
      <canvas ref={canvasRef} />
    </div>
  );
}
