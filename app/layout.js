import "./globals.css";

export const metadata = {
  title: "EarlyJobs | Hiring workspace",
  description: "A focused applicant tracking workspace for the EarlyJobs.ai recruiting team."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
