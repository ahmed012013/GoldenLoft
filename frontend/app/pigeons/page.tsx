import { redirect } from "next/navigation";

export default function PigeonsPage() {
  redirect("/dashboard?tab=pigeons&view=all");
}
