export default function KawaiiButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <button className="rounded-full bg-[#FF9ECF] px-8 py-4 font-bold text-white shadow-[0_8px_25px_rgba(255,158,207,0.35)] transition duration-300 hover:-translate-y-1 hover:bg-[#ff82bd]">
      {children}
    </button>
  );
}