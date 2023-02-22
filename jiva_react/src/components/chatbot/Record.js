// import "./App.css";
import axios from "axios";
import React, { useEffect, useState,useRef } from "react";
import url, { backend_url } from "../url";
import Testing from "./Testing";

import VideoJSComponent from "./VideoJSComponent";

function RecordVid() {
  const [buttons, setButtons] = useState([]);
  const [recordvid, setRecordVid] = useState(false);
  const [message, setMessage] = useState("");
  const [incomingmessage, setIncominMessage] = useState("");
  const [conversations, setConversation] = useState([]);
  const playerRef = React.useRef(null);
  const [createprofile, setCreateProfile] = useState(false);
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [othernames, setOtherNames] = useState("");
  const [firstname, setFirstName] = useState("");
  const [video, setVideo] = useState();
  const [savevideo, setSavevideo] = useState(false);

  const [profilelink, setProfileLink] = useState("");

  const [videolink, setVideoLink] = useState("");


  // Scroll test

  const chatContainerRef = useRef(null);

  // function to scroll the chat to the bottom
  const scrollChatToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  // effect to scroll to the bottom when new messages are added
  useEffect(() => {
    scrollChatToBottom();
    console.log("called")
  }, [conversations]);


  // end scroll test
  const sendVideoLink = () => {
    let session_id = localStorage.getItem("session_id");
    axios
      .post(
        url +
          `conversations/${session_id}/trigger_intent?output_channel=latest`,
        {
          name: "video_link",
          entities: {
            videolink,
          },
        }
      )
      .then((res) => {
        setSavevideo(false);
        setRecordVid(false);
      })
      .catch((e) => {})
      .then((r) => {});
  };

  const rerecordVideo = () => {
    setSavevideo(false);
    setRecordVid(true);
  };

  const uploadVid = (vid) => {
    var bodyFormData = new FormData();
    bodyFormData.append("video", vid);

    // console.log(video.Blob);

    // return;

    axios
      .post(backend_url + "api/upload_video", bodyFormData, {
        headers: {
          "content-type": "multipart/form-data",
          // headers: { "Content-Type": "multipart/form-data" },
        },
      })
      .then((res) => {
        console.log(res.data);
        // sendVideoLink()

        // setSavevideo(false);
        // setRecordVid(false);

        sendVideoLink();

        setVideoLink(res.data.file_name);
      })
      .catch((e) => {
        console.log(e);
      })
      .then((r) => {
        console.log(r);
      });
  };

  useEffect(() => {
    // Send initial message
    sendInitialMessage();
  }, []);

  const sendInitialMessage = () => {
    // Create a session ID
    const d = new Date();
    let time = d.getTime();

    localStorage.setItem("session_id", time);
    // addOutGoingMessage("hi");
    axios
      .post(url + "webhooks/rest/webhook", {
        message: "Hi",
        sender: localStorage.getItem("session_id"),
      })
      .then((r) => {
        // 4. append received text send text
        // alert(r);

        // console.log(r);
        let obj = {
          messag: r.data[0].text,
          type: 1,
        };
        if (r.data[0].buttons) {
          setButtons(r.data[0].buttons);
        }
        // if(r.data[0].button)
        setConversation((conversations) => [...conversations, obj]);

        // setIncominMessage(r.data[0].text);

        if (r.data[0].text == "Please record a video") {
          //   $("#myVideors").show();
          alert("Record video");
          return;
        }

        // alert(r.data[0].text);

        // $("#chatArea").append(
        //   `<div class='direct-chat-msg right'> <div class='direct-chat-text'>${r.data[0].text} </div></div>`
        // );
        console.log(r);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
  const videoJsOptions = {
    controls: true,
    bigPlayButton: false,
    width: 320,
    height: 240,
    fluid: false,
    plugins: {
      /*
      // wavesurfer section is only needed when recording audio-only
      wavesurfer: {
        backend: 'WebAudio',
        waveColor: '#36393b',
        progressColor: 'black',
        debug: true,
        cursorWidth: 1,
        msDisplayMax: 20,
        hideScrollbar: true,
        displayMilliseconds: true,
        plugins: [
          // enable microphone plugin
          WaveSurfer.microphone.create({
            bufferSize: 4096,
            numberOfInputChannels: 1,
            numberOfOutputChannels: 1,
            constraints: {
              video: false,
              audio: true
            }
          })
        ]
      },
      */
      record: {
        audio: true,
        video: true,
        maxLength: 10,
        debug: true,
      },
    },
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // handle player events
    // device is ready
    player.on("deviceReady", () => {
      console.log("device is ready!");
    });

    // user clicked the record button and started recording
    player.on("startRecord", () => {
      console.log("started recording!");
    });

    // user completed recording and stream is available
    player.on("finishRecord", () => {
      // recordedData is a blob object containing the recorded data that
      // can be downloaded by the user, stored on server etc.
      setVideo(player.recordedData);
      setSavevideo(true);

      // alert("Hey");
      uploadVid(player.recordedData);

      console.log("finished recording: nnnnn ", player.recordedData);
    });

    // error handling
    player.on("error", (element, error) => {
      console.warn(error);
    });

    player.on("deviceError", () => {
      console.error("device error:", player.deviceErrorCode);
    });
  };

  const renderconversations = conversations.map((text, index) => (
    <>
      {text.type == 1 ? (
        <div>
          <div class="col-start-1 col-end-8 p-3 rounded-lg">
            <div class="flex flex-row items-center">
              <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                A
              </div>
              <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                <div>{text.messag}</div>
                {/* <a href="kk">nnnn</a> */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div class="col-start-6 col-end-13 p-3 rounded-lg">
            <div class="flex items-center justify-start flex-row-reverse">
              <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                A
              </div>
              <div class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                <div>{text.messag}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  ));

  const startVideoRecord = (e) => {
    e.preventDefault();
    setRecordVid(true);
  };
  const processSubmitForm = () => {
    // alert("process form");
    let session_id = localStorage.getItem("session_id");
    axios
      .post(
        url +
          `conversations/${session_id}/trigger_intent?output_channel=latest`,
        {
          name: "create_account",
          entities: {
            firstname,
            othernames,
            phonenumber,
            experience,
            skills,
            videolink,
          },
        }
      )
      .then((r) => {
        console.log(r.data.messages[0].text);
        console.log(r);
        if (r.data.messages[0].text == "successful") {
          // setRecordVid(true);
          setCreateProfile(false);
          setSavevideo(false);
          setRecordVid(false);
        }

        addIncomingText(r.data.messages[0].text);
        setProfileLink(r.data.messages[1].text);
        // Enable create profile form

        // if (payload.payload == "/create_profile") {
        //   setCreateProfile(true);
        // }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const sendMessage = (e) => {
    e.preventDefault();

    let obj = {
      messag: message,
      type: 0,
    };
    setConversation((conversations) => [...conversations, obj]);

    // const d = new Date();
    // let time = d.getTime();

    // localStorage.setItem("session_id", time);
    axios
      .post(url+"webhooks/rest/webhook", {
        message: message,
        sender: localStorage.getItem("session_id"),
      })
      .then((r) => {
        // 4. append received text send text
        // alert(r);

        setMessage("");
        // console.log(r);
        let obj = {
          messag: r.data[0].text,
          type: 1,
        };
        if (r.data[0].buttons) {
          setButtons(r.data[0].buttons);
        }
        // if(r.data[0].button)
        setConversation((conversations) => [...conversations, obj]);

        if (r.data[0].text == "register") {
          setCreateProfile(true);
        }

        // setIncominMessage(r.data[0].text);

        if (r.data[0].text == "Please record a video") {
          //   $("#myVideors").show();
          alert("Record video");
          return;
        }

        // alert(r.data[0].text);

        // $("#chatArea").append(
        //   `<div class='direct-chat-msg right'> <div class='direct-chat-text'>${r.data[0].text} </div></div>`
        // );
        console.log(r);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const buttonResponse = (payload) => {
    let session_id = localStorage.getItem("session_id");
    addOutGoingMessage(payload.title);

    let mypayload = payload.payload;

    let py = mypayload.replace("/", ""); //remove forward slash

    axios
      .post(
        url +
          `conversations/${session_id}/trigger_intent?output_channel=latest`,
        {
          name: py,
        }
      )
      .then((r) => {
        console.log(r.data.messages[0].text);
        addIncomingText(r.data.messages[0].text);
        // Enable create profile form

        // if (payload.payload == "/create_profile") {
        //   setCreateProfile(true);
        // }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const addOutGoingMessage = (text) => {
    setButtons([]);

    let obj = {
      messag: text,
      type: 0,
    };
    setConversation((conversations) => [...conversations, obj]);
  };
  const addIncomingText = (text) => {
    let obj = {
      messag: text,
      type: 1,
    };
    if (text.buttons) {
      setButtons(text.buttons);
    }
    // if(r.data[0].button)
    setConversation((conversations) => [...conversations, obj]);
  };

  const renderUploadConsentButtons = () => (
    <div className="flex flex-col space-x-2  w-full">
      <div class="col-start-1 col-end-8 p-3 rounded-lg">
        <div class="flex flex-row items-center">
          <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
            A
          </div>
          <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
            <div>Do you want to save your profile?</div>
          </div>
        </div>
      </div>

      <div className="flex flex-row">
        <button
          onClick={() => processSubmitForm()}
          class="md:w-1/4 my-1 mx-1 w-1/2 px-6 py-2.5  bg-blue-600 text-white
                font-medium
                text-xs
                leading-tight
                
                rounded
                shadow-md
                hover:bg-blue-700 hover:shadow-lg
                focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                active:bg-blue-800 active:shadow-lg
                transition
                duration-150
                ease-in-out"
        >
          Yes
        </button>
        <button
          onClick={() => rerecordVideo()}
          class="md:w-1/4 my-1 mx-1 w-1/2 px-6 py-2.5  bg-blue-600 text-white
                font-medium
                text-xs
                leading-tight
                
                rounded
                shadow-md
                hover:bg-blue-700 hover:shadow-lg
                focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                active:bg-blue-800 active:shadow-lg
                transition
                duration-150
                ease-in-out"
        >
          Re Record Video
        </button>
      </div>
    </div>
  );

  const renderButton = buttons.map((btn, index) => (
    <div className="flex flex-row space-x-2 space-y-2 w-full">
      <button
        onClick={() => buttonResponse(btn)}
        class="md:w-1/4 my-1 mx-1 w-1/2 px-6 py-2.5  bg-blue-600 text-white
                font-medium
                text-xs
                leading-tight
                
                rounded
                shadow-md
                hover:bg-blue-700 hover:shadow-lg
                focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                active:bg-blue-800 active:shadow-lg
                transition
                duration-150
                ease-in-out"
      >
        {btn.title}
      </button>
    </div>
  ));

  const registerform = () => {
    return (
      <div class="block p-6 rounded-lg shadow-lg bg-white  w-full">
        <form onSubmit={(e) => startVideoRecord(e)}>
          {/* <div class="grid grid-cols-2 gap-4"> */}
          <div class="flex md:flex-row flex-col w-full md:space-x-2">
            <div class="form-group mb-6 md:w-1/3">
              {/* <label className="items-left items-start object-left text-left">hhh</label> */}
              <input
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                class="form-control
                        block
                        w-full
                        px-3
                        py-1.5
                        text-base
                        font-normal
                        text-gray-700
                        bg-white bg-clip-padding
                        border border-solid border-gray-300
                        rounded
                        transition
                        ease-in-out
                        m-0
                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                id="exampleInput123"
                aria-describedby="emailHelp123"
                placeholder="First name"
                required
              />
            </div>
            <div class="form-group mb-6 md:w-1/3">
              {/* <label className="items-left items-start object-left text-left">hhh</label> */}
              <input
                value={othernames}
                onChange={(e) => setOtherNames(e.target.value)}
                type="text"
                class="form-control
                        block
                        w-full
                        px-3
                        py-1.5
                        text-base
                        font-normal
                        text-gray-700
                        bg-white bg-clip-padding
                        border border-solid border-gray-300
                        rounded
                        transition
                        ease-in-out
                        m-0
                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                id="exampleInput123"
                aria-describedby="emailHelp123"
                placeholder="Other names"
                required
              />
            </div>
            <div class="form-group mb-6 md:w-1/3">
              <input
                value={phonenumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="text"
                class="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                id="exampleInput124"
                aria-describedby="emailHelp124"
                placeholder="Phone Number"
                required
              />
            </div>
          </div>
          <div className="flex md:flex-row flex-col md:space-x-3">
            <div class="form-group mb-6 md:w-1/2">
              <input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                type="text"
                class="form-control block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                id="exampleInput125"
                placeholder="Years of experience"
              />
            </div>
            <div class="form-group mb-6 md:w-1/2">
              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                type="text"
                class="form-control block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                id="exampleInput126"
                placeholder="Top 5 Skills"
              />
            </div>
          </div>

          <button
            type="submit"
            class="
                md:w-1/4
                w-3/4
                px-6
                py-2.5
                bg-blue-600
                text-white
                font-medium
                text-xs
                leading-tight
                
                rounded
                shadow-md
                hover:bg-blue-700 hover:shadow-lg
                focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                active:bg-blue-800 active:shadow-lg
                transition
                duration-150
                ease-in-out"
          >
            Create Profile
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="App">
      {/* <VideoJSComponent options={videoJsOptions} onReady={handlePlayerReady} /> */}
      {/* <Testing /> */}

      {/* <button onClick={() => setProfileLink("nn")}>Upload video</button> */}
      <button onClick={() => uploadVid(video)}>Upload video</button>

      {/* chat */}
      <div class="flex h-screen antialiased text-gray-800">
        <div class="flex flex-row h-full w-full overflow-x-hidden">
          {/* end */}
          <div class="flex flex-col flex-auto h-full p-6">
            <div class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
              <div class="flex flex-col h-full overflow-x-auto mb-4">
                <div class="flex flex-col h-full">
                  {/* <div class="grid grid-cols-12 gap-y-2"> */}
                  <div class="flex flex-col" ref={chatContainerRef}>
                    {/* start */}
                    {renderconversations}

                    {/* end */}
                    <div class="w-full">{renderButton}</div>
                    {profilelink ? (
                      <>
                        <div class="col-start-1 col-end-8 p-3 rounded-lg">
                          <div class="flex flex-row items-center">
                            <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                              A
                            </div>
                            <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                              <div>
                                <a
                                  className="text-blue-500 undeline"
                                  href={`#/profile/${profilelink}`}
                                >
                                  {" "}
                                  Here is your profile link
                                </a>
                              </div>
                              {/* <a href="kk">nnnn</a> */}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}
                    <div class="col-start-1 col-end-8 p-3 rounded-lg">
                      {createprofile ? <>{registerform()}</> : null}
                      {recordvid ? (
                        <>
                          <div class="col-start-1 col-end-8 p-3 rounded-lg">
                            <div class="flex flex-row items-center">
                              <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                A
                              </div>
                              <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                <div>
                                  Please record your video giving introduction
                                  about your overal experience
                                </div>
                              </div>
                            </div>
                          </div>
                          <VideoJSComponent
                            options={videoJsOptions}
                            onReady={handlePlayerReady}
                          />
                        </>
                      ) : null}

                      {savevideo ? <> {renderUploadConsentButtons()}</> : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* start */}

              <form onSubmit={(e) => sendMessage(e)}>
                <div class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                  <div class="flex-grow ml-4">
                    <div class="relative w-full">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                      />
                    </div>
                  </div>
                  <div class="ml-4">
                    <button
                      // onClick={() => sendMessage()}
                      class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                    >
                      <span>Send</span>
                      <span class="ml-2">
                        <svg
                          class="w-4 h-4 transform rotate-45 -mt-px"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          ></path>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </form>
              {/* end */}
            </div>
          </div>
        </div>
      </div>
      {/* endchat */}
    </div>
  );
}

export default RecordVid;
