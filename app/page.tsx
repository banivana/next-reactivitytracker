import * as React from "react";
import Sidebar from "./components/dashboard/Sidebar";

export default function Home() {
  return (
    <div className="flex flex-row">
      <div>
        <Sidebar />
      </div>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4"> Dashboard Home Page</h1>
      </div>
    </div>
  );
}
