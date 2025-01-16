import SidebarLink from "@/components/Docs/SidebarLink";
import { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";

export const metadata: Metadata = {
  title: "Docs Page",
  description: "This is Docs page for Sahaai",
};

export default async function DocPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Path to the MDX file based on slug
  const docPath = path.join(process.cwd(), "markdown", "docs", `${slug}.mdx`);

  // Check if the file exists
  if (!fs.existsSync(docPath)) {
    return (
      <div className="prose dark:prose-dark max-w-none">
        <h1>Document Not Found</h1>
        <p>The document you are looking for does not exist.</p>
      </div>
    );
  }

  // Read and parse the MDX file
  const fileContents = fs.readFileSync(docPath, "utf8");
  const { content, data } = matter(fileContents);

  return (
    <>
      <section className="pb-16 pt-24 md:pb-20 md:pt-28 lg:pb-24 lg:pt-32">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            {/* Sidebar */}
            <div className="w-full px-4 lg:w-1/4">
              <div className="sticky top-[74px] rounded-lg border border-white p-4 shadow-solid-4 transition-all dark:border-strokedark dark:bg-blacksection">
                <ul className="space-y-2">
                  <SidebarLink />
                </ul>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full px-4 lg:w-3/4">
              <div className="blog-details blog-details-docs shadow-three dark:bg-gray-dark rounded-sm bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
                <h1 className="text-2xl font-bold">{data.title}</h1>
                <MDXRemote source={content} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
