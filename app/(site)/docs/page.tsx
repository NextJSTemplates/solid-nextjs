import { redirect } from "next/navigation";

export default async function DocsPage() {
  redirect("/docs/bootstrap-template"); // Redirect to the default document
}
