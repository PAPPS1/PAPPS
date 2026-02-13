import React, { useEffect, useState } from "react";
import axios from "axios";
const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [activeBlog, setActiveBlog] = useState(null);

  useEffect(() => {
    // Fetch blogs from backend
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(res.data); // Set blogs from backend
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setBlogs([]); // fallback to empty array
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#fff7ec] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#FFAC1C] mb-8">
          Welcome to Blogs
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog, index) => (
            <div
              key={blog._id}
              className="bg-white shadow-xl rounded-xl border-t-8 border-[#FFAC1C] p-4"
            >
              <div className="text-sm text-gray-500 mb-1">#{index + 1}</div>

              <h2 className="text-xl font-bold text-[#FFAC1C] mb-2">
                {blog.title}
              </h2>

              {blog.hook && (
                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                  {blog.hook}
                </h5>
              )}

              {/* BLOG IMAGE (CARD VIEW ONLY) */}
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}

              <button
                onClick={() => setActiveBlog(blog)}
                className="bg-[#FFAC1C] text-white px-4 py-2 rounded"
              >
                Expand / Read More
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FULL SCREEN MODAL */}
      {activeBlog && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="bg-white w-full h-full p-6 relative">
            <button
              onClick={() => setActiveBlog(null)}
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>

            <div className="max-w-4xl mx-auto h-full flex flex-col">
              <h2 className="text-3xl font-bold text-[#FFAC1C] mb-2">
                {activeBlog.title}
              </h2>

              {activeBlog.hook && (
                <h5 className="text-lg font-semibold mb-4 text-gray-700">
                  {activeBlog.hook}
                </h5>
              )}

              <div className="flex-1 overflow-y-auto wrap-break-word prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: activeBlog.paragraph,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
