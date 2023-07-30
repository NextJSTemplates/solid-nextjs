import React from "react";
import Image from "next/image";
import Link from "next/link";
import BlogData from "./blogData";

const RelatedPost = async () => {
  return (
    <>
      <div className="animate_top rounded-md shadow-solid-13 bg-white dark:bg-blacksection border border-stroke dark:border-strokedark p-9">
        <h4 className="font-semibold text-2xl text-black dark:text-white mb-7.5">
          Related Posts
        </h4>

        <div>
          {BlogData.slice(0, 3).map((post, key) => (
            <div
              className="flex xl:flex-nowrap flex-wrap gap-4 2xl:gap-6 mb-7.5"
              key={key}
            >
              <div className="relative max-w-45 w-45 h-18">
                {post.mainImage ? (
                  <Image fill src={post.mainImage} alt="Blog" />
                ) : (
                  "No image"
                )}
              </div>
              <h5 className="font-medium text-md text-black dark:text-white hover:text-primary dark:hover:text-primary transition-all duration-300">
                <Link href={`/blog/blog-details`}>
                  {" "}
                  {post.title.slice(0, 40)}...
                </Link>
              </h5>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RelatedPost;
