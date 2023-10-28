"use client";
import { useLit } from "@/context/litContext";
import Image from "next/image";

export default function Home() {
  const { jwtConnect, jwt, verified } = useLit();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        {!jwt && <button onClick={jwtConnect}>Connect</button>}
        {jwt && !verified && <div className="text-white">not-verified</div>}
        {jwt && verified && <div className="text-white">verified</div>}
      </div>
    </main>
  );
}
