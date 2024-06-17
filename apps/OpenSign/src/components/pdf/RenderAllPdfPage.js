import React, { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { useSelector } from "react-redux";

function RenderAllPdfPage({
  signPdfUrl,
  allPages,
  setAllPages,
  setPageNumber,
  setSignBtnPosition,
  pageNumber,
  signerPos,
  signerObjectId
}) {
  const [signPageNumber, setSignPageNumber] = useState([]);
  const [bookmarkColor, setBookmarkColor] = useState("");
  //set all number of pages after load pdf
  function onDocumentLoad({ numPages }) {
    setAllPages(numPages);
    //check if signerPos array exist then save page number exist in signerPos array to show bookmark icon
    if (signerPos) {
      const checkUser = signerPos.filter(
        (data) => data.signerObjId === signerObjectId
      );
      setBookmarkColor(checkUser[0]?.blockColor);
      let pageNumberArr = [];
      if (checkUser?.length > 0) {
        checkUser[0]?.placeHolder?.map((data) => {
          pageNumberArr.push(data?.pageNumber);
        });

        setSignPageNumber(pageNumberArr);
      }
    }
  }
  const pageContainer = useRef();
  const isHeader = useSelector((state) => state.showHeader);
  const [pageWidth, setPageWidth] = useState("");

  useEffect(() => {
    const updateSize = () => {
      if (pageContainer.current) {
        setPageWidth(pageContainer.current.offsetWidth);
      }
    };

    // Use setTimeout to wait for the transition to complete
    const timer = setTimeout(updateSize, 100); // match the transition duration

    return () => clearTimeout(timer);
  }, [isHeader, pageContainer]);
  //'function `addSignatureBookmark` is used to display the page where the user's signature is located.
  const addSignatureBookmark = (index) => {
    const ispageNumber = signPageNumber.includes(index + 1);
    return (
      ispageNumber && (
        <div className="absolute z-20 top-[1px] -right-[13px] -translate-x-1/2 -translate-y-1/2">
          <i
            style={{ color: bookmarkColor || "red" }}
            className="fa-solid fa-bookmark"
          ></i>
        </div>
      )
    );
  };

  return (
    <div
      ref={pageContainer}
      className="hidden min-h-screen w-[20%]  bg-base-100 h-full md:block"
    >
      <div className="mx-2 pr-2 pt-2 pb-1 text-[15px] text-base-content font-semibold border-b-[1px] border-base-300">
        Pages
      </div>
      <div
        className={`flex h-[90%] flex-col items-center m-2  
         autoSignScroll hide-scrollbar max-h-[100vh] `}
      >
        <Document
          loading={"Loading Document.."}
          onLoadSuccess={onDocumentLoad}
          file={signPdfUrl}
        >
          {Array.from(new Array(allPages), (el, index) => (
            <div
              key={index}
              className={`${
                pageNumber - 1 === index ? "border-[red]" : "border-[#878787]"
              } border-2   m-[10px] flex justify-center items-center relative`}
              onClick={() => {
                setPageNumber(index + 1);
                if (setSignBtnPosition) {
                  setSignBtnPosition([]);
                }
              }}
            >
              {signerPos && addSignatureBookmark(index)}

              <div className="relative z-[1] overflow-hidden">
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={pageWidth - 60}
                  scale={1}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </div>
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}

export default RenderAllPdfPage;
