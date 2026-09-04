"use client";
import dynamic from "next/dynamic";

// L'app legge/scrive localStorage in modo sincrono al primo render: viene
// caricata solo lato client (niente SSR) per evitare disallineamenti tra
// il markup del server e quello del browser.
const App = dynamic(() => import("../components/App"), { ssr: false });

export default function Page() {
  return <App />;
}
