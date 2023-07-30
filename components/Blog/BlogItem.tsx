"use client";
import Image from "next/image";
import { Blog } from "@/types/blog";
import Link from "next/link";
import { motion } from "framer-motion";

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
        className="animate_top bg-white dark:bg-blacksection rounded-lg shadow-solid-8 p-4 pb-9"
      >
        <Link href={`/blog/`} className="block relative aspect-[368/239]">
          <Image src={mainImage} alt={title} fill />
        </Link>

        <div className="px-4">
          <h4 className="font-medium text-lg xl:text-itemtitle2 text-black hover:text-primary dark:hover:text-primary dark:text-white mt-7.5 mb-3.5">
            <Link href={`/blog/blog-details`}>
              {" "}
              {`${title.slice(0, 40)}...`}
            </Link>
          </h4>
          <p>{metadata ? `${metadata.slice(0, 100)}...` : ""}</p>
        </div>
      </motion.div>
    </>
  );
};

export default BlogItem;
