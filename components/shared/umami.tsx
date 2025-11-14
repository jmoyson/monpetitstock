"use client";
import Script from "next/script";

export default function Umami() {
  return (
    <Script
      src="https://umami.jmoyson.com/script.js" // adapte à ton instance/cloud
      data-website-id="b71aeb6d-92d0-43de-abdd-26dd409c9f6f" // remplace par ton website ID Umami
      strategy="lazyOnload"
    />
  );
}
