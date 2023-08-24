import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaHome, FaClock } from "react-icons/fa";

function MainLayout({ children }) {
  const router = useRouter();

  return (
    <div className="w-full h-full font-Poppins">
      <Head>
        <title>Water Meter</title>
      </Head>
      <div className="fixed w-full px-2 py-4 bg-blue-500 shadow-xl">
        <h1 className="text-xl font-semibold text-center text-white">
          Water Meter
        </h1>
      </div>

      {/* content */}
      <div className="px-4 pt-[72px] space-y-4">{children}</div>

      {/* bottom nav */}
      <div className="fixed bottom-0 w-full px-2 py-4 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <div className="grid grid-cols-2 text-sm">
          {/* home */}
          <Link
            href="/"
            className={`${
              router.pathname === "/" && "text-blue-500"
            } flex flex-col space-y-1 cursor-pointer`}
          >
            <div className="flex justify-center">
              <FaHome />
            </div>
            <div className="flex justify-center">
              <p>Home</p>
            </div>
          </Link>

          {/* schedule */}
          <Link
            href="/set-schedule"
            className={`${
              router.pathname === "/set-schedule" && "text-blue-500"
            } flex flex-col space-y-1 cursor-pointer`}
          >
            <div className="flex justify-center">
              <FaClock />
            </div>
            <div className="flex justify-center">
              <p>Schedule</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
