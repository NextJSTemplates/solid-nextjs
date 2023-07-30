"use client";
import React from "react";
import SectionHeader from "../Common/SectionHeader";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { motion } from "framer-motion";
import Image from "next/image";

const Testimonial = () => {
  return (
    <>
      <section>
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          {/* <!-- Section Title Start --> */}
          <div className="animate_top text-center mx-auto">
            <SectionHeader
              headerInfo={{
                title: `TESTIMONIALS`,
                subtitle: `Client’s Testimonials`,
                description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis tortor eros. Donec vitae tortor lacus. Phasellus aliquam ante in maximus.`,
              }}
            />
          </div>
          {/* <!-- Section Title End --> */}
        </div>

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
          className="animate_top mx-auto max-w-c-1235 px-4 md:px-8 xl:px-0 mt-15 xl:mt-20"
        >
          {/* <!-- Slider main container --> */}
          <div className="swiper testimonial-01 pb-22.5 mb-20">
            {/* <!-- Additional required wrapper --> */}
            <Swiper
              spaceBetween={50}
              slidesPerView={2}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              modules={[Autoplay, Pagination]}
              breakpoints={{
                // when window width is >= 640px
                0: {
                  slidesPerView: 1,
                },
                // when window width is >= 768px
                768: {
                  slidesPerView: 2,
                },
              }}
            >
              <SwiperSlide>
                <div className="bg-white rounded-lg shadow-solid-9 dark:shadow-none dark:bg-blacksection dark:border dark:border-strokedark p-9 pt-7.5">
                  <div className="flex justify-between border-b border-stroke dark:border-strokedark pb-6 mb-7.5">
                    <div>
                      <h4 className="text-black dark:text-white text-metatitle3 mb-1.5">
                        Devid Smith
                      </h4>
                      <p>Founter @democompany</p>
                    </div>
                    <Image
                      width={60}
                      height={50}
                      className=""
                      src="./images/user/user-01.svg"
                      alt="User"
                    />
                  </div>

                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris hendrerit, ligula sit amet cursus tincidunt, lorem
                    sem elementum nisi, convallis fringilla ante nibh non urna.
                  </p>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="bg-white rounded-lg shadow-solid-9 dark:shadow-none dark:bg-blacksection dark:border dark:border-strokedark p-9 pt-7.5">
                  <div className="flex justify-between border-b border-stroke dark:border-strokedark pb-6 mb-7.5">
                    <div>
                      <h4 className="text-black dark:text-white text-metatitle3 mb-1.5">
                        Jhon Abraham
                      </h4>
                      <p>Founter @democompany</p>
                    </div>
                    <Image
                      width={60}
                      height={50}
                      className=""
                      src="./images/user/user-02.svg"
                      alt="User"
                    />
                  </div>

                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris hendrerit, ligula sit amet cursus tincidunt, lorem
                    sem elementum nisi, convallis fringilla ante nibh non urna.
                  </p>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="bg-white rounded-lg shadow-solid-9 dark:shadow-none dark:bg-blacksection dark:border dark:border-strokedark p-9 pt-7.5">
                  <div className="flex justify-between border-b border-stroke dark:border-strokedark pb-6 mb-7.5">
                    <div>
                      <h4 className="text-black dark:text-white text-metatitle3 mb-1.5">
                        Devid Smith
                      </h4>
                      <p>Founter @democompany</p>
                    </div>
                    <Image
                      width={60}
                      height={50}
                      className=""
                      src="./images/user/user-01.svg"
                      alt="User"
                    />
                  </div>

                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris hendrerit, ligula sit amet cursus tincidunt, lorem
                    sem elementum nisi, convallis fringilla ante nibh non urna.
                  </p>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Testimonial;
