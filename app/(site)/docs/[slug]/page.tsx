import { getAllPosts, getPostBySlug } from "@/app/libs/markdown";
import markdownToHtml from "@/app/libs/markdownToHtml";
import SidebarLink from "@/components/Docs/SidebarLink";

export default async function Post({ params }: { params: { slug: string } }) {
  const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);
  const post = getPostBySlug(params.slug, ["title", "author", "content"]);
  const content = await markdownToHtml(post.content || "");

  return (
    <>
      <title>{`${post?.title} - Startup`}</title>

      <section className="pb-16 md:pb-20 lg:pb-24 pt-24 md:pt-28 lg:pt-32">
        <div className="container mx-auto">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 lg:w-1/4">
              <div className="sticky top-[74px] p-4 border border-white shadow-solid-4 rounded-lg  transition-all dark:border-strokedark dark:bg-blacksection">
                <ul className="space-y-2">
                  {posts.map((post, key) => (
                    <SidebarLink post={post} key={key} />
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-full px-4 lg:w-3/4">
              <div className="blog-details blog-details-docs rounded-sm bg-white py-11 px-8 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
                <div
                  className="blog-details"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
