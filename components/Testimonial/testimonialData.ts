import image1 from "@/public/images/user/user-01.png";
import image2 from "@/public/images/user/user-02.png";
import type { Testimonial } from "@/types/testimonial";

export const testimonialData: Testimonial[] = [
  {
    id: 1,
    name: "Sudhir",
    designation: "Frontend Engineer",
    image: image1,
    content:
      "Sahaai helped me automate my workflow of building custom components for React applications",
  },
  {
    id: 2,
    name: "Sandeep",
    designation: "Designer",
    image: image2,
    content:
      "Curated designs are just a prompt away.create logos, presentations on the go",
  },
  {
    id: 3,
    name: "Mayank",
    designation: "Artist",
    image: image1,
    content:
      "It was a breeze to tokenize my books as NFTs and monetize them",
  },
  {
    id: 4,
    name: "Zach",
    designation: "Business Development",
    image: image2,
    content:
      "I used Sahaai to create passive income by monetizing my custom workflow which I use to schedule my meetings",
  },
];
