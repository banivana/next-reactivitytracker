import Sidebar from "./components/Sidebar";

export default function Home() {
  return (
    <div>
      <Sidebar />
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4"> Dashboard Home Page</h1>
      </div>
    </div>
  );
}
