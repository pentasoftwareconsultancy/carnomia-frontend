import printJS from "print-js";

const CustomerReport = () => {
  const handlePrint = () => {
    printJS({
      printable: "print-section",
      type: "html",
      targetStyles: ["*"], // apply existing CSS
    });
  };

  return (
    <div>
      <button onClick={handlePrint}>Handle print</button>
      <div id='print-section'> 
      <div
        style={{
          backgroundColor: "#f9fafb",
          display: "grid",
          justifyItems: "center",
          alignItems: "start",
          width: "100vw",
        }}
      >
        <div
          style={{
            backgroundColor: "#f9fafb",
            overflow: "hidden",
            width: "595px",
            height: "842px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "609px",
              height: "611px",
              top: 0,
              left: "-8px",
            }}
          >
            <img
              style={{
                position: "absolute",
                width: "595px",
                height: "397px",
                top: "24px",
                left: "8px",
                objectFit: "cover",
              }}
              src="https://c.animaapp.com/memphtmk884rT8/img/e46f070e-122a-48c2-ba37-87648ed13bc2-1.png"
            />
            <div
              style={{
                position: "absolute",
                width: "609px",
                height: "31px",
                top: 0,
                left: 0,
                backgroundColor: "#040414",
                borderRadius: "5px",
                boxShadow: "0px 0px 9.6px #00000040",
              }}
            ></div>
            <img
              style={{
                position: "absolute",
                width: "78px",
                height: "16px",
                top: "15px",
                left: "39px",
              }}
              src="https://c.animaapp.com/memphtmk884rT8/img/123oiu-1.png"
            />
            <div
              style={{
                position: "absolute",
                width: "80px",
                top: "15px",
                left: "492px",
                fontFamily: "Inter, Helvetica",
                fontWeight: 500,
                color: "#ffffff",
                fontSize: "13px",
                letterSpacing: 0,
                lineHeight: "normal",
                whiteSpace: "nowrap",
              }}
            >
              PDI Report
            </div>
            <div
              style={{
                position: "absolute",
                width: "533px",
                height: "252px",
                top: "359px",
                left: "39px",
                backgroundColor: "#ffffff",
                borderRadius: "5px",
                boxShadow: "0px 0px 9.6px #00000040",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                width: "147px",
                height: "13px",
                top: "15px",
                left: "241px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: "145px",
                  top: 0,
                  left: 0,
                  fontFamily: "Inter, Helvetica",
                  fontWeight: 500,
                  color: "#ffffff",
                  fontSize: "12px",
                  letterSpacing: "-0.48px",
                  lineHeight: "normal",
                  whiteSpace: "nowrap",
                }}
              >
                Booking ID: Pune12345678
              </div>
            </div>

            {/* You can continue similarly for all nested divs and p elements */}
          </div>

          <p
            style={{
              position: "absolute",
              width: "381px",
              top: "632px",
              left: "55px",
              fontFamily: "Poppins, Helvetica",
              fontWeight: 500,
              color: "#447f2a",
              fontSize: "14px",
              letterSpacing: "-0.56px",
              lineHeight: "normal",
              whiteSpace: "nowrap",
            }}
          >
            How Much Has My Car Been Driven Before The PDI Date?
          </p>

          <div
            style={{
              position: "absolute",
              width: "97px",
              top: "668px",
              left: "60px",
              fontFamily: "Inter, Helvetica",
              fontWeight: 500,
              color: "#000000",
              fontSize: "12px",
              letterSpacing: "-0.24px",
              lineHeight: "15.6px",
              whiteSpace: "nowrap",
            }}
          >
            My Car’s Running
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#f9fafb",
          display: "grid",
          justifyItems: "center",
          alignItems: "start",
          width: "100vw",
        }}
      >
        <div
          style={{
            backgroundColor: "#f9fafb",
            width: "595px",
            height: "842px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "523px",
              height: "695px",
              top: "96px",
              left: "36px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid #888",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "123px",
                top: "111px",
                left: "47px",
                fontFamily: "Inter, Helvetica",
                fontWeight: 700,
                color: "#000",
                fontSize: "12px",
                letterSpacing: 0,
                lineHeight: "35px",
              }}
            >
              1. Front Left View
            </div>

            <div
              style={{
                position: "absolute",
                width: "113px",
                top: "392px",
                left: "47px",
                fontFamily: "Inter, Helvetica",
                fontWeight: 700,
                color: "#000",
                fontSize: "12px",
                letterSpacing: 0,
                lineHeight: "35px",
                whiteSpace: "nowrap",
              }}
            >
              3. Rear Right View
            </div>

            <div
              style={{
                position: "absolute",
                width: "129px",
                top: "111px",
                left: "289px",
                fontFamily: "Inter, Helvetica",
                fontWeight: 700,
                color: "#000",
                fontSize: "12px",
                letterSpacing: 0,
                lineHeight: "35px",
                whiteSpace: "nowrap",
              }}
            >
              2. Rear Left View
            </div>

            <div
              style={{
                position: "absolute",
                width: "129px",
                top: "392px",
                left: "289px",
                fontFamily: "Inter, Helvetica",
                fontWeight: 700,
                color: "#000",
                fontSize: "12px",
                letterSpacing: 0,
                lineHeight: "35px",
                whiteSpace: "nowrap",
              }}
            >
              4. Front Right View
            </div>

            <div
              style={{
                position: "absolute",
                top: "153px",
                left: "47px",
                width: "201px",
                height: "200px",
                backgroundColor: "#ededed",
                borderRadius: "10px",
                border: "1px solid #447f2a",
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                top: "434px",
                left: "47px",
                width: "201px",
                height: "200px",
                backgroundColor: "#ededed",
                borderRadius: "10px",
                border: "1px solid #447f2a",
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                top: "153px",
                left: "289px",
                width: "201px",
                height: "200px",
                backgroundColor: "#ededed",
                borderRadius: "10px",
                border: "1px solid #447f2a",
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                top: "434px",
                left: "289px",
                width: "201px",
                height: "200px",
                backgroundColor: "#ededed",
                borderRadius: "10px",
                border: "1px solid #447f2a",
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                width: "219px",
                top: "27px",
                left: "37px",
                fontFamily: "Poppins, Helvetica",
                fontWeight: 600,
                color: "#000",
                fontSize: "18px",
                letterSpacing: 0,
                lineHeight: "normal",
                whiteSpace: "nowrap",
              }}
            >
              Your Car’s 360&nbsp;&nbsp;View
            </div>

            <div
              style={{
                position: "absolute",
                width: "337px",
                height: "14px",
                top: "59px",
                left: "37px",
              }}
            >
              <p
                style={{
                  position: "absolute",
                  width: "335px",
                  top: 0,
                  left: 0,
                  fontFamily: "Poppins, Helvetica",
                  fontWeight: 400,
                  color: "#000",
                  fontSize: "12px",
                  letterSpacing: "-0.24px",
                  lineHeight: "normal",
                  whiteSpace: "nowrap",
                }}
              >
                Check each side of your car for a complete visual record
              </p>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              width: "154px",
              top: "33px",
              left: "52px",
              fontFamily: "Poppins, Helvetica",
              fontWeight: 600,
              color: "#000",
              fontSize: "18px",
              letterSpacing: 0,
              lineHeight: "normal",
              whiteSpace: "nowrap",
            }}
          >
            Profile Photos
          </div>
        </div>
      </div>
      <div
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f9fafb",
          fontFamily: "'Poppins', Helvetica",
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
          minHeight: "100vh",
          paddingTop: "20px",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            margin: 0,
            padding: 0,
            backgroundColor: "#f9fafb",
          }}
        >
          <div
            style={{
              display: "grid",
              justifyItems: "center",
              alignItems: "start",
              width: "100vw",
              gap: "20px",
              padding: "20px",
            }}
          >
            {/* Panel 1 */}
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #888",
                borderRadius: "10px",
                position: "relative",
                width: "523px",
                height: "695px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "43px",
                  left: "50px",
                  fontFamily: "Poppins, Helvetica",
                  fontWeight: 600,
                  color: "#000",
                  fontSize: "18px",
                  whiteSpace: "nowrap",
                }}
              >
                Body Panels
              </div>

              <div
                style={{
                  position: "absolute",
                  width: "91px",
                  height: "14px",
                  top: "71px",
                  left: "25px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: "89px",
                    top: 0,
                    left: 0,
                    fontFamily: "'Poppins', Helvetica",
                    fontWeight: 400,
                    color: "#000000",
                    fontSize: "12px",
                    letterSpacing: "-0.24px",
                    lineHeight: "normal",
                    whiteSpace: "nowrap",
                  }}
                >
                  Front Left Door
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  width: "77px",
                  height: "27px",
                  top: "62px",
                  left: "433px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: "44px",
                    top: 0,
                    left: 0,
                    fontFamily: "'Poppins', Helvetica",
                    fontWeight: 400,
                    color: "#000000bf",
                    fontSize: "12px",
                    letterSpacing: "-0.48px",
                    lineHeight: "35px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Repaint
                </div>
                <div
                  style={{
                    position: "absolute",
                    width: "24px",
                    height: "23px",
                    top: "4px",
                    left: "52px",
                  }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      top: "5px",
                      left: 0,
                      borderRadius: "5px",
                      border: "1px solid #00000080",
                      position: "absolute",
                    }}
                  />
                  <img
                    style={{
                      position: "absolute",
                      width: "20px",
                      height: "19px",
                      top: 0,
                      left: "4px",
                    }}
                    src="https://c.animaapp.com/medx3jmnVaF5AQ/img/vector.svg"
                  />
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  width: "77px",
                  height: "27px",
                  top: "310px",
                  left: "428px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: "44px",
                    top: 0,
                    left: 0,
                    fontFamily: "'Poppins', Helvetica",
                    fontWeight: 400,
                    color: "#000000bf",
                    fontSize: "12px",
                    letterSpacing: "-0.48px",
                    lineHeight: "35px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Repaint
                </div>
                <div
                  style={{
                    position: "absolute",
                    width: "24px",
                    height: "23px",
                    top: "4px",
                    left: "52px",
                  }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      top: "5px",
                      left: 0,
                      borderRadius: "5px",
                      border: "1px solid #00000080",
                      position: "absolute",
                    }}
                  />
                  <img
                    style={{
                      position: "absolute",
                      width: "20px",
                      height: "19px",
                      top: 0,
                      left: "4px",
                    }}
                    src="https://c.animaapp.com/medx3jmnVaF5AQ/img/vector.svg"
                  />
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  width: "100px",
                  top: "7px",
                  left: "338px",
                  fontFamily: "Inter, Helvetica",
                  fontWeight: 600,
                  color: "#000000bf",
                  fontSize: "12px",
                  lineHeight: "35px",
                  whiteSpace: "nowrap",
                }}
              >
                Cladding Issue
              </div>

              <div
                style={{
                  position: "absolute",
                  width: "34px",
                  top: "7px",
                  left: "251px",
                  fontFamily: "Inter, Helvetica",
                  fontWeight: 600,
                  color: "#000000bf",
                  fontSize: "12px",
                  lineHeight: "35px",
                  whiteSpace: "nowrap",
                }}
              >
                Issue
              </div>

              <div
                style={{
                  position: "absolute",
                  width: "34px",
                  top: "7px",
                  left: "24px",
                  fontFamily: "Inter, Helvetica",
                  fontWeight: 600,
                  color: "#000000bf",
                  fontSize: "12px",
                  lineHeight: "35px",
                  whiteSpace: "nowrap",
                }}
              >
                Parts
              </div>

              {/* Lines */}
              <img
                style={{
                  top: "102px",
                  left: "15px",
                  position: "absolute",
                  width: "494px",
                  height: "1px",
                  objectFit: "cover",
                }}
                src="https://c.animaapp.com/medx3jmnVaF5AQ/img/line-39.svg"
              />
              <img
                style={{
                  top: "176px",
                  left: "14px",
                  position: "absolute",
                  width: "494px",
                  height: "1px",
                  objectFit: "cover",
                }}
                src="https://c.animaapp.com/medx3jmnVaF5AQ/img/line-39.svg"
              />
              <img
                style={{
                  top: "351px",
                  left: "16px",
                  position: "absolute",
                  width: "494px",
                  height: "1px",
                  objectFit: "cover",
                }}
                src="https://c.animaapp.com/medx3jmnVaF5AQ/img/line-39.svg"
              />

              {/* Boxes */}
              {[
                { top: "199px", left: "16px" },
                { top: "374px", left: "16px" },
                { top: "199px", left: "115px" },
                { top: "374px", left: "115px" },
                { top: "199px", left: "215px" },
                { top: "374px", left: "215px" },
                { top: "199px", left: "314px" },
                { top: "374px", left: "314px" },
                { top: "199px", left: "413px" },
                { top: "374px", left: "413px" },
              ].map((box, index) => (
                <div
                  key={index}
                  style={{
                    width: "96px",
                    height: "102px",
                    top: box.top,
                    left: box.left,
                    backgroundColor: "#ededed",
                    borderRadius: "10px",
                    border: "1px solid #447f2a",
                    position: "absolute",
                  }}
                />
              ))}

              {/* Numbers and Labels */}
              <div
                style={{
                  position: "absolute",
                  width: "47px",
                  top: "70px",
                  left: "172px",
                  fontFamily: "Poppins, Helvetica",
                  fontWeight: 500,
                  color: "#000000",
                  fontSize: "12px",
                  letterSpacing: "-0.24px",
                  lineHeight: "normal",
                  whiteSpace: "nowrap",
                }}
              >
                5
              </div>
            </div>

            {/* Panel 2 */}
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #888",
                borderRadius: "10px",
                position: "relative",
                width: "523px",
                height: "695px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "43px",
                  left: "50px",
                  fontFamily: "Poppins, Helvetica",
                  fontWeight: 600,
                  color: "#000",
                  fontSize: "18px",
                  whiteSpace: "nowrap",
                }}
              >
                Body Panels
              </div>
            </div>
          </div>
        </div>
      </div>
    <div style={{ margin: 0, padding: 0, backgroundColor: "#f9fafb", display: "grid", justifyItems: "center", alignItems: "start", width: "100vw" }}>

      <div style={{ backgroundColor: "#f9fafb", width: "595px", height: "842px", position: "relative" }}>
        <div style={{
          position: "absolute",
          width: "106px",
          top: "33px",
          left: "52px",
          fontFamily: "Poppins, Helvetica",
          fontWeight: 600,
          color: "#000",
          fontSize: "18px",
          lineHeight: "normal",
          whiteSpace: "nowrap"
        }}>
          Glasses
        </div>
        <div style={{
          position: "absolute",
          width: "523px",
          height: "695px",
          top: "99px",
          left: "36px",
          background: "#fff",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #888"
        }}>
          {/* First Windshield */}
          <div style={{ position: "absolute", width: "103px", height: "14px", top: "82px", left: "25px" }}>
            <p style={{ position: "absolute", width: "101px", top: 0, left: 0, fontFamily: "Poppins, Helvetica", fontWeight: 400, color: "#000", fontSize: "12px", lineHeight: "normal", whiteSpace: "nowrap" }}>
              First Windshield
            </p>
          </div>
          {/* Table headers */}
          <div style={{ position: "absolute", width: "115px", top: "17px", left: "266px", fontFamily: "Inter, Helvetica", fontWeight: 600, color: "#000000bf", fontSize: "12px", lineHeight: "35px", whiteSpace: "nowrap" }}>
            Manufacturing date
          </div>
          <div style={{ position: "absolute", width: "31px", top: "17px", left: "427px", fontFamily: "Inter, Helvetica", fontWeight: 600, color: "#000000bf", fontSize: "12px", lineHeight: "35px", whiteSpace: "nowrap" }}>
            Issue
          </div>
          <div style={{ position: "absolute", width: "37px", top: "17px", left: "183px", fontFamily: "Inter, Helvetica", fontWeight: 600, color: "#000000bf", fontSize: "12px", lineHeight: "35px", whiteSpace: "nowrap" }}>
            Brand
          </div>
          <div style={{ position: "absolute", width: "34px", top: "17px", left: "24px", fontFamily: "Inter, Helvetica", fontWeight: 600, color: "#000000bf", fontSize: "12px", lineHeight: "35px", whiteSpace: "nowrap" }}>
            Parts
          </div>
          <img src="https://c.animaapp.com/medvr0zdl2B2cs/img/line-38.svg" style={{ position: "absolute", top: "113px", left: "15px", width: "494px", height: "1px", objectFit: "cover" }} />
          
          {/* Example row */}
          <div style={{ position: "absolute", width: "30px", height: "14px", top: "82px", left: "187px" }}>
            <div style={{ position: "absolute", width: "28px", top: 0, left: 0, fontFamily: "Poppins, Helvetica", fontWeight: 500, color: "#000", fontSize: "12px", letterSpacing: "-0.24px", lineHeight: "normal", whiteSpace: "nowrap" }}>
              ABC
            </div>
          </div>

          {/* Date + Issue */}
          <div style={{ position: "absolute", width: "157px", height: "15px", top: "82px", left: "304px" }}>
            <div style={{ position: "absolute", left: 0, top: "1px", width: "38px", fontFamily: "Poppins, Helvetica", fontWeight: 500, color: "#000", fontSize: "12px" }}>09/23</div>
            <div style={{ position: "absolute", left: "123px", top: 0, width: "30px", fontFamily: "Poppins, Helvetica", fontWeight: 500, color: "#000", fontSize: "12px" }}>Chip</div>
          </div>
        </div>
      </div>
    </div>

    <div style={{
      margin: 0,
      padding: 0,
      background: "#f9fafb",
      fontFamily: "'Poppins', Helvetica",
      display: "grid",
      justifyItems: "center",
      alignItems: "start",
      width: "100vw",
      gap: "40px",
      padding: "20px 0"
    }}>

      {/* Rubber Component 1 */}
      <div style={{
        backgroundColor: "#f9fafb",
        width: "595px",
        height: "842px",
        position: "relative"
      }}>
        <div style={{
          position: "absolute",
          width: "250px",
          top: "34px",
          left: "48px",
          fontWeight: 600,
          color: "#000000",
          fontSize: "18px",
          lineHeight: "normal",
          whiteSpace: "nowrap"
        }}>
          Rubber Component 1
        </div>

        <div style={{
          position: "absolute",
          width: "523px",
          height: "695px",
          top: "100px",
          left: "36px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #888888"
        }}>
          {/* Labels */}
          {["Bonnet", "Front Left Door", "Rear Left Door"].map((label, idx) => (
            <div key={idx} style={{
              position: "absolute",
              width: "103px",
              height: "14px",
              top: `${90 + idx * 181}px`,
              left: "25px"
            }}>
              <div style={{
                position: "absolute",
                width: "101px",
                top: 0,
                left: 0,
                fontWeight: 400,
                color: "#000000",
                fontSize: "12px",
                lineHeight: "normal",
                whiteSpace: "nowrap"
              }}>
                {label}
              </div>
            </div>
          ))}

          {/* Headers */}
          <div style={{
            position: "absolute",
            width: "37px",
            top: "16px",
            left: "162px",
            fontFamily: "'Inter', Helvetica",
            fontWeight: 600,
            color: "#000000bf",
            fontSize: "12px",
            lineHeight: "35px",
            whiteSpace: "nowrap"
          }}>
            Issue
          </div>
          <div style={{
            position: "absolute",
            width: "34px",
            top: "16px",
            left: "24px",
            fontFamily: "'Inter', Helvetica",
            fontWeight: 600,
            color: "#000000bf",
            fontSize: "12px",
            lineHeight: "35px",
            whiteSpace: "nowrap"
          }}>
            Parts
          </div>

          {/* Lines */}
          {[121, 302, 484].map((top, idx) => (
            <img key={idx} src="https://c.animaapp.com/meduwl1kdgczpz/img/line-38.svg"
              style={{
                position: "absolute",
                top: `${top}px`,
                left: "15px",
                width: "494px",
                height: "1px",
                objectFit: "cover"
              }}
            />
          ))}

          {/* Rows */}
          {[143, 324, 506].map((top, rowIdx) => (
            <div key={rowIdx} style={{ position: "absolute", width: "493px", height: "102px", top: `${top}px`, left: "15px" }}>
              {[0, 99, 199, 298, 397].map((left, colIdx) => (
                <div key={colIdx} style={{
                  position: "absolute",
                  top: 0,
                  left: `${left}px`,
                  width: colIdx === 1 ? "97px" : "96px",
                  height: "102px",
                  backgroundColor: "#ededed",
                  borderRadius: "10px",
                  border: "1px solid #447f2a"
                }} />
              ))}
            </div>
          ))}

          {/* Issue Labels */}
          {["Crack", "Chip", "Scratch"].map((issue, idx) => (
            <div key={idx} style={{
              position: "absolute",
              top: `${89 + idx * 181}px`,
              left: "162px",
              width: idx === 2 ? "54px" : "39px",
              height: "14px",
              fontWeight: 500,
              color: "#000000",
              fontSize: "12px",
              lineHeight: "normal",
              whiteSpace: "nowrap"
            }}>
              {issue}
            </div>
          ))}

        </div>
      </div>

      {/* Rubber Component 2 */}
      <div style={{
        backgroundColor: "#f9fafb",
        width: "595px",
        height: "842px",
        position: "relative"
      }}>
        <div style={{
          position: "absolute",
          top: "34px",
          left: "48px",
          width: "250px",
          fontWeight: 600,
          color: "#000000",
          fontSize: "18px",
          lineHeight: "normal",
          whiteSpace: "nowrap"
        }}>
          Rubber Component 2
        </div>

        <div style={{
          position: "absolute",
          top: "105px",
          left: "36px",
          width: "523px",
          height: "695px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #888888"
        }}>
          {/* Labels */}
          {["Boot", "Rear Left Door", "Front Right Door"].map((label, idx) => (
            <div key={idx} style={{
              position: "absolute",
              top: `${90 + idx * 181}px`,
              left: "25px",
              width: "103px",
              height: "14px"
            }}>
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "101px",
                fontWeight: 400,
                color: "#000000",
                fontSize: "12px",
                lineHeight: "normal",
                whiteSpace: "nowrap"
              }}>
                {label}
              </div>
            </div>
          ))}

          {/* Headers */}
          <div style={{
            position: "absolute",
            top: "16px",
            left: "162px",
            width: "37px",
            fontFamily: "'Inter',Helvetica",
            fontWeight: 600,
            color: "#000000bf",
            fontSize: "12px",
            lineHeight: "35px",
            whiteSpace: "nowrap"
          }}>
            Issue
          </div>
          <div style={{
            position: "absolute",
            top: "16px",
            left: "24px",
            width: "34px",
            fontFamily: "'Inter',Helvetica",
            fontWeight: 600,
            color: "#000000bf",
            fontSize: "12px",
            lineHeight: "35px",
            whiteSpace: "nowrap"
          }}>
            Parts
          </div>

          {/* Lines */}
          {[121, 302, 484].map((top, idx) => (
            <img key={idx} src="https://c.animaapp.com/meduysg6byrIhi/img/line-38.svg"
              style={{
                position: "absolute",
                top: `${top}px`,
                left: "15px",
                width: "494px",
                height: "1px",
                objectFit: "cover"
              }}
            />
          ))}

          {/* Rows */}
          {[143, 324, 506].map((top, rowIdx) => (
            <div key={rowIdx} style={{ position: "absolute", width: "493px", height: "102px", top: `${top}px`, left: "15px" }}>
              {[0, 99, 199, 298, 397].map((left, colIdx) => (
                <div key={colIdx} style={{
                  position: "absolute",
                  top: 0,
                  left: `${left}px`,
                  width: colIdx === 1 ? "97px" : "96px",
                  height: "102px",
                  backgroundColor: "#ededed",
                  borderRadius: "10px",
                  border: "1px solid #447f2a"
                }} />
              ))}
            </div>
          ))}

          {/* Issue Labels */}
          {["Crack", "Chip", "Scratch"].map((issue, idx) => (
            <div key={idx} style={{
              position: "absolute",
              top: `${89 + idx * 181}px`,
              left: "162px",
              width: idx === 2 ? "54px" : "39px",
              height: "14px",
              fontWeight: 500,
              color: "#000000",
              fontSize: "12px",
              lineHeight: "normal",
              whiteSpace: "nowrap"
            }}>
              {issue}
            </div>
          ))}

        </div>
      </div>

      {/* Rubber Component 3 */}
      <div style={{
        backgroundColor: "#f9fafb",
        width: "595px",
        height: "842px",
        position: "relative"
      }}>
        <div style={{
          position: "absolute",
          top: "34px",
          left: "48px",
          width: "250px",
          fontWeight: 600,
          color: "#000000",
          fontSize: "18px",
          lineHeight: "normal",
          whiteSpace: "nowrap"
        }}>
          Rubber Component 3
        </div>

        <div style={{
          position: "absolute",
          top: "104px",
          left: "36px",
          width: "523px",
          height: "695px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #888888"
        }}>
          {/* Labels */}
          {["Front Wiper", "Rear Wiper", "Sunroof"].map((label, idx) => (
            <div key={idx} style={{
              position: "absolute",
              top: `${90 + idx * 181}px`,
              left: "25px",
              width: "103px",
              height: "14px"
            }}>
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "101px",
                fontWeight: 400,
                color: "#000000",
                fontSize: "12px",
                lineHeight: "normal",
                whiteSpace: "nowrap"
              }}>
                {label}
              </div>
            </div>
          ))}

          {/* Headers */}
          <div style={{
            position: "absolute",
            top: "16px",
            left: "162px",
            width: "37px",
            fontFamily: "'Inter',Helvetica",
            fontWeight: 600,
            color: "#000000bf",
            fontSize: "12px",
            lineHeight: "35px",
            whiteSpace: "nowrap"
          }}>
            Issue
          </div>
          <div style={{
            position: "absolute",
            top: "16px",
            left: "24px",
            width: "34px",
            fontFamily: "'Inter',Helvetica",
            fontWeight: 600,
            color: "#000000bf",
            fontSize: "12px",
            lineHeight: "35px",
            whiteSpace: "nowrap"
          }}>
            Parts
          </div>

          {/* Lines */}
          {[121, 302, 484].map((top, idx) => (
            <img key={idx} src="https://c.animaapp.com/medv9dsvGyXPry/img/line-40.svg"
              style={{
                position: "absolute",
                top: `${top}px`,
                left: "15px",
                width: "494px",
                height: "1px",
                objectFit: "cover"
              }}
            />
          ))}

          {/* Rows */}
          {[143, 324, 506].map((top, rowIdx) => (
            <div key={rowIdx} style={{ position: "absolute", width: "493px", height: "102px", top: `${top}px`, left: "15px" }}>
              {[0, 99, 199, 298, 397].map((left, colIdx) => (
                <div key={colIdx} style={{
                  position: "absolute",
                  top: 0,
                  left: `${left}px`,
                  width: colIdx === 1 ? "97px" : "96px",
                  height: "102px",
                  backgroundColor: "#ededed",
                  borderRadius: "10px",
                  border: "1px solid #447f2a"
                }} />
              ))}
            </div>
          ))}

          {/* Issue Labels */}
          {["Crack", "Chip", "Scratch"].map((issue, idx) => (
            <div key={idx} style={{
              position: "absolute",
              top: `${89 + idx * 181}px`,
              left: "162px",
              width: idx === 2 ? "54px" : "39px",
              height: "14px",
              fontWeight: 500,
              color: "#000000",
              fontSize: "12px",
              lineHeight: "normal",
              whiteSpace: "nowrap"
            }}>
              {issue}
            </div>
          ))}

        </div>
      </div>

    </div>
    </div>
    </div>
  );
};

export default CustomerReport;
