import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import DropDown2, { VibeType2 } from "../components/DropDown2";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Github from "../components/GitHub";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import Script from "next/script";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [desc, setDesc] = useState("");
  const [lang, setLang] = useState<VibeType>("English");
  const [difficulty, setDifficulty] = useState<VibeType2>("Easy");
  const [generatedDescs, setGeneratedDescs] = useState<string>("");
  const defultDesc = "How to explain relativity?";

  console.log("Streamed response: ", { generatedDescs });
  const promptObj = {
    "English": "UK English",
    "中文": "Simplified Chinese",
    "繁體中文": "Traditional Chinese",
    "日本語": "Japanese",
    "Italiano": "Italian",
    "Deutsch": "German",
    "Español": "Spanish",
    "Français": "French",
    "Nederlands": "Dutch",
    "한국어": "Korean",
    "ភាសាខ្មែរ": "Khmer",
    "हिंदी": "Hindi",
    "Indonesian": "Indonesian",
  };
  const difficultyObj = {
    "Easy": "Easy",
    "Professional": "Professional",
  };
  const text = desc || defultDesc;

  const generateDesc = async (e: any) => {
    let prompt;
    if (difficultyObj[difficulty] == "Easy") {
      prompt = `Pretend you are GPT-4 model. Explain ${text}${
        text.slice(-1) === "." ? "" : "."
      } to a 6nd grader in ${promptObj[lang]} with a simple example.`;
    } else {
      prompt = `Pretend you are GPT-4 model. Explain ${text}${
        text.slice(-1) === "." ? "" : "."
      } in ${
        promptObj[lang]
      }  in technical terms, divided into two paragraphs, principles and applications. Output format, Principle:, Application.`;
    }
    e.preventDefault();
    setGeneratedDescs("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      setError(true);
      setLoading(false);
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedDescs((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Teach Anything</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-6000PLHFK1"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-6000PLHFK1');
        `}
      </Script>

      <Header />

      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-2 sm:my-16">
        <h1 className="sm:text-4xl text-2xl max-w-1xl font-bold text-slate-900">
          Teach you{" "}
          <span className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
            Anything
          </span>{" "}
          in seconds
        </h1>
        <p className="text-slate-500 my-5">1,063,505 answers generated so far.</p>
        <div className="max-w-xl w-full">
          <div className="flex mt-4 items-center space-x-3 mb-3">
            <span className="w-7 h-7 rounded-full bg-black text-white text-center leading-7">
              1
            </span>
            <p className="text-left font-medium">Write your question</p>
          </div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black block"
            placeholder={"e.g. " + defultDesc}
          />
          <div className="flex my-4 items-center space-x-3">
            <span className="w-7 h-7 rounded-full bg-black text-white text-center leading-7">
              2
            </span>
            <p className="text-left font-medium">Select your language</p>
          </div>
          <div className="block">
            <DropDown vibe={lang} setVibe={(newLang) => setLang(newLang)} />
          </div>

          <div className="flex my-4 items-center space-x-3">
            <span className="w-7 h-7 rounded-full bg-black text-white text-center leading-7">
              3
            </span>
            <p className="text-left font-medium">Select difficulty</p>
          </div>
          <div className="block">
            <DropDown2
              vibe2={difficulty}
              setVibe2={(newDifficulty) => setDifficulty(newDifficulty)}
            />
          </div>

          <div className="md:flex sm:mt-6 mt-4 space-y-4 md:space-y-0 gap-4">
            {!loading && (
              <button
                className="bg-black md:flex-1 rounded-xl text-white font-medium px-4 py-2 hover:bg-black/80 w-full"
                onClick={(e) => generateDesc(e)}
              >
                Generate answer
              </button>
            )}
            {loading && (
              <button
                className="bg-black md:flex-1 rounded-xl text-white font-medium px-4 py-2 hover:bg-black/80 w-full"
                disabled
              >
                <LoadingDots color="white" style="large" />
              </button>
            )}
            <a
              href="https://play.google.com/store/apps/dev?id=5705470950560967631"
              className="pro-btn  block md:flex-1 border border-transparent rounded-xl font-medium px-4 py-2 w-full"
            >
              More Apps &rarr;
            </a>
          </div>
        </div>
        <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 2000 }} />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-4">
              {generatedDescs && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      The answer is
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto  whitespace-pre-wrap">
                    <div
                      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border text-left"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedDescs);
                        toast("Text copied to clipboard", {
                          icon: "✂️",
                        });
                      }}
                    >
                      <p>{generatedDescs}</p>
                      <blockquote className="mt-4 text-sm border-l-4 border-slate-300 pl-3 text-slate-400">
                        Teach Anything with Ai
                      </blockquote>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
        {error && (
          <p className="text-gray-400 my-5">
            🚨 Server is busy, please try again later, or you can
            <a href="https://magickpen.com/" className=" underline hover:text-black ml-1">
              Get Pro version
            </a>
            .
          </p>
        )}
        
              </main>
      <Footer />
      <a
        href="https://discord.gg/baGvNpRujT"
        target="_blank"
        className="fixed right-4 bottom-4 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white hover:bg-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path
            fill-rule="evenodd"
            d="M10 3c-4.31 0-8 3.033-8 7 0 2.024.978 3.825 2.499 5.085a3.478 3.478 0 01-.522 1.756.75.75 0 00.584 1.143 5.976 5.976 0 003.936-1.108c.487.082.99.124 1.503.124 4.31 0 8-3.033 8-7s-3.69-7-8-7zm0 8a1 1 0 100-2 1 1 0 000 2zm-2-1a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </div>
  );
};

export default Home;

