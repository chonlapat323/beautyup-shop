import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui";
import { getRegions, getSalons } from "@/lib/data";
import { SalonFinder } from "./salon-finder";

export const metadata: Metadata = { title: "ค้นหาซาลอน" };

export default async function SalonsPage() {
  const [salons, regions] = await Promise.all([getSalons(), getRegions()]);

  return (
    <>
      <PageHero
        eyebrow="Find a Salon"
        title="ค้นหาซาลอนใกล้คุณ"
        description="ร้านซาลอนพันธมิตรที่ใช้ผลิตภัณฑ์ Fanola, Nook และ Sweet Professional"
      />
      <section className="container-page py-10 md:py-16">
        <Suspense>
          <SalonFinder salons={salons} regions={regions} />
        </Suspense>
      </section>
    </>
  );
}
