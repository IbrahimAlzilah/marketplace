import Image from "next/image";
import { Link } from "@/i18n/navigation";

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel - desktop */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Yusur Logo"
            width={140}
            height={40}
            className="h-10 w-auto object-contain brightness-0 invert"
            style={{ width: "auto" }}
            priority
          />
        </Link>
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Your Trusted Healthcare Marketplace
          </h2>
          <p className="mt-4 text-primary-foreground/80 text-lg">
            Shop from licensed pharmacies across Saudi Arabia. Fast delivery, secure payments, and expert care.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/60">© 2026 YUSUR Marketplace</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <Image
              src="/images/logo.png"
              alt="Yusur Logo"
              width={120}
              height={36}
              className="h-9 w-auto object-contain dark:brightness-0 dark:invert"
              style={{ width: "auto" }}
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
