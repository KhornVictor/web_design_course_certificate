import { getCertificateData } from "@/lib/assets";
import CertificateStudio from "@/app/components/CertificateStudio";

export const dynamic = "force-dynamic";

export default function Home() {
  const certificateData = getCertificateData();

  return <CertificateStudio initialData={certificateData} />;
}
