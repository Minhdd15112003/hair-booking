import { redirect } from "next/navigation";
import { Router, useRouter } from "next/router";

export default function Home() {
  return redirect("/login");
}
