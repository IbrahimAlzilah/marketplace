import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "system-ui, sans-serif"
        }}>
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <Link href="/en" style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#0d9488",
            color: "white",
            textDecoration: "none",
            borderRadius: "0.375rem"
          }}>
            Go to Home Page
          </Link>
        </div>
      </body>
    </html>
  );
}
