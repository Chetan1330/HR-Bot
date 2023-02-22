import axios from "axios";
import React from "react";
import url from "../url";

const Testing = () => {
  const test = () => {
    // alert("hey");
    axios
      .post(
        url + "conversations/user123/trigger_intent?output_channel=latest",
        {
          name: "create_profile",
        }
      )
      .then((r) => {
        console.log(r.data.messages[0].text);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      <button
        onClick={() => test()}
        className="p-3 bg-blue-500 border-3 text-white"
      >
        Test button
      </button>
      {/* curl -H "Content-Type: application/json" -X POST \
  -d '{"name": "create_profile", "entities": {"plant": "Orchid"}}' \
  "http://localhost:5005/conversations/user123/trigger_intent?output_channel=latest" */}
    </>
  );
};

export default Testing;
