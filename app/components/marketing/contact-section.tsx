export function ContactSection() {
  return (
    <section
      id="contact"
      className="py-24 px-4 md:px-6 lg:px-8 bg-[#FFB915]/25"
    >
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl font-notoSans mb-8">
          Do you have additional questions?
        </h2>
        <p className="text-xl font-notoSans max-w-3xl mx-auto">
          Feel free to e-mail us at{" "}
          <a
            href="mailto:banivana5@gmail.com"
            className="underline hover:no-underline"
          >
            banivana5@gmail.com
          </a>{" "}
          and we&apos;ll be happy to answer your questions and provide
          additional information you need.
        </p>
      </div>
    </section>
  );
}
