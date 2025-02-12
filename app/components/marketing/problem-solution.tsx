import { X, Check } from "lucide-react";

export function ProblemSolution() {
  return (
    <section className="py-24 px-4 mx-2 md:px-6 lg:px-8 bg-[#FAFAFA] rounded-[100px] overflow-hidden border border-[#E1E1E1]">
      <div className="mx-auto">
        <div className="p-8 md:p-12 lg:p-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl font-notoSans">
              Take guesswork out of your training plan
            </h2>
            <p className="mt-4 text-xl font-notoSans">
              with easy-to-use tracker connected to a desktop dashboard for
              trainers!
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-12 md:gap-8 lg:gap-16">
            {/* Before Column */}
            <div className="space-y-8 flex-1">
              <div className="text-center mb-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E1E1E1]"></div>
                </div>
                <span className="relative inline-block px-6 py-2 rounded-full border border-[#E1E1E1] font-ubuntu font-bold bg-white">
                  Before
                </span>
              </div>
              <div className="space-y-6">
                <Problem
                  text={
                    <>
                      <span className="font-semibold">Limited visibility</span>{" "}
                      into daily behaviours and stress levels of dog clients
                    </>
                  }
                />
                <Problem
                  text={
                    <>
                      <span className="font-semibold">
                        Incomplete or forgotten information
                      </span>{" "}
                      from pet owners during consultation
                    </>
                  }
                />
                <Problem
                  text={
                    <>
                      <span className="font-semibold">
                        Difficulty identifying patterns
                      </span>{" "}
                      and tracking progress
                    </>
                  }
                />
                <Problem
                  text={
                    <>
                      <span className="font-semibold">Time-consuming</span>{" "}
                      process of collecting and organizing client data
                    </>
                  }
                />
                <Problem
                  text={
                    <>
                      <span className="font-semibold">
                        No clear way to track
                      </span>{" "}
                      how interventions like medications or training affect
                      dog&apos;s well-being over time
                    </>
                  }
                />
              </div>
            </div>

            {/* After Column */}
            <div className="space-y-8 flex-1">
              <div className="text-center mb-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E1E1E1]"></div>
                </div>
                <span className="relative inline-block px-6 py-2 rounded-full border border-[#E1E1E1] font-ubuntu font-bold bg-white">
                  After
                </span>
              </div>
              <div className="space-y-6">
                <Solution
                  text={
                    <>
                      <span className="font-semibold">
                        Comprehensive mobile app
                      </span>{" "}
                      for daily tracking of behaviors, triggers, and health
                      metrics
                    </>
                  }
                />
                <Solution
                  text={
                    <>
                      Easy-to-use interface that{" "}
                      <span className="font-semibold">
                        encourages consistent documentation
                      </span>{" "}
                      from pet owners
                    </>
                  }
                />
                <Solution
                  text={
                    <>
                      <span className="font-semibold">
                        Visual analytics and graphs
                      </span>{" "}
                      that reveal patterns and progress over time
                    </>
                  }
                />
                <Solution
                  text={
                    <>
                      <span className="font-semibold">
                        Synchronized dashboard
                      </span>{" "}
                      giving trainers complete visibility into client data and
                      progress
                    </>
                  }
                />
                <Solution
                  text={
                    <>
                      Data-driven insights show clear impact of interventions on
                      dog&apos;s{" "}
                      <span className="font-semibold">
                        well-being through time-based analytics
                      </span>
                    </>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Problem({ text }: { text: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
        <X className="w-4 h-4 text-red-600" />
      </div>
      <p className="font-normal font-notoSans">{text}</p>
    </div>
  );
}

function Solution({ text }: { text: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
        <Check className="w-4 h-4 text-green-600" />
      </div>
      <p className="font-normal font-notoSans">{text}</p>
    </div>
  );
}
