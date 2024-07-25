import Image from "next/image";
import { Inter } from "next/font/google";
import IntroHome from "@/pages/intro_home";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <IntroHome />;
}
