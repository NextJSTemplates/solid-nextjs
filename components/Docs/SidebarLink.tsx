// components/Docs/SidebarLink.tsx
import Link from "next/link";

const SidebarLink = () => {
  return (
    <>
      <li className="block">
        <Link
          href={`/docs`}
          className={`flex w-full rounded-sm bg-stroke px-3 py-2 text-base text-black dark:bg-blackho dark:text-white`}
        >
          Introduction
        </Link>
        <Link
          href={`/docs/`} // Updated the href to point to the new page
          className={`flex w-full rounded-sm px-3 py-2 text-base text-black dark:text-white `}
        >
          Projects
        </Link>
      </li>
    </>
  );
};

export default SidebarLink;
