import LoginPageClient from "./LoginPageClient";

interface LoginPageProps {
  searchParams: Promise<{
    inviteId?: string;
    redirectedFrom?: string;
    message?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { inviteId, redirectedFrom, message } = await searchParams;

  return (
    <LoginPageClient
      redirectedFrom={redirectedFrom}
      message={message}
      inviteId={inviteId}
    />
  );
}
