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
            <p className="text-xl mb-8 font-notoSans">
              The Reactivity Tracker mobile app empowers dog owners to log their
              dog's triggers, health updates, and important notes with ease.
            </p>
            <div className="space-y-8">
              <Feature
                icon={<Smartphone className="w-6 h-6" />}
                title="Simplified tracking"
                description="with an intuitive, user-friendly interface"
              />
              <Feature
                icon={<Notebook className="w-6 h-6" />}
                title="Daily journal"
                description="organized by date"
              />
              <Feature
                icon={<BarChart3 className="w-6 h-6" />}
                title="Visualize data"
                description="through clear graphs to identify trends and track progress"
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
            <p className="text-xl mb-8 font-notoSans">
              With just one click, dive into your client's detailed data through
              the Trainer Dashboard.
            </p>
            <div className="space-y-8">
              <Feature
                icon={<TextSearch className="w-6 h-6" />}
                title="Organized client data"
                description="Access and manage all your client information in one place"
              />
              <Feature
                icon={<FileClock className="w-6 h-6" />}
                title="Stay updated"
                description="on your clients' day-to-day realities"
              />
              <Feature
                icon={<PieChart className="w-6 h-6" />}
                title="Use data"
                description="to tailor your training plan and monitor behavioral changes"
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
                icon={<Users className="w-6 h-6" />}
                title="Export data easily"
                description="for collaboration with veterinarians or other professionals"
              />
              <Feature
                icon={<SignpostBig className="w-6 h-6" />}
                title="Make decisions"
                description="grounded in clear, reliable insights"
              />
              <Feature
                icon={<BrainCog className="w-6 h-6" />}
                title="Gain a deeper understanding"
                description="of behavior and progress through objective analysis"
              />
            </div>
          </div>
          <div className="flex-1 order-2 md:order-2">
            <div className="relative mx-auto max-w-[800px]">
              <Image
                src="/images/learn-features.png"
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
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#FFB915] flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-bold mb-2 font-notoSans">{title}</h3>
        <p className="font-notoSans">{description}</p>
      </div>
    </div>
  );
}
