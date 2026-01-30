import PageHeader from "@/components/page-header";
import ContactForm from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="px-5 md:px-10 pt-24 pb-14">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          titleKR="문의"
          titleEN="Contact"
          subtitleKR="촬영/협업/브랜딩 문의"
          subtitleEN="Bookings / collaborations / branding"
        />
        <ContactForm />
      </div>
    </div>
  );
}
