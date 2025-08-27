import Image from "next/image";
import {
  BarChart3,
  Notebook,
  PieChart,
  Smartphone,
  Users,
  TextSearch,
  FileClock,
  SignpostBig,
  BrainCog,
  ArrowRight,
} from "lucide-react";
import type { ReactNode } from "react";

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl font-notoSans mb-16 text-center">
          What do you get with Reactivity Tracker?
        </h2>

        {/* Mobile App Feature */}
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-16 mb-32">
          <div className="flex-1 order-1 md:order-1">
            <h3 className="text-3xl font-black tracking-tight sm:text-4xl font-notoSans mb-6">
              Track, Organize, Visualize!
            </h3>
            <p className="text-xl mb-4 font-notoSans">
              The Reactivity Tracker mobile app (
              <span className="font-semibold">Beta available now!</span>)
              empowers dog guardians to log their dog&apos;s triggers, health
              updates, and important notes with ease.
            </p>
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <ArrowRight className="text-[#FFB915]" />
              <span className="text-xl font-notoSans">
                Want to test our app for free?
              </span>
              <span className="flex items-center text-xl font-notoSans">
                Sign up
                <a
                  href="https://reactivitytracker.kit.com/apptest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFB915] hover:underline ml-1"
                >
                  here!
                </a>
              </span>
            </div>
            <div className="space-y-8">
              <Feature
                icon={<Smartphone className="w-4 h-4" />}
                description="Simplified tracking with an intuitive, user-friendly interface"
              />
              <Feature
                icon={<Notebook className="w-4 h-4" />}
                description="Daily journal organized by date"
              />
              <Feature
                icon={<BarChart3 className="w-4 h-4" />}
                description="Visualize data with clear graphs to track progress and identify trends."
              />
            </div>
          </div>
          <div className="flex-1 order-2 md:order-2">
            <div className="relative mx-auto max-w-[800px]">
              <Image
                src="/images/mobile-features.png"
                alt="Mobile app interface showing reactivity tracking features: location selection, zone distribution analytics, and daily journal entries"
                width={800}
                height={600}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Dashboard Feature */}
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-16 mb-32">
          <div className="flex-1 order-2 md:order-1">
            <div className="relative mx-auto max-w-[800px] md:max-w-full">
              <Image
                src="/images/dashboard-features.png"
                alt="Reactivity Tracker desktop dashboard showing client's journal and analytics"
                width={800}
                height={500}
                className="rounded-2xl"
              />
            </div>
          </div>
          <div className="flex-1 order-1 md:order-2">
            <h3 className="text-3xl font-black tracking-tight sm:text-4xl font-notoSans mb-6">
              Insights at Your Fingerprints
            </h3>
            <p className="text-xl mb-4 font-notoSans">
              With just one click, dive into your client&apos;s detailed data
              through the Trainer Dashboard (
              <span className="font-semibold">Comming soon!</span>).
            </p>
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <ArrowRight className="text-[#FFB915]" />
              <span className="flex items-center text-xl font-notoSans">
                Join the waiting list
                <a
                  href="https://reactivitytracker.kit.com/apptest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFB915] hover:underline ml-1"
                >
                  now!
                </a>
              </span>
            </div>
            <div className="space-y-8">
              <Feature
                icon={<TextSearch className="w-4 h-4" />}
                description="Organized client data"
              />
              <Feature
                icon={<FileClock className="w-4 h-4" />}
                description="Stay connected to your clients' daily realities"
              />
              <Feature
                icon={<PieChart className="w-4 h-4" />}
                description="Use data to tailor your training plan and monitor behavioral changes"
              />
            </div>
          </div>
        </div>

        {/* Data Analysis Feature */}
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 order-1 md:order-1">
            <h3 className="text-3xl font-black tracking-tight sm:text-4xl font-notoSans mb-6">
              Data is powerful, share it easily!
            </h3>
            <p className="text-xl mb-8 font-notoSans">
              Collaborate seamlessly with other professionals, giving them
              access to all the key insights—saving hours of backtracking.
            </p>
            <div className="space-y-8">
              <Feature
                icon={<Users className="w-4 h-4" />}
                description="Export data easily for collaboration with veterinarians and other professionals"
              />
              <Feature
                icon={<SignpostBig className="w-4 h-4" />}
                description="Make decisions grounded in clear, reliable insights"
              />
              <Feature
                icon={<BrainCog className="w-4 h-4" />}
                description="Gain a deeper understanding of behavior and progress through objective analysis"
              />
            </div>
          </div>
          <div className="flex-1 order-2 md:order-2">
            <div className="relative mx-auto max-w-[800px]">
              <Image
                src="/images/features_3a.png"
                alt="Illustration of professionals analyzing dog behavior data with graphs and charts"
                width={600}
                height={450}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeatureProps {
  icon: ReactNode;
  description: string;
}

function Feature({ icon, description }: FeatureProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FFB915] flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="font-notoSans">{description}</p>
      </div>
    </div>
  );
}
