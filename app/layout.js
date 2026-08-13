import "./globals.css";

export const metadata = {
  title: "JEE Tracker",
  description: "Track your JEE Main mock test performance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <nav className="border-b bg-white">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-bold text-lg text-indigo-700">
              JEE Tracker
            </a>
            <div className="flex gap-4 text-sm font-medium">
              <a href="/" className="hover:text-indigo-700">Dashboard</a>
              <a href="/add" className="hover:text-indigo-700">Add Test</a>
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
