"use client";

import { motion } from "motion/react";
import KawaiiButton from "../ui/KawaiiButton";

export default function Hero() {
  return (
    <section
      className="
        relative
        flex
        min-h-[80vh]
        items-center
        overflow-hidden
        px-6
      "
    >

      <div
        className="
          absolute
          left-0
          top-20
          h-72
          w-72
          rounded-full
          bg-pink-200
          opacity-40
          blur-3xl
        "
      />

      <div
        className="
          absolute
          bottom-10
          right-0
          h-80
          w-80
          rounded-full
          bg-purple-200
          opacity-40
          blur-3xl
        "
      />


      <div
        className="
          relative
          mx-auto
          max-w-7xl
          text-center
        "
      >

        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="text-7xl md:text-8xl"
        >
          🎀
        </motion.div>


        <h1
          className="
            mt-8
            text-4xl
            font-extrabold
            leading-tight
            text-[#4A3B47]
            md:text-6xl
            lg:text-7xl
          "
        >
          Bienvenue dans
          <br />

          <span className="text-[#FF75B8]">
            Univers Mikawaii
          </span>
        </h1>


        <p
          className="
            mx-auto
            mt-6
            max-w-2xl
            text-lg
            text-[#756574]
            md:text-xl
          "
        >
          Découvrez un monde rempli de petites merveilles,
          de surprises adorables et de trésors kawaii.
        </p>


        <div className="mt-10">
          <KawaiiButton>
            Découvrir les surprises ✨
          </KawaiiButton>
        </div>

      </div>

    </section>
  );
}