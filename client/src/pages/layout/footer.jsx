import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  const version = "v1.0.0";
  return (
    <div className="mt-auto">
      <footer className="flex justify-center w-full bg-zinc-100 dark:bg-zinc-900 border-t-2 dark:border-zinc-800/50 p-4 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-342 gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <div>© {year} CubiX. Oleksandr Ivanov.</div>

          <div className="flex gap-4">
            <a
              href="mailto:alexandr.i@ukr.net"
              className="px-3 py-1 rounded-md hover:bg-zinc-200 text-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 transition-all duration-300"
            >
              alexandr.i@ukr.net
            </a>
            <a
              href="https://t.me/CubixDevelopment"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-md  hover:bg-zinc-200 text-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 transition"
            >
              Telegram
            </a>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <a
              href="https://send.monobank.ua/jar/2MA4ddxNTc"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-md bg-zinc-200 hover:bg-zinc-300 text-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:bg-zinc-800 transition-all duration-300"
            >
              Підтримати ☕
            </a>
            <span className="text-zinc-500">{version}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
