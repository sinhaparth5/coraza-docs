import Image from "next/image";
import dashboardImage from "@/static/img/hero_image.png";
import { OrganicCluster } from "./organic-cluster";

export function DashboardSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pastel-green-50 via-white to-pastel-green-100 px-5 py-20 text-center sm:px-8 lg:py-24 dark:from-pastel-green-950 dark:via-[#0b3508] dark:to-pastel-green-900">
      <OrganicCluster position="left" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-pastel-green-700 dark:text-pastel-green-300">
          Admin dashboard
        </p>
        <p className="mx-auto mb-10 max-w-xl text-pretty text-base leading-7 text-pastel-green-900/70 dark:text-pastel-green-100/70">
          Filter request decisions by status, app, or date. The live view
          streams new traffic as it arrives.
        </p>
        <div className="overflow-hidden rounded-2xl border border-pastel-green-800/15 bg-pastel-green-950 shadow-[0_24px_70px_rgba(8,45,6,0.2)] dark:border-pastel-green-200/15">
          <Image
            src={dashboardImage}
            alt="Coraza WAF admin dashboard with live traffic charts, a request log, and threat summaries"
            sizes="(max-width: 1280px) 92vw, 1152px"
            quality={88}
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
