import { getCertificateData } from "@/lib/assets";
import CertificateStudio from "@/app/components/layout/CertificateStudio";

export default function Home() {
  const certificateData = getCertificateData();

  return <CertificateStudio initialData={certificateData} />;
}
