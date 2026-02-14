import { useState, useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import axios from "axios"; // Added for backend API calls

/* ===== CUSTOM IMAGE EXTENSION (IMAGE SIZE SUPPORT) ===== */
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        renderHTML: (attributes) => ({
          style: `width: ${attributes.width};`,
        }),
      },
    };
  },
});

/* ================= RICH TEXT EDITOR ================= */
const RichEditor = ({ value, onChange }) => {
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit, CustomImage],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  /* ===== LOCAL IMAGE UPLOAD HANDLER ===== */
  const handleLocalImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="flex flex-wrap gap-2 p-2 bg-gray-100 border-b">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="font-bold"
        >
          B
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="italic"
        >
          I
        </button>

        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>

        <button
          onClick={() => {
            const url = prompt("Enter image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          🌐 Image URL
        </button>

        <button onClick={() => fileInputRef.current.click()}>
          💻 Upload Image
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleLocalImageUpload}
          className="hidden"
        />

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .updateAttributes("image", { width: "25%" })
              .run()
          }
        >
          🖼 Small
        </button>

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .updateAttributes("image", { width: "50%" })
              .run()
          }
        >
          🖼 Medium
        </button>

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .updateAttributes("image", { width: "100%" })
              .run()
          }
        >
          🖼 Large
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="p-3 min-h- focus:outline-none"
      />
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
const EditNews = () => {
  const [news, setNews] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [blogExpanded, setBlogExpanded] = useState({});

  /* ========== NEWS EFFECT ========== */
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/news`);

        // If DB is empty → insert default news
        if (res.data.length === 0) {
          const defaultNews = [
            { title: "Heading 1", paragraph: "Paragraph 1" },
            { title: "Heading 2", paragraph: "Paragraph 2" },
            { title: "Heading 3", paragraph: "Paragraph 3" },
            { title: "Heading 4", paragraph: "Paragraph 4" },
          ];

          const saved = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/news/bulk`,

            defaultNews,
          );

          setNews(saved.data);
        } else {
          setNews(res.data);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setNews([]);
      }
    };

    fetchNews();
  }, []);

  /* ========== BLOG EFFECT ========== */
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/blogs`,
        );

        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setBlogs([]);
      }
    };

    fetchBlogs();
  }, []);

  /* ========== NEWS FUNCTIONS ========== */
  const handleNewsChange = (_id, field, value) => {
    setNews((prev) =>
      prev.map((item) =>
        item._id === _id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleNewsSave = async (item) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/news/${item._id}`,
        item,
      );

      alert("News updated successfully!");
    } catch (err) {
      console.error("Error saving news:", err);
      alert("Failed to save news");
    }
  };

  const addNewsItem = async () => {
    try {
      // Ensure default values are strings, not empty
      const newNews = { title: "New Heading", paragraph: "New Paragraph" };

      // Send POST request
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/news`,
        newNews,
        {
          headers: { "Content-Type": "application/json" }, // Ensure JSON is sent
        },
      );

      // Append newly created news to state
      setNews((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding news:", err.response || err);
      alert("Failed to add news");
    }
  };

  const deleteNews = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this news item?"))
      return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/news/${_id}`);

      setNews((prev) => prev.filter((item) => item._id !== _id));
    } catch (err) {
      console.error("Error deleting news:", err);
      alert("Failed to delete news");
    }
  };

  /* ========== BLOG FUNCTIONS ========== */
  const handleBlogChange = (id, field, value) => {
    setBlogs((prev) =>
      prev.map((b) => (b._id === id ? { ...b, [field]: value } : b)),
    );
  };

  const handleBlogSave = async (blog) => {
    try {
      // Only send fields required by backend
      const payload = {
        title: blog.title || "",
        hook: blog.hook || "",
        paragraph: blog.paragraph || "",
        image: blog.image || "", // if you want to include image, otherwise omit
      };

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/blogs/${blog._id}`,

        payload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      // Update the state with saved blog
      setBlogs((prev) => prev.map((b) => (b._id === blog._id ? res.data : b)));

      // Collapse the editor
      setBlogExpanded((prev) => ({ ...prev, [blog._id]: false }));

      alert("Blog saved successfully!");
    } catch (err) {
      console.error("Error saving blog:", err.response || err);
      alert("Failed to save blog");
    }
  };

  const addBlog = async () => {
    const newBlog = {
      title: "New Blog Title", // not empty
      hook: "Blog hook",
      paragraph: "<p>Write your content here</p>",
      image: "",
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/blogs`,
        newBlog,
      );

      setBlogs((prev) => [...prev, res.data]);
      setBlogExpanded((prev) => ({ ...prev, [res.data._id]: true }));
    } catch (err) {
      console.error("Error adding blog:", err);
      alert("Failed to add blog");
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`);

      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Failed to delete blog");
    }
  };

  const toggleBlogExpand = (id) => {
    setBlogExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /* ========== IMAGE UPLOAD (BLOG COVER) ========== */
  const handleImageUpload = (e, blogId) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blogId ? { ...b, image: reader.result } : b,
        ),
      );
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#fff7ec] px-4 py-10">
      {/* ================= NEWS SECTION ================= */}
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-6 border-t-8 border-[#FFAC1C] mb-12">
        <h4 className="text-2xl font-bold text-center text-[#FFAC1C] mb-4">
          Edit News & Events (Home Page)
        </h4>

        <button
          onClick={addNewsItem}
          className="mb-6 w-full bg-[#FFAC1C] text-white py-3 rounded-lg border hover:bg-white hover:text-black!"
        >
          + Add News
        </button>

        {news.map((item) => (
          <div
            key={item._id}
            className="mb-6 p-4 border rounded-lg bg-[#fff2da]"
          >
            <label className="block font-semibold mb-1">Heading</label>
            <input
              type="text"
              value={item.title}
              onChange={(e) =>
                handleNewsChange(item._id, "title", e.target.value)
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />

            <label className="block font-semibold mb-1">Paragraph</label>
            <textarea
              value={item.paragraph}
              onChange={(e) =>
                handleNewsChange(item._id, "paragraph", e.target.value)
              }
              rows={3}
              className="w-full border rounded-lg px-3 py-2"
            />

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleNewsSave(item)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => deleteNews(item._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= BLOG SECTION ================= */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-[#FFAC1C] mb-6 text-center">
          Blogs Section
        </h2>

        <button
          onClick={addBlog}
          className="mb-6 bg-[#FFAC1C] text-white px-4 py-2 rounded border hover:bg-white hover:text-black!"
        >
          Add Blog
        </button>

        {blogs.map((blog, index) => (
          <div
            key={blog._id}
            className="mb-6 p-4 border rounded-lg bg-[#fff2da]"
          >
            <div
              className="flex justify-between cursor-pointer font-semibold"
              onClick={() => toggleBlogExpand(blog._id)}
            >
              Blog {index + 1}
              <span>{blogExpanded[blog._id] ? "Collapse" : "Expand"}</span>
            </div>

            {blogExpanded[blog._id] && (
              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Blog Title"
                  value={blog.title}
                  onChange={(e) =>
                    handleBlogChange(blog._id, "title", e.target.value)
                  }
                  className="w-full border text-black rounded px-3 py-2"
                />

                <input
                  type="text"
                  placeholder="Hook"
                  value={blog.hook}
                  onChange={(e) =>
                    handleBlogChange(blog._id, "hook", e.target.value)
                  }
                  className="w-full border rounded px-3 py-2"
                />

                <RichEditor
                  value={blog.paragraph}
                  onChange={(html) =>
                    handleBlogChange(blog._id, "paragraph", html)
                  }
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, blog._id)}
                />

                {blog.image && (
                  <img
                    src={blog.image}
                    alt="blog"
                    className="w-full h-64 object-cover rounded"
                  />
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleBlogSave(blog)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save Blog
                  </button>
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditNews;
