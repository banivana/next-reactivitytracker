"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  return (
    <section className="py-24 px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl font-notoSans text-center mb-16">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem
            value="item-1"
            className="border rounded-lg px-6 shadow-sm"
          >
            <AccordionTrigger className="text-xl font-notoSans hover:no-underline">
              What do I get exactly?
            </AccordionTrigger>
            <AccordionContent className="text-lg font-notoSans">
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Reactivity Tracker Mobile App for your clients to easily track
                  triggers, health, etc.
                </li>
                <li>
                  Trainers Dashboard (web-based) where you can see your clients
                  data.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="border rounded-lg px-6 shadow-sm"
          >
            <AccordionTrigger className="text-xl font-notoSans hover:no-underline">
              Who is Reactivity Tracker for?
            </AccordionTrigger>
            <AccordionContent className="text-lg font-notoSans">
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Dog professionals who want to gain a deeper understanding of
                  dog behavior and learn from objective data, patterns, and
                  graphs.
                </li>
                <li>
                  Dog guardians who want to track their dog's triggers and
                  health, gain insights into behavior patterns, and have an easy
                  way to communicate behavior changes with other professionals.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="border rounded-lg px-6 shadow-sm"
          >
            <AccordionTrigger className="text-xl font-notoSans hover:no-underline">
              Is the Reactivity Tracker available now?
            </AccordionTrigger>
            <AccordionContent className="text-lg font-notoSans">
              The mobile app is in beta (
              <a
                href="https://forms.gle/QTbF4Ls9X7jUCRpP9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFB915] hover:underline ml-1"
              >
                Join testing for free!
              </a>{" "}
              ). The trainer dashboard is launching soon—sign up for{" "}
              <a
                href="https://forms.gle/yy6R55PwBhrnuoD16"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFB915] hover:underline ml-1"
              >
                early access
              </a>
              .
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-4"
            className="border rounded-lg px-6 shadow-sm"
          >
            <AccordionTrigger className="text-xl font-notoSans hover:no-underline">
              How can I get early access to the trainer dashboard?
            </AccordionTrigger>
            <AccordionContent className="text-lg font-notoSans">
              <a
                href="https://forms.gle/yy6R55PwBhrnuoD16"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFB915] hover:underline ml-1"
              >
                Join early access
              </a>
              , and we’ll notify you when it’s ready.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-5"
            className="border rounded-lg px-6 shadow-sm"
          >
            <AccordionTrigger className="text-xl font-notoSans hover:no-underline">
              Can I start using the mobile app now?
            </AccordionTrigger>
            <AccordionContent className="text-lg font-notoSans">
              Yes! Dog owners can start tracking triggers (
              <a
                href="https://forms.gle/QTbF4Ls9X7jUCRpP9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFB915] hover:underline ml-1"
              >
                Start using now!
              </a>
              ) while we finalize the trainer dashboard.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-6"
            className="border rounded-lg px-6 shadow-sm"
          >
            <AccordionTrigger className="text-xl font-notoSans hover:no-underline">
              What&apos;s the point in tracking data?
            </AccordionTrigger>
            <AccordionContent className="text-lg font-notoSans">
              Tracking data helps both trainers and dog owners in several ways:
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Identify patterns in reactive behavior and triggers</li>
                <li>Monitor the effectiveness of training interventions</li>
                <li>Track progress objectively over time</li>
                <li>Make informed decisions about training adjustments</li>
                <li>
                  Provide concrete evidence of improvement to maintain
                  motivation
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
