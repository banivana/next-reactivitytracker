import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Reactivity Tracker</title>
        <meta
          name="description"
          content="Privacy Policy for Reactivity Tracker app - How we collect, use, and protect your data."
        />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-8 md:p-12">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6 mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Privacy Policy
              </h1>
              <p className="text-gray-600 italic">
                <strong>Last updated:</strong> June 10, 2025
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                This Privacy Policy describes how Reactivity Tracker collects,
                uses, and protects your information when you use our mobile
                application for tracking reactive dog triggers and health.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Information We Collect
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-3">
                    Personal Information
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="font-medium text-gray-800 mr-2">
                        Email Address:
                      </span>
                      Used for account registration, login, and communication
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-gray-800 mr-2">
                        Account Information:
                      </span>
                      Username and encrypted password for app access
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-3">
                    User-Generated Content
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="font-medium text-gray-800 mr-2">
                        Dog Trigger Data:
                      </span>
                      Information about your dog&apos;s triggers, including
                      type, date, and descriptions
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-gray-800 mr-2">
                        Health Notes:
                      </span>
                      Health observations and notes you enter about your dog
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-gray-800 mr-2">
                        Journal Entries:
                      </span>
                      Daily logs and other content you create within the app
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-3">
                    Usage Data
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="font-medium text-gray-800 mr-2">
                        App Interactions:
                      </span>
                      How you navigate and use the app features
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-gray-800 mr-2">
                        Device Information:
                      </span>
                      Basic device and app performance data
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                How We Use Your Information
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-gray-800">
                      App Functionality:
                    </span>{" "}
                    To provide core features like data storage, user
                    authentication, and personalized tracking
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-gray-800">
                      Account Management:
                    </span>{" "}
                    To manage your subscription and provide customer support
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-gray-800">
                      App Improvement:
                    </span>{" "}
                    To analyze usage patterns and improve our services
                  </div>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Data Storage and Security
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <ul className="space-y-2 text-gray-700">
                  <li>• Your data is stored securely on our servers</li>
                  <li>
                    • We use industry-standard encryption to protect your
                    information
                  </li>
                  <li>
                    • Only you can access your personal dog tracking data
                    through your account
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Information Sharing
              </h2>
              <p className="text-gray-700 mb-3">
                We do not sell, trade, or share your personal information with
                third parties, except:
              </p>
              <ul className="space-y-2 text-gray-600 ml-4">
                <li>• When required by law</li>
                <li>• To protect our rights or comply with legal processes</li>
                <li>• With your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your Rights
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Access</h4>
                  <p className="text-green-700 text-sm">
                    You can view all your data within the app
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Deletion</h4>
                  <p className="text-red-700 text-sm">
                    You can delete your account and all associated data
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">
                    Correction
                  </h4>
                  <p className="text-yellow-700 text-sm">
                    You can edit or update your information at any time
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Subscription and Payment
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 text-gray-700">
                  <li>
                    • Payment processing is handled by Apple&apos;s App Store
                  </li>
                  <li>• We do not store your payment information</li>
                  <li>
                    • Subscription data is used only to provide premium features
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Children&apos;s Privacy
              </h2>
              <p className="text-gray-700">
                Our app is not intended for children under 13. We do not
                knowingly collect personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Changes to This Policy
              </h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy
                within the app and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Contact Us
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-800">
                    <span className="font-medium">Email:</span>{" "}
                    [hello@reactivitytracker.com]
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Website:</span>{" "}
                    reactivitytracker.com
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
