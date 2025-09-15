import { Card, CardHeader } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Logo from "@/components/Logo";

interface PageProps {
  searchParams: Promise<{
    platform?: string;
  }>;
}

export default async function SuccessfulInvitePage({
  searchParams,
}: PageProps) {
  const { platform } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="text-center pb-6">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <Logo className="h-12 w-auto" />
            <span className="text-3xl font-extrabold ml-3">
              <span className="text-[#FFB915]">Reactivity</span>Tracker
            </span>
          </div>

          <div className="space-y-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon
                icon={faCheck}
                className="w-8 h-8 text-green-600"
              />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Registration Successful!
            </h1>

            <p className="text-gray-600 text-sm leading-relaxed">
              Thank you for completing your registration. We will send you a
              download link for the{" "}
              {platform && (
                <span className="font-medium capitalize">{platform}</span>
              )}{" "}
              app as soon as possible.
            </p>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
