import { RequireAuth } from "@/components/require-auth";
import { AccountView } from "./account-view";

export const metadata = { title: "Your account" };

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountView />
    </RequireAuth>
  );
}
