import Link from "next/link";
import {
  Sparkles,
  Rocket,
  FileText,
  Wand2,
  ShieldCheck,
  PackageCheck,
  ArrowRight,
  Instagram,
  Twitter,
  Mail,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased selection:bg-purple-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 bg-slate-950/80 backdrop-blur-lg z-50 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 text-xl font-bold tracking-tight hover:text-purple-400 transition">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span>PageFairy</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center text-sm font-bold rounded-full px-5 py-2 bg-white text-slate-900 hover:bg-slate-200 border-none"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -z-10" />

        <div className="container mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold uppercase tracking-wide mb-8">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>Built for Beauty Entrepreneurs</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
            Launch your product line with
            <br />
            <span className="ticker-container text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              <span className="ticker-item flex flex-col">
                <span>Zero Inventory Risk.</span>
                <span>Zero Upfront Cost.</span>
                <span>Guaranteed Profit.</span>
                <span>Zero Inventory Risk.</span>
              </span>
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Turn your influence into a brand. PageFairy is the platform for lash techs and creators to launch private
            label products using <strong>risk-free pre-order campaigns</strong>.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/25"
            >
              <Rocket className="w-5 h-5" />
              Start Your Campaign
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-slate-300 hover:text-white text-sm font-semibold"
            >
              <FileText className="w-5 h-5" />
              View Catalog
            </Link>
          </div>
          <p className="text-xs text-slate-500 mt-4 uppercase tracking-widest">
            No credit card required to start
          </p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-20 border-t border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl hover:bg-slate-800/50 transition duration-300">
              <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 text-purple-400">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Design</h3>
              <p className="text-slate-400 leading-relaxed">
                Upload your logo and our wizard instantly generates a stunning, high-converting landing page for your
                campaign. No coding needed.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl hover:bg-slate-800/50 transition duration-300">
              <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 text-purple-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Zero Risk Pre-Orders</h3>
              <p className="text-slate-400 leading-relaxed">
                We use Stripe Pre-Authorization. Your customers commit to buy, but are <strong>only charged</strong> if
                you hit your sales goal.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl hover:bg-slate-800/50 transition duration-300">
              <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 text-purple-400">
                <PackageCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Hands-Off Fulfillment</h3>
              <p className="text-slate-400 leading-relaxed">
                Once validated, we invoice the wholesale cost, manufacture your branded product, and dropship directly
                to your customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demand Test model */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">The "Demand Test" Model</h2>
            <p className="mt-4 text-lg text-slate-400">
              Stop guessing. Validate demand for your beauty brand before you spend a dollar on inventory.
            </p>
          </div>

          <div className="relative grid gap-12 lg:grid-cols-3">
            <div className="hidden lg:block absolute top-12 left-16 right-16 h-0.5 bg-gradient-to-r from-slate-800 via-purple-900 to-slate-800" />

            <div className="relative flex flex-col items-center text-center z-10">
              <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center shadow-2xl mb-6 group hover:border-purple-500 transition-colors duration-300">
                <span className="text-3xl font-bold text-slate-500 group-hover:text-purple-400">1</span>
              </div>
              <h3 className="text-xl font-bold text-white">Create Campaign</h3>
              <p className="mt-2 text-slate-400 max-w-xs">
                Pick a product from our catalog, set your profit margin, and define a unit goal (e.g., "Sell 10 units").
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center z-10">
              <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center shadow-2xl mb-6 group hover:border-purple-500 transition-colors duration-300">
                <span className="text-3xl font-bold text-slate-500 group-hover:text-purple-400">2</span>
              </div>
              <h3 className="text-xl font-bold text-white">Promote Link</h3>
              <p className="mt-2 text-slate-400 max-w-xs">
                Share your custom page. Customers place risk-free pre-orders (card holds). No money leaves their
                account yet.
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center z-10">
              <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center shadow-2xl mb-6 group hover:border-purple-500 transition-colors duration-300">
                <span className="text-3xl font-bold text-slate-500 group-hover:text-purple-400">3</span>
              </div>
              <h3 className="text-xl font-bold text-white">Profit &amp; Ship</h3>
              <p className="mt-2 text-slate-400 max-w-xs">
                Goal met? We capture payments, take our wholesale cut, and ship the rest. Goal missed? Everyone is
                refunded.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto bg-slate-800/30 border border-slate-700 p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

            <h2 className="text-4xl font-bold text-white mb-6 relative z-10">Ready to build your empire?</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto relative z-10">
              Join the waitlist to access our catalog of high-quality white-label beauty products and start selling
              risk-free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 btn-primary bg-purple-600 hover:bg-purple-500 border-none text-white px-10 py-3 rounded-full text-sm font-semibold"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 text-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg text-slate-200">
            <Sparkles className="text-purple-500 w-5 h-5" />
            <span>PageFairy</span>
          </div>
          <p className="text-slate-500">
            &copy; 2026 PageFairy Inc. Private Label Dropshipping as a Service.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-slate-400 hover:text-purple-400 transition">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-purple-400 transition">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-purple-400 transition">
              <Mail className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
