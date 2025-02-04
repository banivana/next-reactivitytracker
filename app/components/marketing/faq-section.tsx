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
              Reactivity Tracker is designed for professional dog trainers and
              behaviorists who work with reactive dogs. It helps you collect and
              analyze data from your clients, making it easier to track progress
              and adjust training plans based on concrete information.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
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

          <AccordionItem
            value="item-4"
            className="border rounded-lg px-6 shadow-sm"
          >
            <AccordionTrigger className="text-xl font-notoSans hover:no-underline">
              How long do I have access when I buy?
            </AccordionTrigger>
            <AccordionContent className="text-lg font-notoSans">
              When you purchase Reactivity Tracker, you get unlimited access to
              both the mobile app and trainer dashboard. Your subscription
              includes all future updates and improvements to the platform.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-5"
            className="border rounded-lg px-6 shadow-sm"
          >
            <AccordionTrigger className="text-xl font-notoSans hover:no-underline">
              Can I get my money back?
            </AccordionTrigger>
            <AccordionContent className="text-lg font-notoSans">
              Yes, we offer a 30-day money-back guarantee. If you're not
              satisfied with Reactivity Tracker, simply contact us within 30
              days of your purchase, and we'll process your refund with no
              questions asked.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
