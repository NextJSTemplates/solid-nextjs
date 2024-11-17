"use client";
import { Blog } from "@/types/blog";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const BlogItem = ({ blog }: { blog: Blog }) => {
  const { mainImage, title, metadata } = blog;

  return (
    <>
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            y: -20,
          },

          visible: {
            opacity: 1,
            y: 0,
          },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: true }}
        className="animate_top rounded-lg bg-white p-4 pb-9 shadow-solid-8 dark:bg-blacksection"
      >
        <Link href={`/blog/`} className="relative block h-auto w-1/2">
          {" "}
          {/* Adjust container width */}
          <Image
            src={mainImage}
            alt={title}
            layout="intrinsic" // This ensures the image respects its aspect ratio
            width={300} // Adjust this to set the desired width
            height={300} // Adjust this to maintain the aspect ratio (if aspect is 239:239)
          />
        </Link>

        <div className="px-4">
          <h3 className="mb-3.5 mt-7.5 line-clamp-2 inline-block text-lg font-medium text-black duration-300 hover:text-primary dark:text-white dark:hover:text-primary xl:text-itemtitle2">
            {/* <Link href={`/blog/blog-details`}> */}
            <Link href={""}>
              {/* {`${title.slice(0, 40)}...`} */}
              {`${title.slice(0, 40)}`}
            </Link>
          </h3>
          <p className="line-clamp-3">{metadata}</p>
        </div>
      </motion.div>
    </>
  );
};

export default BlogItem;
