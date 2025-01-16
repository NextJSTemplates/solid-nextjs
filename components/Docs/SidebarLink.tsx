"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// Define the type for the links
interface LinkData {
  slug: string;
  title: string;
}

const SidebarLink = () => {
  const [links, setLinks] = useState<LinkData[]>([]); // Explicitly type the links state

  useEffect(() => {
    // Fetch the links from the API
    fetch("/api/docs")
      .then((res) => res.json())
      .then((data: LinkData[]) => {
        setLinks(data);
        console.log("the data is:", data);
      }) // Ensure TypeScript understands the response structure
      .catch((error) => console.error("Error fetching links:", error));
  }, []);

  return (
    <ul>
      {links.map((link) => (
        <li key={link.slug}>
          <Link
            href={`/docs/${link.slug}`}
            className="flex w-full rounded-sm px-3 py-2 text-base text-black dark:text-white"
          >
            {link.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarLink;
