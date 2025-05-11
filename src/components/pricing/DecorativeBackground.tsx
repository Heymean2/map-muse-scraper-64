
export function DecorativeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
      <div className="absolute -right-64 -top-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -left-64 -bottom-64 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl"></div>
    </div>
  );
}
