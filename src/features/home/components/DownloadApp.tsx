"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function DownloadApp() {
  const t = useTranslations("home");

  return (
    <section className="container-marketplace my-8 md:my-12">
      <div className="relative rounded-3xl bg-secondary/90 px-6 py-12 sm:px-12 md:px-16 md:py-20 lg:py-20 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:pe-[280px] lg:pe-[320px]">
          <div className="max-w-xl text-center md:text-start rtl:md:text-start">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("downloadTitle")}
            </h2>
            <p className="mt-4 text-base opacity-90 leading-relaxed md:text-lg">
              {t("downloadSubtitle")}
            </p>
            <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
              <Link href="#" className="hover:opacity-90 transition-opacity">
                <Image
                  src="/images/app-store.svg"
                  alt={t("appStore")}
                  width={162}
                  height={48}
                  className="h-12 w-auto"
                />
              </Link>
              <Link href="#" className="hover:opacity-90 transition-opacity">
                <Image
                  src="/images/google-play.svg"
                  alt={t("googlePlay")}
                  width={162}
                  height={48}
                  className="h-12 w-auto"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -top-16 bottom-6 end-10 hidden w-[240px] md:block lg:w-[380px] z-10">
          <div className="relative h-full w-full">
            <Image
              src="/images/mockup-app.png"
              alt="Yusur App Mockup"
              fill
              className="object-contain object-bottom drop-shadow-2xl"
              sizes="260px"
              priority
            />
          </div>
        </div>

        <div className="relative mx-auto mt-8 aspect-[9/18] w-full max-w-[180px] md:hidden">
          <Image
            src="/images/mockup-app.png"
            alt="Yusur App Mockup"
            fill
            className="object-contain drop-shadow-xl"
            sizes="180px"
          />
        </div>
      </div>
    </section>
  );
}
