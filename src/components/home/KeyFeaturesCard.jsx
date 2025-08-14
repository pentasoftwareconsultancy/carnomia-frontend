import React from "react";
import carEngine from "../../assets/carEngine.jpg";
import allBrands from "../../assets/allBrands.webp";
import reportImage from "../../assets/reportImage.jpg";
import paymentImage from "../../assets/paymentImage.jpg";

const features = [
  { id: "01", title: "Complete On-\nBoard Diagnostics", img: carEngine },
  { id: "02", title: "We Inspect\nAll Brand Cars", img: allBrands },
  { id: "03", title: "Get Instant\nPDI Report", img: reportImage },
  { id: "04", title: "Pay Only\nAfter PDI", img: paymentImage },
];

const KeyFeaturesCard = () => {
  return (
    <div className="bg-primary py-16 px-4">
      {/* Heading */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 sm:gap-5 mb-4 flex-wrap">
          {/* Chevron arrows */}
          <div className="flex items-center gap-[5px]">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-[37px] h-[42px]"
                style={{
                  clipPath:
                    "polygon(0 0, 60% 0, 100% 50%, 60% 100%, 0 100%, 40% 50%)",
                  backgroundColor: "#81da5b",
                }}
              />
            ))}
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold italic">
            <span className="text-button">KEY</span>{" "}
            <span className="text-black">FEATURES</span>
          </h2>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const isEven = index % 2 === 1; // Desktop positioning

            return (
              <div
                key={feature.id}
                className="flex flex-col items-center justify-center"
              >
                {/* Mobile: Always top text */}
                <div className="flex items-center gap-4 mb-4 sm:hidden">
                  <span className="text-button text-5xl font-bold italic">
                    {feature.id}
                  </span>
                  <h3 className="text-xl font-bold italic text-black whitespace-pre-line">
                    {feature.title}
                  </h3>
                </div>

                {/* Desktop: Top text only for even cards */}
                {isEven && (
                  <div className="hidden sm:flex items-center gap-4 mb-6 ml-12">
                    <span className="text-button text-5xl font-bold italic">
                      {feature.id}
                    </span>
                    <h3 className="text-xl font-bold italic text-black whitespace-pre-line">
                      {feature.title}
                    </h3>
                  </div>
                )}

                {/* Image */}
                <div className="relative h-86 w-full">
                  {/* Corner colors */}
                  {!isEven ? (
                    <>
                      {/* Odd -> green top-left */}
                      <div
                        className="absolute -top-1 left-8 w-12 bg-button"
                        style={{
                          height: "25vh",
                          clipPath:
                            "polygon(25% 0, 100% 0, 80% 100%, 0% 100%)",
                        }}
                      />
                      {/* Odd -> black bottom right */}
                      <div
                        className="absolute -bottom-1 right-9 w-12 bg-black"
                        style={{
                          height: "25vh",
                          clipPath:
                            "polygon(35% 0, 100% 0, 82% 100%, 0 100%)",
                        }}
                      />
                    </>
                  ) : (
                    <>
                      {/* Even -> black top-left */}
                      <div
                        className="absolute -top-1 left-8 w-12 bg-black"
                        style={{
                          height: "25vh",
                          clipPath:
                            "polygon(26% 0, 100% 0, 80% 100%, 0% 100%)",
                        }}
                      />
                      {/* Even -> green bottom-right */}
                      <div
                        className="absolute -bottom-1 right-9 w-12 bg-button"
                        style={{
                          height: "25vh",
                          clipPath:
                            "polygon(35% 0, 100% 0, 82% 100%, 0 100%)",
                        }}
                      />
                    </>
                  )}

                  {/* Image mask */}
                  <div
                    className="absolute inset-[2px] overflow-hidden"
                    style={{
                      clipPath:
                        "polygon(18% 0, 100% 0, 82% 100%, 0 100%)",
                    }}
                  >
                    <img
                      src={feature.img}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Desktop: Bottom text only for odd cards */}
                {!isEven && (
                  <div className="hidden sm:flex items-center gap-4 mt-6 -ml-20">
                    <span className="text-button text-5xl font-bold italic">
                      {feature.id}
                    </span>
                    <h3 className="text-xl font-bold italic text-black whitespace-pre-line">
                      {feature.title}
                    </h3>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KeyFeaturesCard;