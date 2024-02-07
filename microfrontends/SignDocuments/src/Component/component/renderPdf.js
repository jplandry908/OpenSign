import React from "react";
import RSC from "react-scrollbars-custom";
import { Document, Page, pdfjs } from "react-pdf";

import {
  addZIndex,
  defaultWidthHeight,
  handleImageResize,
  handleSignYourselfImageResize
} from "../../utils/Utils";
import EmailToast from "./emailToast";
// import PlaceholderBorder from "./placeholderBorder";
import Placeholder from "../WidgetComponent/placeholder";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function RenderPdf({
  pageNumber,
  pdfOriginalWidth,
  pdfNewWidth,
  drop,
  signerPos,
  successEmail,
  nodeRef,
  handleTabDrag,
  handleStop,
  isDragging,
  setIsSignPad,
  setIsStamp,
  handleDeleteSign,
  setSignKey,
  pdfDetails,
  xyPostion,
  pdfRef,
  pdfUrl,
  numPages,
  pageDetails,
  pdfRequest,
  setCurrentSigner,
  signerObjectId,
  signedSigners,
  setPdfLoadFail,
  placeholder,
  pdfLoadFail,
  setSignerPos,
  setXyPostion,
  index,
  containerWH,
  setIsResize,
  setZIndex,
  handleLinkUser,
  setUniqueId,
  signersdata,
  setIsPageCopy,
  setSignerObjId,
  setShowDropdown,
  setIsInitial,
  setIsCheckboxRequired,
  setIsValidate,
  setWidgetType,
  setValidateAlert,
  setIsRadio,
  setCurrWidgetsDetails
}) {
  const isMobile = window.innerWidth < 767;
  const newWidth = containerWH.width;
  const scale = isMobile ? pdfOriginalWidth / newWidth : 1;
  //check isGuestSigner is present in local if yes than handle login flow header in mobile view
  const isGuestSigner = localStorage.getItem("isGuestSigner");

  // handle signature block width and height according to screen
  const posWidth = (pos, signYourself) => {
    const defaultWidth = defaultWidthHeight(pos.type).width;
    const posWidth = pos.Width ? pos.Width : defaultWidth;
    let width;
    if (signYourself) {
      width = posWidth;
      return width;
    } else {
      if (isMobile) {
        if (!pos.isMobile) {
          if (pos.IsResize) {
            width = posWidth ? posWidth : defaultWidth;
            return width;
          } else {
            width = (posWidth || defaultWidth) / scale;

            return width;
          }
        } else {
          width = posWidth;
          return width;
        }
      } else {
        if (pos.isMobile) {
          if (pos.IsResize) {
            width = posWidth ? posWidth : defaultWidth;
            return width;
          } else {
            width = (posWidth || defaultWidth) * pos.scale;
            return width;
          }
        } else {
          width = posWidth ? posWidth : defaultWidth;
          return width;
        }
      }
    }
  };
  const posHeight = (pos, signYourself) => {
    let height;
    const posHeight = pos.Height;
    const defaultHeight = defaultWidthHeight(pos.type).height;

    if (signYourself) {
      height = posHeight ? posHeight : defaultHeight;

      return height;
    } else {
      if (isMobile) {
        if (!pos.isMobile) {
          if (pos.IsResize) {
            height = posHeight ? posHeight : defaultHeight;
            return height;
          } else {
            height = (posHeight || defaultHeight) / scale;

            return height;
          }
        } else {
          height = posHeight ? posHeight : defaultHeight;
          return height;
        }
      } else {
        if (pos.isMobile) {
          if (pos.IsResize) {
            height = posHeight ? posHeight : defaultHeight;
            return height;
          } else {
            height = (posHeight || defaultHeight) * pos.scale;
            return height;
          }
        } else {
          height = posHeight ? posHeight : defaultHeight;
          return height;
        }
      }
    }
  };

  const xPos = (pos, signYourself) => {
    const resizePos = pos.xPosition;
    if (signYourself) {
      return resizePos;
    } else {
      //checking both condition mobile and desktop view
      if (isMobile) {
        //if pos.isMobile false -- placeholder saved from desktop view then handle position in mobile view divided by scale
        if (!pos.isMobile) {
          return resizePos / scale;
        }
        //pos.isMobile true -- placeholder save from mobile view(small device)  handle position in mobile view(small screen) view divided by scale
        else {
          return resizePos * (pos.scale / scale);
        }
      } else {
        //else if pos.isMobile true -- placeholder saved from mobile or tablet view then handle position in desktop view divide by scale

        if (pos.isMobile) {
          return pos.scale && resizePos * pos.scale;
        }
        //else placeholder save from desktop(bigscreen) and show in desktop(bigscreen)
        else {
          return resizePos;
        }
      }
    }
  };
  const yPos = (pos, signYourself) => {
    const resizePos = pos.yPosition;
    if (signYourself) {
      return resizePos;
    } else {
      //checking both condition mobile and desktop view
      if (isMobile) {
        //if pos.isMobile false -- placeholder saved from desktop view then handle position in mobile view divided by scale
        if (!pos.isMobile) {
          return resizePos / scale;
        }
        //pos.isMobile true -- placeholder save from mobile view(small device)  handle position in mobile view(small screen) view divided by scale
        else {
          return resizePos * (pos.scale / scale);
        }
      } else {
        //else if pos.isMobile true -- placeholder saved from mobile or tablet view then handle position in desktop view divide by scale

        if (pos.isMobile) {
          return pos.scale && resizePos * pos.scale;
        }
        //else placeholder save from desktop(bigscreen) and show in desktop(bigscreen)
        else {
          return resizePos;
        }
      }
    }
  };
  //function for render placeholder block over pdf document
  const checkSignedSignes = (data) => {
    const checkSign = signedSigners.filter(
      (sign) => sign.objectId === data.signerObjId
    );
    if (data.signerObjId === signerObjectId) {
      setCurrentSigner(true);
    }
    const handleAllUserName = () => {
      pdfDetails[0].Signers.map((signerData, key) => {
        return (
          signerData.objectId === data.signerObjId && (
            <div
              key={key}
              style={{
                fontSize: "12px",
                color: "black",
                fontWeight: "600",

                marginTop: "0px"
              }}
            >
              {signerData.Name}
            </div>
          )
        );
      });
    };

    return (
      checkSign.length === 0 &&
      data.placeHolder.map((placeData, key) => {
        return (
          <React.Fragment key={key}>
            {placeData.pageNumber === pageNumber &&
              placeData.pos.map((pos, index) => {
                return (
                  pos && (
                    <React.Fragment key={pos.key}>
                      <Placeholder
                        pos={pos}
                        setSignKey={setSignKey}
                        setIsSignPad={setIsSignPad}
                        setIsStamp={setIsStamp}
                        handleSignYourselfImageResize={handleImageResize}
                        index={pageNumber}
                        xyPostion={signerPos}
                        setXyPostion={setSignerPos}
                        data={data}
                        setIsResize={setIsResize}
                        isShowBorder={false}
                        signerObjId={signerObjectId}
                        isShowDropdown={true}
                        isNeedSign={true}
                        isSignYourself={false}
                        xPos={xPos}
                        yPos={yPos}
                        posWidth={posWidth}
                        posHeight={posHeight}
                        handleUserName={handleAllUserName}
                        isDragging={false}
                        pdfDetails={pdfDetails}
                        setIsInitial={setIsInitial}
                        setValidateAlert={setValidateAlert}
                      />
                    </React.Fragment>
                  )
                );
              })}
          </React.Fragment>
        );
      })
    );
  };

  const handleUserName = (Id, Role) => {
    if (Id) {
      const checkSign = signersdata.find((sign) => sign.Id === Id);
      if (checkSign?.Name) {
        return (
          <>
            <div style={{ color: "black", fontSize: 11 }}>
              {checkSign?.Name}
            </div>
            <div style={{ color: "black", fontSize: 11 }}> {`(${Role})`} </div>
          </>
        );
      } else {
        return <div style={{ color: "black", fontSize: 11 }}> {Role} </div>;
      }
    } else {
      return <div style={{ color: "black", fontSize: 11 }}> {Role} </div>;
    }
  };

  return (
    <>
      {isMobile && scale ? (
        <div
          style={{
            border: "0.1px solid #ebe8e8",
            marginTop: isGuestSigner && "30px"
          }}
          ref={drop}
          id="container"
        >
          <EmailToast isShow={successEmail} />
          {pdfLoadFail.status &&
            (pdfRequest
              ? signerPos.map((data, key) => {
                  return (
                    <React.Fragment key={key}>
                      {checkSignedSignes(data)}
                    </React.Fragment>
                  );
                })
              : placeholder // placeholder mobile
                ? signerPos.map((data, ind) => {
                    return (
                      <React.Fragment key={ind}>
                        {data.placeHolder.map((placeData, index) => {
                          return (
                            <React.Fragment key={index}>
                              {placeData.pageNumber === pageNumber &&
                                placeData.pos.map((pos) => {
                                  return (
                                    <React.Fragment key={pos.key}>
                                      <Placeholder
                                        pos={pos}
                                        setIsPageCopy={setIsPageCopy}
                                        setSignKey={setSignKey}
                                        handleDeleteSign={handleDeleteSign}
                                        setIsStamp={setIsStamp}
                                        handleTabDrag={handleTabDrag}
                                        handleStop={handleStop}
                                        handleSignYourselfImageResize={
                                          handleImageResize
                                        }
                                        index={pageNumber}
                                        xyPostion={signerPos}
                                        setXyPostion={setSignerPos}
                                        setSignerObjId={setSignerObjId}
                                        data={data}
                                        setIsResize={setIsResize}
                                        setShowDropdown={setShowDropdown}
                                        isShowBorder={true}
                                        isPlaceholder={true}
                                        setUniqueId={setUniqueId}
                                        handleLinkUser={handleLinkUser}
                                        handleUserName={handleUserName}
                                        isSignYourself={false}
                                        xPos={xPos}
                                        yPos={yPos}
                                        posWidth={posWidth}
                                        posHeight={posHeight}
                                        isDragging={isDragging}
                                        setIsCheckboxRequired={
                                          setIsCheckboxRequired
                                        }
                                        setIsValidate={setIsValidate}
                                        setWidgetType={setWidgetType}
                                        setIsRadio={setIsRadio}
                                        setCurrWidgetsDetails={
                                          setCurrWidgetsDetails
                                        }
                                      />
                                    </React.Fragment>
                                  );
                                })}
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })
                : xyPostion.map((data, ind) => {
                    return (
                      <React.Fragment key={ind}>
                        {data.pageNumber === pageNumber &&
                          data.pos.map((pos) => {
                            return (
                              pos && (
                                <Placeholder
                                  pos={pos}
                                  setIsPageCopy={setIsPageCopy}
                                  setSignKey={setSignKey}
                                  handleDeleteSign={handleDeleteSign}
                                  setIsStamp={setIsStamp}
                                  handleTabDrag={handleTabDrag}
                                  handleStop={handleStop}
                                  handleSignYourselfImageResize={
                                    handleSignYourselfImageResize
                                  }
                                  index={index}
                                  xyPostion={xyPostion}
                                  setXyPostion={setXyPostion}
                                  pdfOriginalWidth={pdfOriginalWidth}
                                  containerWH={containerWH}
                                  setIsSignPad={setIsSignPad}
                                  isShowBorder={true}
                                  isSignYourself={true}
                                  xPos={xPos}
                                  yPos={yPos}
                                  posWidth={posWidth}
                                  posHeight={posHeight}
                                  pdfDetails={pdfDetails[0]}
                                  isDragging={isDragging}
                                  setIsInitial={setIsInitial}
                                />
                              )
                            );
                          })}
                      </React.Fragment>
                    );
                  }))}

          {/* this component for render pdf document is in middle of the component */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Document
              onLoadError={(e) => {
                setPdfLoadFail(true);
              }}
              loading={"Loading Document.."}
              onLoadSuccess={pageDetails}
              // ref={pdfRef}
              file={
                pdfUrl
                  ? pdfUrl
                  : pdfDetails[0] && pdfDetails[0].SignedUrl
                    ? pdfDetails[0].SignedUrl
                    : pdfDetails[0].URL
              }
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={index}
                  pageNumber={pageNumber}
                  width={containerWH.width}
                  height={containerWH.height}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  onGetAnnotationsError={(error) => {
                    console.log("annotation error", error);
                  }}
                />
              ))}
            </Document>
          </div>
        </div>
      ) : (
        <RSC
          style={{
            position: "relative",
            boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
            width:
              pdfOriginalWidth > pdfNewWidth ? pdfNewWidth : pdfOriginalWidth,
            height: window.innerHeight - 110 + "px"
          }}
          noScrollY={false}
          noScrollX={pdfNewWidth < pdfOriginalWidth ? false : true}
        >
          <div
            style={{
              border: "0.1px solid #ebe8e8",
              width: pdfOriginalWidth
            }}
            ref={drop}
            id="container"
          >
            <EmailToast isShow={successEmail} />
            {pdfLoadFail.status &&
              (pdfRequest
                ? signerPos.map((data, key) => {
                    return (
                      <React.Fragment key={key}>
                        {checkSignedSignes(data)}
                      </React.Fragment>
                    );
                  })
                : placeholder
                  ? signerPos.map((data, ind) => {
                      return (
                        <React.Fragment key={ind}>
                          {data.placeHolder.map((placeData, index) => {
                            return (
                              <React.Fragment key={index}>
                                {placeData.pageNumber === pageNumber &&
                                  placeData.pos.map((pos) => {
                                    return (
                                      <React.Fragment key={pos.key}>
                                        <Placeholder
                                          pos={pos}
                                          setIsPageCopy={setIsPageCopy}
                                          setSignKey={setSignKey}
                                          handleDeleteSign={handleDeleteSign}
                                          setIsStamp={setIsStamp}
                                          handleTabDrag={handleTabDrag}
                                          handleStop={handleStop}
                                          handleSignYourselfImageResize={
                                            handleImageResize
                                          }
                                          index={pageNumber}
                                          xyPostion={signerPos}
                                          setXyPostion={setSignerPos}
                                          setSignerObjId={setSignerObjId}
                                          data={data}
                                          setIsResize={setIsResize}
                                          setShowDropdown={setShowDropdown}
                                          isShowBorder={true}
                                          isPlaceholder={true}
                                          setUniqueId={setUniqueId}
                                          handleLinkUser={handleLinkUser}
                                          handleUserName={handleUserName}
                                          isSignYourself={false}
                                          xPos={xPos}
                                          yPos={yPos}
                                          posWidth={posWidth}
                                          posHeight={posHeight}
                                          isDragging={isDragging}
                                          setIsCheckboxRequired={
                                            setIsCheckboxRequired
                                          }
                                          setIsValidate={setIsValidate}
                                          setWidgetType={setWidgetType}
                                          setIsRadio={setIsRadio}
                                          setCurrWidgetsDetails={
                                            setCurrWidgetsDetails
                                          }
                                        />
                                      </React.Fragment>
                                    );
                                  })}
                              </React.Fragment>
                            );
                          })}
                        </React.Fragment>
                      );
                    })
                  : xyPostion.map((data, ind) => {
                      return (
                        <React.Fragment key={ind}>
                          {data.pageNumber === pageNumber &&
                            data.pos.map((pos) => {
                              return (
                                pos && (
                                  <React.Fragment key={pos.key}>
                                    <Placeholder
                                      pos={pos}
                                      setIsPageCopy={setIsPageCopy}
                                      setSignKey={setSignKey}
                                      handleDeleteSign={handleDeleteSign}
                                      setIsStamp={setIsStamp}
                                      handleTabDrag={handleTabDrag}
                                      handleStop={(event, dragElement) =>
                                        handleStop(event, dragElement, pos.type)
                                      }
                                      handleSignYourselfImageResize={
                                        handleSignYourselfImageResize
                                      }
                                      index={index}
                                      xyPostion={xyPostion}
                                      setXyPostion={setXyPostion}
                                      pdfOriginalWidth={pdfOriginalWidth}
                                      containerWH={containerWH}
                                      setIsSignPad={setIsSignPad}
                                      isShowBorder={true}
                                      isSignYourself={true}
                                      xPos={xPos}
                                      yPos={yPos}
                                      posWidth={posWidth}
                                      posHeight={posHeight}
                                      pdfDetails={pdfDetails[0]}
                                      isDragging={isDragging}
                                      setIsInitial={setIsInitial}
                                    />
                                  </React.Fragment>
                                )
                              );
                            })}
                        </React.Fragment>
                      );
                    }))}

            {/* this component for render pdf document is in middle of the component */}
            <Document
              onLoadError={(e) => {
                const load = {
                  status: false,
                  type: "failed"
                };
                setPdfLoadFail(load);
              }}
              loading={"Loading Document.."}
              onLoadSuccess={pageDetails}
              // ref={pdfRef}
              file={
                pdfUrl
                  ? pdfUrl
                  : pdfDetails[0] && pdfDetails[0].SignedUrl
                    ? pdfDetails[0].SignedUrl
                    : pdfDetails[0].URL
              }
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={index}
                  pageNumber={pageNumber}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  onGetAnnotationsError={(error) => {
                    console.log("annotation error", error);
                  }}
                />
              ))}
            </Document>
          </div>
        </RSC>
      )}
    </>
  );
}

export default RenderPdf;
