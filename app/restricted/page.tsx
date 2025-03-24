import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/auth/actions";
import { useUserProfile } from "@/utils/hooks/useUserProfile";

export default async function RestrictedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-amber-600">
            Access Restricted
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            This dashboard is only meant for trainers.
          </p>
          <form action={signOut}>
            <Button type="submit" variant="destructive">
              Sign Out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
