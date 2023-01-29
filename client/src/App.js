import Main from './components/main'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "*",
    element: <div>Error 404</div>,
  },
]);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <Desktop/> */}
        <RouterProvider router={router} />
      </header>
    </div>
  );
}

export default App;
