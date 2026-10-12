import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page grid min-h-[60dvh] place-items-center py-16 text-center">
      <div>
        <p className="font-display text-7xl text-accent sm:text-8xl">404</p>
        <h1 className="mt-4 font-display text-3xl">ไม่พบหน้าที่คุณต้องการ</h1>
        <p className="mt-3 text-muted">หน้านี้อาจถูกย้ายหรือไม่มีอยู่แล้ว</p>
        <Link href="/" className="btn btn-primary mt-8">กลับหน้าหลัก</Link>
      </div>
    </section>
  );
}
