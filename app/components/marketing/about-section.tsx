import Image from "next/image";

export function AboutSection() {
  return (
    <section
      className="py-24 px-4 md:px-6 lg:px-8 bg-[#FAFAFA] border border-[#E1E1E1]"
      id="about"
    >
      <div className="flex flex-col gap-20 mx-auto max-w-7xl">
        {/* Penny's Story */}
        <div className="flex flex-col md:flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1 order-2 md:order-2">
            <div className="space-y-8">
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl font-notoSans">
                This is Penny,
              </h2>
              <p className="text-xl font-notoSans">
                our little sensitive pup who turned our worlds upside-down. And
                we are <span className="font-bold">Domagoj</span> and{" "}
                <span className="font-bold">Ivana</span> who try to take a good
                care for this fella.
              </p>
              <p className="text-xl font-notoSans">
                As a first-time dog owners we where over the moon excited to
                adopt our own dog. However, reality was a bit different for us.
                Penny came with set of challenges we weren&apos;t prepared for.
                Health issues, lunging and barking towards other dogs and
                strangers, noise sensitivity, fearful of new environments, can
                anxiety,...
              </p>
              <p className="text-xl font-notoSans">
                Very soon we realized we need help and found{" "}
                <span className="font-bold">Igor</span>, dog trainer, and now
                our friend who helped us immensely on this journey.
              </p>
            </div>
          </div>
          <div className="relative order-1 md:order-1 max-w-[500px] md:w-3/4 mx-auto md:mx-0">
            <div className="absolute inset-0 bg-[#ffb915] scale-110 origin-center rotate-3" />
            <Image
              src="/images/Penny_sqare.png"
              alt="Penny, a scruffy dark-colored dog with a happy expression"
              width={800}
              height={800}
              className="relative w-full object-cover aspect-square"
            />
          </div>
        </div>

        {/* Our Story */}
        <div className="flex flex-col md:flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1 order-2 md:order-2 lg:order-1 space-y-8 md:pr-8">
            <p className="text-xl font-notoSans">
              Both Domagoj and I have a background in natural sciences and
              engineering, so it was natural for us to investigate how data
              could help us in our reactivity journey, which is usually very
              descriptive and full of emotions.
            </p>
            <p className="text-xl font-notoSans">
              So, basically since the beginning of our journey we felt the need
              to write some kind of journal. To{" "}
              <span className="font-bold">ease our minds</span>, to{" "}
              <span className="font-bold">track progress</span>, and after all
              to <span className="font-bold">communicate more easily</span> our
              progress with Igor. This journal started as pen and paper, then
              google docs, then excell table, and finally as Reactivity Tracker
              app.
            </p>
          </div>
          <div className="relative order-1 md:order-1 lg:order-2 max-w-[500px] md:w-3/4 mx-auto">
            <div className="absolute inset-0 bg-[#ffb915] scale-110 origin-center -rotate-3" />
            <Image
              src="/images/DIP.png"
              alt="Domagoj and Ivana taking a selfie with their dog Penny in a forest setting"
              width={400}
              height={300}
              className="relative w-full object-cover"
            />
          </div>
        </div>

        {/* Igor's Story */}
        <div className="flex flex-col md:flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1 order-2 md:order-2 space-y-8 md:pr-8">
            <h3 className="text-3xl font-black tracking-tight font-notoSans">
              This is Igor,
            </h3>
            <p className="text-xl font-notoSans">
              dog trainer specialized in reactivity and separation anxiety. His
              kind approach and understanding, both - for dogs and pet parents,
              immediately made sense to us. His curiosity and understanding
              about brain development, appreciating complexity of a problem
              amazes me.
            </p>
            <p className="text-xl font-notoSans">
              Together we so the potential in making a tool that would:
            </p>
            <ul className="space-y-4 text-xl font-notoSans">
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <p className="text-left">
                  help behavior professionals to dig deeper in{" "}
                  <span className="font-bold">understanding the behavior</span>{" "}
                  and patterns
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <p className="text-left">
                  help{" "}
                  <span className="font-bold">
                    track some parameters and progress
                  </span>
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <p className="text-left">
                  and improve the{" "}
                  <span className="font-bold">
                    client-trainer communication
                  </span>
                </p>
              </li>
            </ul>
          </div>
          <div className="relative order-1 md:order-1 max-w-[500px] md:w-3/4 mx-auto md:mx-0">
            <div className="absolute inset-0 bg-[#ffb915] scale-110 origin-center rotate-3" />
            <Image
              src="/images/Igor.jpg"
              alt="Igor giving a professional presentation about dog training"
              width={800}
              height={800}
              className="relative w-full object-cover aspect-square"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
