import Image from "next/image";

export function FooterSection() {
  return (
    <footer className="py-24 px-4 md:px-6 lg:px-8 bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl flex justify-center">
        <Image
          src="/images/footer-visual.png"
          alt="Reactivity Tracker Logo"
          width={400}
          height={80}
          className="h-20 w-auto"
        />
      </div>
    </footer>
  );
}
