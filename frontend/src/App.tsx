import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoutes";
import NavBar from "./components/ui/navbar";
import { useAtom } from "jotai";
import { userAuth } from "./store";
import LoadingComponent from "./components/LoadingComponent";
const BlogListPage = lazy(() => import("./pages/BlogList"));
const CreateBlog = lazy(() => import("./pages/CreateBlog"));
const Blog = lazy(() => import("./pages/Blog"));
const Signin = lazy(() => import("./pages/Signin"));
const Signup = lazy(() => import("./pages/Signup"));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useAtom(userAuth);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(token !== null); // Update atom based on token presence
  }, [setIsAuthenticated]);
  

  return (
    <>
      <Suspense fallback={ <LoadingComponent />}>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/" element={<BlogListPage />} />

            <Route
              element={<ProtectedRoute isAuthenticated={isAuthenticated} />}
            >
              <Route path="/blog/create" element={<CreateBlog />} />
              <Route path="/blogs/:id" element={<Blog />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Suspense>
    </>
  );
}

export default App;
