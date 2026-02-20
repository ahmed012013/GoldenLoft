import { redirect } from "next/navigation";

export default function LoftsPage() {
  redirect("/dashboard?tab=lofts&view=all");
}
