import Link from "next/link";

export default function NotFound() {
  return (
    <div className="prose py-10 dark:prose-invert">
      <h1>404</h1>
      <p>That page does not exist.</p>
      <Link href="/">go home</Link>
    </div>
  );
}
