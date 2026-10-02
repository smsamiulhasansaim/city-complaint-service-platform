import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const pixel = Pixelify_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Page not found",
};

const sparks = [
  { left: "8%", bottom: "14%", size: 8, delay: 0, duration: 7, color: "#E9B86B" },
  { left: "20%", bottom: "6%", size: 6, delay: 1.8, duration: 8, color: "#8A9E7B" },
  { left: "33%", bottom: "20%", size: 6, delay: 3.2, duration: 6.5, color: "#F4A58A" },
  { left: "47%", bottom: "4%", size: 8, delay: 0.9, duration: 9, color: "#E9B86B" },
  { left: "61%", bottom: "16%", size: 6, delay: 2.6, duration: 7.5, color: "#8A9E7B" },
  { left: "74%", bottom: "8%", size: 8, delay: 4.1, duration: 8.5, color: "#F4A58A" },
  { left: "86%", bottom: "18%", size: 6, delay: 1.2, duration: 7, color: "#E9B86B" },
  { left: "93%", bottom: "5%", size: 6, delay: 3.6, duration: 9, color: "#8A9E7B" },
];

const buttonBase = `${pixel.className} inline-flex h-12 items-center justify-center rounded-md border-2 border-[#4B1D22] px-6 text-lg font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4B1D22] shadow-[4px_4px_0_#8A9E7B] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#8A9E7B] active:translate-x-1 active:translate-y-1 active:shadow-none`;

const reveal = (delay: number) => ({ animationDelay: `${delay}ms` });

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-[#FAF4E4] px-6 py-10">
      <style>{`
        @keyframes nf-rise {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes nf-pop {
          0% { opacity: 0; transform: scale(0.85) translateY(24px); }
          60% { opacity: 1; transform: scale(1.03) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes nf-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes nf-drift {
          0% { opacity: 0; transform: translate(0, 0); }
          15% { opacity: 0.9; }
          50% { transform: translate(14px, -90px); }
          85% { opacity: 0.9; }
          100% { opacity: 0; transform: translate(-10px, -190px); }
        }
        @keyframes nf-glow {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.06); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .nf-rise { animation: nf-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
          .nf-pop { animation: nf-pop 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
          .nf-bob { animation: nf-bob 3.6s ease-in-out infinite; }
          .nf-glow { animation: nf-glow 5s ease-in-out infinite; }
          .nf-spark { animation: nf-drift var(--d) ease-in-out var(--delay) infinite; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nf-spark { opacity: 0.5; }
        }
      `}</style>

      {/* Pixel dot field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(#8A9E7B_1.5px,transparent_1.5px)] bg-size-[24px_24px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,transparent_15%,black_90%)]"
      />

      {/* Drifting pixel sparks */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {sparks.map((spark) => (
          <span
            key={spark.left}
            className="nf-spark absolute opacity-0"
            style={
              {
                left: spark.left,
                bottom: spark.bottom,
                width: spark.size,
                height: spark.size,
                backgroundColor: spark.color,
                "--d": `${spark.duration}s`,
                "--delay": `${spark.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <div className="nf-pop relative w-full max-w-md" style={reveal(0)}>
          <div
            aria-hidden
            className="nf-glow absolute inset-x-8 top-6 -z-10 h-4/5 rounded-full bg-[#8A9E7B]/30 blur-3xl"
          />
          <div className="nf-bob">
            <Image
              src="/404-troll.png"
              alt="A smiling green-haired troll holding a wooden sign that reads 404"
              width={800}
              height={755}
              priority
              className="h-auto w-full cursor-pointer transition-transform duration-300 ease-out [image-rendering:pixelated] hover:-rotate-2 hover:scale-105"
            />
          </div>
        </div>

        <h1
          className={`${pixel.className} nf-rise mt-2 text-4xl font-bold tracking-tight text-[#4B1D22] sm:text-5xl`}
          style={reveal(250)}
        >
          Page not found
        </h1>

        <p
          className="nf-rise mt-3 max-w-sm text-base leading-relaxed text-[#6B5A52]"
          style={reveal(380)}
        >
          This page does not exist or has been moved. Let&apos;s get you back on
          track.
        </p>

        <div
          className="nf-rise mt-9 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row"
          style={reveal(500)}
        >
          <Link href="/" className={`${buttonBase} bg-[#4B1D22] text-[#F7EEDB]`}>
            Return home
          </Link>
          <Link
            href="/complaints/new"
            className={`${buttonBase} bg-[#FFFBF0] text-[#4B1D22]`}
          >
            File a complaint
          </Link>
        </div>
      </div>
    </main>
  );
}