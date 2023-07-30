"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarLink = ({ post }) => {
  const pathUrl = usePathname();

  return (
    <>
      <li className="block">
        <Link
          href={`/docs/${post?.slug}`}
          className={`text-base py-2 px-3 rounded-sm flex w-full bg-stroke ${
            pathUrl === `/docs/${post?.slug}`
              ? "text-black dark:text-white dark:bg-blackho"
              : "bg-white dark:bg-black  dark:text-white "
          }`}
        >
          {post?.title}
        </Link>
      </li>
    </>
  );
};

export default SidebarLink;
