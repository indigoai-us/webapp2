import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import Lottie from "lottie-react";
import diffusionAnim1 from "../public/circle2-loader.json";

const PageLoading = () => {
  return (
    <div className={`${inter.className} overscroll-none grid h-screen place-items-center`}>
      <Lottie animationData={diffusionAnim1} loop={true} style={{width: '20%'}}/>
    </div>
  );
}

export default PageLoading;