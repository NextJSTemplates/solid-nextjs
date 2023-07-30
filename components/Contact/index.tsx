"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Contact = () => {
  /**
   * Source: https://www.joshwcomeau.com/react/the-perils-of-rehydration/
   * Reason: To fix rehydration error
   */
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  return (
    <>
      {/* <!-- ===== Contact Start ===== --> */}
      <section id="support" className="px-4 md:px-8 2xl:px-0">
        <div className="mx-auto max-w-c-1390 relative pt-10 lg:pt-15 xl:pt-20 px-7.5 lg:px-15 xl:px-20 overflow-hidden">
          <div className="absolute -z-1 rounded-lg left-0 top-0 w-full h-2/3 bg-gradient-to-t from-[#fff] to-[#dee7ff47] dark:bg-gradient-to-t dark:from-[#24283E] dark:to-[#252A42]"></div>
          <div className="absolute -z-1 bottom-[-255px] left-0 w-full h-full">
            <Image
              src="./images/shape/shape-dotted-light.svg"
              alt="Dotted"
              className="dark:hidden"
              fill
            />
            <Image
              src="./images/shape/shape-dotted-dark.svg"
              alt="Dotted"
              className="hidden dark:block"
              fill
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap flex-col-reverse md:flex-row gap-8 xl:gap-20 md:justify-between">
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
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_top w-full md:w-3/5 lg:w-3/4 shadow-solid-8 rounded-lg bg-white dark:bg-black dark:border dark:border-strokedark p-7.5 xl:p-15"
            >
              <h2 className="text-black dark:text-white text-3xl xl:text-sectiontitle2 font-semibold mb-15">
                Send a message
              </h2>

              <form
                action="https://formbold.com/s/unique_form_id"
                method="POST"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between gap-7.5 lg:gap-14 mb-7.5">
                  <input
                    type="text"
                    placeholder="Full name"
                    className="w-full lg:w-1/2 bg-transparent border-b border-stroke dark:border-strokedark focus-visible:outline-none focus:border-waterloo dark:focus:border-manatee focus:placeholder:text-black dark:focus:placeholder:text-white pb-3.5"
                  />

                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full lg:w-1/2 bg-transparent border-b border-stroke dark:border-strokedark focus-visible:outline-none focus:border-waterloo dark:focus:border-manatee focus:placeholder:text-black dark:focus:placeholder:text-white pb-3.5"
                  />
                </div>

                <div className="flex flex-col lg:flex-row lg:justify-between gap-7.5 lg:gap-14 mb-12.5">
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full lg:w-1/2 bg-transparent border-b border-stroke dark:border-strokedark focus-visible:outline-none focus:border-waterloo dark:focus:border-manatee focus:placeholder:text-black dark:focus:placeholder:text-white pb-3.5"
                  />

                  <input
                    type="text"
                    placeholder="Phone number"
                    className="w-full lg:w-1/2 bg-transparent border-b border-stroke dark:border-strokedark focus-visible:outline-none focus:border-waterloo dark:focus:border-manatee focus:placeholder:text-black dark:focus:placeholder:text-white pb-3.5"
                  />
                </div>

                <div className="flex mb-11.5">
                  <textarea
                    placeholder="Message"
                    rows={4}
                    className="w-full bg-transparent border-b border-stroke dark:border-strokedark focus-visible:outline-none focus:border-waterloo dark:focus:border-manatee focus:placeholder:text-black dark:focus:placeholder:text-white"
                  ></textarea>
                </div>

                <div className="flex flex-wrap xl:justify-between ">
                  <div className="flex mb-4 md:mb-0">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-2"
                    />
                    <label
                      htmlFor="default-checkbox"
                      className="max-w-[425px] flex cursor-pointer select-none pl-5 text-sm"
                    >
                      By clicking Checkbox, you agree to use our “Form” terms
                      And consent cookie usage in browser.
                    </label>
                  </div>

                  <button aria-label="send message" className="inline-flex items-center gap-2.5 bg-black hover:bg-blackho ease-in-out duration-300 dark:bg-btndark font-medium text-white rounded-full px-6 py-3">
                    Send Message
                    <svg
                      className="fill-white"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                        fill=""
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </motion.div>

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
              transition={{ duration: 2, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_top w-full md:w-2/5 lg:w-[26%] md:p-7.5 xl:pt-15"
            >
              <h2 className="text-black dark:text-white text-3xl xl:text-sectiontitle2 font-semibold mb-12.5">
                Find us
              </h2>

              <div className="mb-7 5">
                <h4 className="font-medium text-black dark:text-white text-metatitle3 mb-4">
                  Our Loaction
                </h4>
                <p>290 Maryam Springs 260, Courbevoie, Paris, France</p>
              </div>
              <div className="mb-7 5">
                <h4 className="font-medium text-black dark:text-white text-metatitle3 mb-4">
                  Email Address
                </h4>
                <p>
                  <a href="#">yourmail@domainname.com</a>
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black dark:text-white text-metatitle3 mb-4">
                  Phone Number
                </h4>
                <p>
                  <a href="#">+009 42334 6343 843</a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* <!-- ===== Contact End ===== --> */}
    </>
  );
};

export default Contact;
