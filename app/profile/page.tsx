import PageHeader from "@/components/page-header";
import ProfileCard from "@/components/profile-card";

export default function ProfilePage() {
  return (
    <div className="px-5 md:px-10 pt-24 pb-14">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          titleKR="프로필"
          titleEN="Profile"
          subtitleKR="프로필 · 신체 스펙 · 기본 정보"
          subtitleEN="Profile · Body specs · Basic info"
        />
        <ProfileCard />
      </div>
    </div>
  );
}
