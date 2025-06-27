import Head from "next/head";

export default function PrivacyPolicy() {
  const sections = [
    { id: "interpretation", title: "Interpretation and Definitions" },
    { id: "collecting", title: "Collecting and Using Your Personal Data" },
    { id: "tracking", title: "Tracking Technologies and Cookies" },
    { id: "legal-basis", title: "Legal Basis for Processing" },
    { id: "use", title: "Use of Your Personal Data" },
    { id: "third-party-services", title: "Third-Party Service Providers" },
    { id: "retention", title: "Retention of Your Personal Data" },
    { id: "transfer", title: "Transfer of Your Personal Data" },
    { id: "data-transfer", title: "International Data Transfers" },
    { id: "your-rights", title: "Your Rights" },
    { id: "disclosure", title: "Disclosure of Your Personal Data" },
    { id: "marketing", title: "Marketing Communications" },
    { id: "security", title: "Security of Your Personal Data" },
    { id: "children", title: "Children's Privacy" },
    { id: "links", title: "Links to Other Websites" },
    { id: "changes", title: "Changes to this Privacy Policy" },
    { id: "contact", title: "Contact Us" },
  ];

  return (
    <>
      <Head>
        <title>Privacy Policy - ReactivityTracker</title>
        <meta
          name="description"
          content="Privacy Policy for ReactivityTracker - Learn how we collect, use, and protect your personal data."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              ReactivityTracker
            </h1>
            <p className="text-gray-600 mt-2">Privacy Policy</p>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents - Sidebar */}
            <aside className="lg:w-64 lg:flex-shrink-0">
              <div className="sticky top-8 bg-white rounded-lg shadow-sm border p-6">
                <h2 className="font-semibold text-gray-900 mb-4">
                  Table of Contents
                </h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm text-gray-600 hover:text-blue-600 py-1 transition-colors"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-white rounded-lg shadow-sm border">
              <div className="p-8">
                {/* Header Section */}
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Privacy Policy
                  </h1>
                  <p className="text-gray-600 mb-2">
                    Last updated: June 16, 2025
                  </p>

                  <div className="prose max-w-none text-gray-700 leading-relaxed">
                    <p>
                      Reactivity Tracker is a small team from Croatia, operated
                      by Monitum d.o.o. This Privacy Policy explains how we
                      collect, use, and protect your personal data when you use
                      our website (www.reactivitytracker.com) and mobile app
                      (collectively, &quot;the Service&quot;). As a
                      Croatia-based company, we comply with the General Data
                      Protection Regulation (GDPR) and applicable Croatian data
                      protection laws.
                    </p>
                  </div>
                </div>
                {/* Interpretation and Definitions */}
                <section id="interpretation" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Interpretation and Definitions
                  </h2>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Interpretation
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      The words of which the initial letter is capitalized have
                      meanings defined under the following conditions. The
                      following definitions shall have the same meaning
                      regardless of whether they appear in singular or in
                      plural.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Definitions
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          term: "Account",
                          definition:
                            "means a unique account created for You to access our Service or parts of our Service.",
                        },
                        {
                          term: "Affiliate",
                          definition:
                            'means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.',
                        },
                        {
                          term: "Application",
                          definition:
                            "refers to ReactivityTracker, the software program provided by the Company.",
                        },
                        {
                          term: "Company",
                          definition:
                            '(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Monitum d.o.o, Karamanova 4, 21000 Split.',
                        },
                        {
                          term: "Cookies",
                          definition:
                            "are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.",
                        },
                        { term: "Country", definition: "refers to: Croatia" },
                        {
                          term: "Device",
                          definition:
                            "means any device that can access the Service such as a computer, a cellphone or a digital tablet.",
                        },
                        {
                          term: "Personal Data",
                          definition:
                            "is any information that relates to an identified or identifiable individual.",
                        },
                        {
                          term: "Service",
                          definition:
                            "refers to the Application or the Website or both.",
                        },
                        {
                          term: "Service Provider",
                          definition:
                            "means any natural or legal person who processes the data on behalf of the Company.",
                        },
                        {
                          term: "Usage Data",
                          definition:
                            "refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself.",
                        },
                        {
                          term: "Website",
                          definition:
                            "refers to Reactivity Tracker, accessible from https://www.reactivitytracker.com/",
                        },
                        {
                          term: "You",
                          definition:
                            "means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service.",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-blue-200 pl-4"
                        >
                          <dt className="font-semibold text-gray-800">
                            {item.term}
                          </dt>
                          <dd className="text-gray-700 mt-1">
                            {item.definition}
                          </dd>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Collecting and Using Personal Data */}
                <section id="collecting" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Collecting and Using Your Personal Data
                  </h2>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Types of Data Collected
                    </h3>

                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-3">
                        Personal Data
                      </h4>
                      <p className="text-gray-700 mb-3">
                        While using Our Service, We may ask You to provide Us
                        with certain personally identifiable information that
                        can be used to contact or identify You. Personally
                        identifiable information may include, but is not limited
                        to:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700">
                        <li>Email address</li>
                        <li>First name and last name</li>
                        <li>Usage Data</li>
                      </ul>
                      <p className="text-gray-700 my-3">
                        To use the Application, you’ll need to create an
                        account. There are three ways to make an account; by
                        using your Google account, by using your Apple ID, or by
                        using a one-time email link.
                      </p>
                      <p className="text-gray-700 mb-3">
                        Once you have created an account, you will benefit from
                        the access to the Application to view any data you
                        choose to submit.
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-3">
                        Usage Data
                      </h4>
                      <p className="text-gray-700 mb-3">
                        Usage Data is collected automatically when using the
                        Service.
                      </p>
                      <p className="text-gray-700 mb-3">
                        Usage Data may include information such as Your
                        Device&apos;s Internet Protocol address (e.g. IP
                        address), browser type, browser version, the pages of
                        our Service that You visit, the time and date of Your
                        visit, the time spent on those pages, unique device
                        identifiers and other diagnostic data.
                      </p>
                      <p className="text-gray-700">
                        When You access the Service by or through a mobile
                        device, We may collect certain information
                        automatically, including, but not limited to, the type
                        of mobile device You use, Your mobile device unique ID,
                        the IP address of Your mobile device, Your mobile
                        operating system, the type of mobile Internet browser
                        You use, unique device identifiers and other diagnostic
                        data.
                      </p>
                      <p className="text-gray-700">
                        We may also collect information that Your browser sends
                        whenever You visit our Service or when You access the
                        Service by or through a mobile device.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Tracking Technologies */}
                <section id="tracking" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Tracking Technologies and Cookies
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We use Cookies and similar tracking technologies to track
                    the activity on Our Service and store certain information.
                    Tracking technologies used are beacons, tags, and scripts to
                    collect and track information and to improve and analyze Our
                    Service. The technologies We use may include:
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Cookies or Browser Cookies
                      </h4>
                      <p className="text-gray-700 text-sm">
                        A cookie is a small file placed on Your Device. You can
                        instruct Your browser to refuse all Cookies or to
                        indicate when a Cookie is being sent. However, if You do
                        not accept Cookies, You may not be able to use some
                        parts of our Service. Unless you have adjusted Your
                        browser setting so that it will refuse Cookies, our
                        Service may use Cookies.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Web Beacons
                      </h4>
                      <p className="text-gray-700 text-sm">
                        Certain sections of our Service and our emails may
                        contain small electronic files known as web beacons
                        (also referred to as clear gifs, pixel tags, and
                        single-pixel gifs) that permit the Company, for example,
                        to count users who have visited those pages or opened an
                        email and for other related website statistics (for
                        example, recording the popularity of a certain section
                        and verifying system and server integrity).
                      </p>
                    </div>
                    <p className="text-gray-700">
                      Cookies can be &quot;Persistent&quot; or
                      &quot;Session&quot; Cookies. Persistent Cookies remain on
                      Your personal computer or mobile device when You go
                      offline, while Session Cookies are deleted as soon as You
                      close Your web browser.
                    </p>
                    <p className="text-gray-700">
                      We use both Session and Persistent Cookies for the
                      purposes set out below:
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-800">
                      Cookie Types We Use:
                    </h4>
                    {[
                      {
                        name: "Necessary / Essential Cookies",
                        type: "Session Cookies",
                        administration: "Us",
                        purpose:
                          "These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.",
                      },
                      {
                        name: "Cookies Policy / Notice Acceptance Cookies",
                        type: "Persistent Cookies",
                        administration: "Us",
                        purpose:
                          "These Cookies identify if users have accepted the use of cookies on the Website.",
                      },
                      {
                        name: "Functionality Cookies",
                        type: "Persistent Cookies",
                        administration: "Us",
                        purpose:
                          "These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.",
                      },
                    ].map((cookie, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h5 className="font-medium text-gray-800">
                          {cookie.name}
                        </h5>
                        <p className="text-gray-700 text-sm mt-1">
                          Type: {cookie.type}
                        </p>
                        <p className="text-gray-700 text-sm mt-1">
                          Administered by: {cookie.administration}
                        </p>
                        <p className="text-gray-700 text-sm mt-1">
                          Purpose: {cookie.purpose}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="legal-basis" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Legal Basis for Processing
                  </h2>
                  <p className="text-gray-700 mb-3">
                    We process your personal data based on the following legal
                    grounds:
                  </p>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Consent
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Newsletter subscriptions</li>
                    <li>Marketing communications</li>
                    <li>Optional analytics cookies</li>
                  </ul>
                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                    Contract Performance
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Account creation and management</li>
                    <li>Providing the ReactivityTracker service</li>
                    <li>Customer support</li>
                  </ul>
                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                    Legitimate Interest
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Website analytics for service improvement</li>
                    <li>Security and fraud prevention</li>
                    <li>Technical service optimization</li>
                    <li>Understanding user behavior to improve our service</li>
                  </ul>
                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                    Legal Obligation
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Compliance with Croatian and EU laws</li>
                    <li>Tax and accounting requirements</li>
                    <li>Response to legal requests</li>
                  </ul>
                  <p className="text-gray-700 my-3">
                    You have the right to object to processing based on
                    legitimate interest. Contact us at
                    hello@reactivitytracker.com to exercise this right.
                  </p>
                </section>

                {/* Use of Personal Data */}
                <section id="use" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Use of Your Personal Data
                  </h2>
                  <p className="text-gray-700 mb-4">
                    The Company may use Personal Data for the following
                    purposes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      <strong>To provide and maintain our Service</strong>,
                      including to monitor the usage of our Service
                    </li>
                    <li>
                      <strong>To manage Your Account:</strong> to manage Your
                      registration as a user of the Service. The Personal Data
                      You provide can give You access to different
                      functionalities of the Service that are available to You
                      as a registered user.
                    </li>
                    <li>
                      <strong>For the performance of a contract:</strong> the
                      development, compliance and undertaking of the purchase
                      contract for the products, items or services You have
                      purchased or of any other contract with Us through the
                      Service.
                    </li>
                    <li>
                      <strong>To contact You:</strong> To contact You by email
                      or other equivalent forms of electronic communication,
                      such as a mobile application&apos;s push notifications
                      regarding updates or informative communications related to
                      the functionalities, products or contracted services,
                      including the security updates, when necessary or
                      reasonable for their implementation.
                    </li>
                    <li>
                      <strong>To provide You</strong> with news, special offers
                      and general information about other goods, services and
                      events which we offer that are similar to those that you
                      have already purchased or enquired about unless You have
                      opted not to receive such information.
                    </li>
                    <li>
                      <strong>To manage Your requests:</strong> To attend and
                      manage Your requests to Us.
                    </li>
                    <li>
                      <strong>For other purposes:</strong> We may use Your
                      information for other purposes, such as data analysis,
                      identifying usage trends, determining the effectiveness of
                      our promotional campaigns and to evaluate and improve our
                      Service, products, services, marketing and your
                      experience.
                    </li>
                  </ul>
                  <p className="text-gray-700 my-4">
                    We may share Your personal information in the following
                    situations:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      <strong>With Service Providers:</strong> We may share your
                      personal information with Service Providers to monitor and
                      analyze the use of our Service, to contact you, and to
                      provide our core app functionality. This includes Supabase
                      (our database and authentication provider) which processes
                      and stores your account information and app data.
                    </li>
                    <li>
                      <strong>With other users:</strong> when You share personal
                      information or otherwise interact in the public areas with
                      other users, such information may be viewed by all users
                      and may be publicly distributed outside.
                    </li>
                    <li>
                      <strong>With Your consent:</strong> We may disclose Your
                      personal information for any other purpose with Your
                      consent.
                    </li>
                  </ul>
                  <p className="text-gray-700 my-4">
                    We will not sell your personal information to third parties.
                    We do not use your data for profiling.
                  </p>
                </section>

                <section id="third-party-services" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Third-Party Service Providers
                  </h2>
                  <p className="text-gray-700 mb-3">
                    We share certain personal data with trusted third-party
                    service providers to operate and improve our Service. We
                    only share data that is necessary for the specific service
                    and ensure these providers have appropriate data protection
                    measures in place.
                  </p>

                  <p className="text-gray-700 mb-4">
                    <strong>Legal basis:</strong> We share this data based on
                    our legitimate interest in providing and improving our
                    services, and where required, with your consent.
                  </p>

                  <ul className="list-disc pl-6 space-y-4 text-gray-700">
                    <li>
                      <strong>Supabase:</strong> We use Supabase as our primary
                      database and authentication service provider to securely
                      store your account information, tracking data, and all
                      app-related content. Supabase processes this data
                      according to their{" "}
                      <a
                        href="https://supabase.com/privacy"
                        className="text-blue-600 underline"
                      >
                        Privacy Policy
                      </a>{" "}
                      and maintains industry-standard security measures
                      including encryption at rest and in transit. Your data is
                      stored on secure servers and Supabase acts as a data
                      processor under our instructions.
                    </li>
                    <li>
                      <strong>Google Analytics:</strong> We share usage data
                      (such as pages visited, device information, and general
                      location data) to analyze website and app performance,
                      improve user experience, and enhance security. Google
                      Analytics processes this data according to their{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        className="text-blue-600 underline"
                      >
                        Privacy Policy
                      </a>
                      . You can opt out of Google Analytics tracking using their{" "}
                      <a
                        href="https://tools.google.com/dlpage/gaoptout"
                        className="text-blue-600 underline"
                      >
                        opt-out tool
                      </a>
                      .
                    </li>
                    <li>
                      <strong>Kit (Newsletter Service):</strong> When you
                      subscribe to our newsletter, we share your email address
                      and any information you provide during signup with Kit.
                      This data is processed according to Kit&apos;s{" "}
                      <a
                        href="https://convertkit.com/privacy"
                        className="text-blue-600 underline"
                      >
                        Privacy Policy
                      </a>
                      . You can unsubscribe at any time.
                    </li>
                  </ul>

                  <p className="text-gray-700 mt-4">
                    All our third-party providers are required to maintain
                    appropriate security measures and use your data only for the
                    purposes we specify. You have the right to object to this
                    processing - contact us at hello@reactivitytracker.com for
                    more information.
                  </p>
                </section>

                <section id="retention" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Retention of Your Personal Data
                  </h2>
                  <p className="text-gray-700 mb-3">
                    The Company will retain Your Personal Data only for as long
                    as is necessary for the purposes set out in this Privacy
                    Policy. We will retain and use Your Personal Data to the
                    extent necessary to comply with our legal obligations (for
                    example, if we are required to retain your data to comply
                    with applicable laws), resolve disputes, and enforce our
                    legal agreements and policies.
                  </p>
                  <p className="text-gray-700 mb-3">
                    The Company will also retain Usage Data for internal
                    analysis purposes. Usage Data is generally retained for a
                    shorter period of time, except when this data is used to
                    strengthen the security or to improve the functionality of
                    Our Service, or We are legally obligated to retain this data
                    for longer time periods.
                  </p>
                </section>

                <section id="transfer" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Transfer of Your Personal Data
                  </h2>
                  <p className="text-gray-700 mb-3">
                    Your information, including Personal Data, is processed at
                    the Company&apos;s operating offices and in any other places
                    where the parties involved in the processing are located. It
                    means that this information may be transferred to and
                    maintained on computers located outside of Your state,
                    province, country or other governmental jurisdiction where
                    the data protection laws may differ than those from Your
                    jurisdiction.
                  </p>
                  <p className="text-gray-700 mb-3">
                    Your consent to this Privacy Policy followed by Your
                    submission of such information represents Your agreement to
                    that transfer.
                  </p>
                  <p className="text-gray-700 mb-3">
                    The Company will take all steps reasonably necessary to
                    ensure that Your data is treated securely and in accordance
                    with this Privacy Policy and no transfer of Your Personal
                    Data will take place to an organization or a country unless
                    there are adequate controls in place including the security
                    of Your data and other personal information.
                  </p>
                </section>

                <section id="data-transfer" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    International Data Transfers
                  </h2>
                  <p className="text-gray-700 mb-3">
                    Any personal data we collect from you may only be
                    transferred to countries outside the EU or the European
                    Economic Area (EEA) observing applicable privacy regulations
                    and ensuring that your privacy rights remain protected. This
                    includes ensuring that all such transfers are subject to
                    approved safeguards which meet the requirements of Data
                    Protection Legislation.
                  </p>
                </section>

                <section id="your-rights" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Your Rights
                  </h2>
                  <p className="text-gray-700 mb-3">
                    You’re entitled to ask us to edit your details, delete them
                    completely, or restrict their usage. You also have the right
                    to access your personal details (which mainly consists of
                    your name, email address and your IP address) and to receive
                    a copy. You have the right to request that we transfer your
                    data to another party.
                  </p>
                  <p className="text-gray-700 mb-3">
                    You can also object to our processing of your data
                    (especially for marketing or analytics) and withdraw your
                    consent at any time where we rely on consent (like marketing
                    emails).
                  </p>
                  <h3 className="text-xl font-semibold text-gray-800 my-3">
                    How to exercise your rights
                  </h3>
                  <p className="text-gray-700 mb-3">
                    To exercise any of these rights:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Email us at hello@reactivitytracker.com.</li>
                    <li>
                      Include your account email address and specify your
                      request.
                    </li>
                    <li>
                      We may ask you to verify your identity before processing
                      the request
                    </li>
                  </ul>
                  <p className="text-gray-700 my-3">
                    We will respond to your requests within 30 days. If the
                    request is complex, we may extend this by an additional 60
                    days and will notify you of the extension. Exercising your
                    rights is free of charge.
                  </p>
                </section>

                <section id="disclosure" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Disclosure of Your Personal Data
                  </h2>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Third Party Support Service Providers
                  </h3>
                  <p className="text-gray-700 mb-6">
                    For example: technology service providers, payment
                    providers, data storage providers, and marketing platforms
                    (e.g. for sending marketing emails)
                  </p>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Business Transactions
                  </h3>
                  <p className="text-gray-700 mb-6">
                    If the Company is involved in a merger, acquisition or asset
                    sale, Your Personal Data may be transferred. We will provide
                    notice before Your Personal Data is transferred and becomes
                    subject to a different Privacy Policy.
                  </p>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Law enforcement
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Under certain circumstances, the Company may be required to
                    disclose Your Personal Data if required to do so by law or
                    in response to valid requests by public authorities (e.g. a
                    court or a government agency).
                  </p>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Other legal requirements
                  </h3>
                  <p className="text-gray-700">
                    The Company may disclose Your Personal Data in the good
                    faith belief that such action is necessary to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Comply with a legal obligation</li>
                    <li>
                      Protect and defend the rights or property of the Company
                    </li>
                    <li>
                      Prevent or investigate possible wrongdoing in connection
                      with the Service
                    </li>
                    <li>
                      Protect the personal safety of Users of the Service or the
                      public
                    </li>
                    <li>Protect against legal liability</li>
                  </ul>
                </section>

                <section id="marketing" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Marketing Communications
                  </h2>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Consent for Marketing
                  </h3>
                  <p className="text-gray-700 mb-3">
                    We will only send you marketing communications if:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>You have explicitly consented to receive them</li>
                    <li>You have filled out a form on our website</li>
                    <li>
                      You have purchased our services and we&apos;re marketing
                      similar services (where legally permitted)
                    </li>
                  </ul>
                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                    Types of Marketing Communications
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Service updates and new features</li>
                    <li>
                      Educational content about reactivity, tracking data and
                      dog training
                    </li>
                    <li>Personal experiences with my reactive dog</li>
                    <li>
                      Behind the scenes of the app and website development
                    </li>
                    <li>Special offers and promotions</li>
                  </ul>
                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                    How to Unsubscribe
                  </h3>
                  <p className="text-gray-700 mb-3">
                    You can opt out of our marketing communications at any time
                    by clicking unsubscribe at the bottom of every newsletter,
                    or by emailing us at hello@reactivitytracker.com.
                  </p>
                </section>

                <section id="security" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Security of Your Personal Data
                  </h2>
                  <p className="text-gray-700">
                    The security of Your Personal Data is important to Us, but
                    remember that no method of transmission over the Internet,
                    or method of electronic storage is 100% secure. While We
                    strive to use commercially acceptable means to protect Your
                    Personal Data, We cannot guarantee its absolute security.
                  </p>
                  <p className="text-gray-700">
                    Your data is stored securely using Supabase, a trusted cloud
                    database provider. Supabase maintains industry-standard
                    security measures to protect your information.
                  </p>
                </section>

                <section id="children" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Children&apos;s Privacy
                  </h2>
                  <p className="text-gray-700 mb-3">
                    Our Service does not address anyone under the age of 13. We
                    do not knowingly collect personally identifiable information
                    from anyone under the age of 13. If You are a parent or
                    guardian and You are aware that Your child has provided Us
                    with Personal Data, please contact Us. If We become aware
                    that We have collected Personal Data from anyone under the
                    age of 13 without verification of parental consent, We take
                    steps to remove that information from Our servers.
                  </p>
                  <p className="text-gray-700">
                    If We need to rely on consent as a legal basis for
                    processing Your information and Your country requires
                    consent from a parent, We may require Your parent&apos;s
                    consent before We collect and use that information.
                  </p>
                </section>

                <section id="links" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Links to Other Websites
                  </h2>
                  <p className="text-gray-700 mb-3">
                    Our Service may contain links to other websites that are not
                    operated by Us. If You click on a third party link, You will
                    be directed to that third party&apos;s site. We strongly
                    advise You to review the Privacy Policy of every site You
                    visit.
                  </p>
                  <p className="text-gray-700">
                    We have no control over and assume no responsibility for the
                    content, privacy policies or practices of any third party
                    sites or services.
                  </p>
                </section>

                <section id="changes" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Changes to this Privacy Policy
                  </h2>
                  <p className="text-gray-700 mb-3">
                    We may update this Privacy Policy from time to time. We will
                    notify you of any changes by posting the new Privacy Policy
                    on this page and updating the &quot;Last updated&quot; date.
                  </p>
                  <p className="text-gray-700">
                    You are advised to review this Privacy Policy periodically
                    for any changes. Changes to this Privacy Policy are
                    effective when they are posted on this page.
                  </p>
                </section>

                {/* Contact Section */}
                <section id="contact" className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Contact Us
                  </h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <p className="text-gray-700 mb-4">
                      If you have any questions about this Privacy Policy, You
                      can contact us:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800 mr-2">
                          Email:
                        </span>
                        <a
                          href="mailto:hello@reactivitytracker.com"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          hello@reactivitytracker.com
                        </a>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800 mr-2">
                          Website:
                        </span>
                        <a
                          href="https://www.reactivitytracker.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          https://www.reactivitytracker.com/
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <p className="text-center text-gray-600 text-sm">
              © 2025 ReactivityTracker. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
