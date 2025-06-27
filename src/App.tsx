import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <Profile compact/> {/* remove compact to switch to full profile view and vice-versa */}
      {/* <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Main Content</h1>
      </div> */}   
    </div>
  );
}

export default App;