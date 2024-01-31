/* eslint-disable no-mixed-spaces-and-tabs */
import { useState } from "react";
import Head from "next/head";
import ReactMarkdown from 'react-markdown'
// import { createParser } from "eventsource-parser";
import Navbar from "@/Components/Navbar";
import { useUser } from "@supabase/auth-helpers-react";
import { streamOpenAIResponse } from "@/utils/openai";
import toast, { Toaster } from "react-hot-toast";
// import { useEffect } from "react";

export default function Home() {
  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter" && !e.shiftkey) {
  //     e.preventDefault();
  //     sendRequest();
  //   }
  // }

  const user = useUser();
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are Cybix, a helpful AI developed by Coxwell and powered by state-of-the-art machine learning models.",
    },
  ]);


  const sendRequest = async () => {
    if (!userMessage) {
      alert("Please enter a message before you hit send");
    }

    if (!user) {  // comes from useUser();
      alert("Please log in to send a message!");
    }
   
    const oldUserMessage = userMessage;
    const oldMessages = messages;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: userMessage,
      },
    ];

    setMessages(updatedMessages);
    setUserMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: updatedMessages,
          stream: true,
        }),
      });

      if (response.status !== 200) {
        throw new Error(
          `OpenAI API returned an error.`
        );
      }

      streamOpenAIResponse(response, (newMessage) => {
        console.log("newMessage:", newMessage)
        // const updatedMessages2 = [
          // ...updatedMessages,
          // { role: "assistant", 'content': newMessage },
        // ];

        // setMessages(updatedMessages2);
      });
    } catch (error) {
      console.error("error", error);

      setUserMessage(oldUserMessage);
      setMessages(oldMessages);
      window.alert("Error:" + error.message);
    }
  };


  return (
    <>
      <Head>
        <title>Cybix</title>
      </Head>
      <Toaster />
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Message History */}
        <div className="flex-1 overflow-y-scroll">
          <div className="mx-auto w-full max-w-screen-md p-4 ">
            {messages
              .filter((msg) => msg.role !== "system")
              .map((msg, idx) => (
                <div key={idx} className="mt-3">
                  <div className="font-bold">
                    {msg.role === "user" ? "You" : "Cybix"}
                  </div>
                  <div className="text-lg prose">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="mx-auto w-full max-w-screen-md px-4 pt-0 pb-2 flex">
          <textarea
            className="border rounded-md text-lg p-2 flex-1"
            rows={1}
            placeholder="Ask me anything..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
          <button
            onClick={sendRequest}
            className="border rounded-md bg-blue-500 hover:bg-blue-600 text-white px-4 ml-2"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}






