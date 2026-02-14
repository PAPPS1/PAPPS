import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/events`;

const Events = ({ auth }) => {
  const [events, setEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [expandedEvent, setExpandedEvent] = useState({});
  const [expandedCompleted, setExpandedCompleted] = useState({});
  const [loading, setLoading] = useState(true);

  const isAdmin =
    (auth?.role === "admin" || auth?.role === "senior_admin") &&
    auth?.isLoggedIn;

  /* ===============================
      LOAD EVENTS FROM BACKEND
  ================================*/
  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_URL);
      const upcoming = res.data.filter((e) => e.status === "upcoming");
      const completed = res.data.filter((e) => e.status === "completed");
      setEvents(upcoming);
      setCompletedEvents(completed);
    } catch (err) {
      console.error("Fetch events error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* ===============================
        ADD UPCOMING EVENT
  ================================*/
  const addEvent = async () => {
    if (!isAdmin) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    try {
      const newEvent = {
        title: "",
        description: "",
        deadline: new Date().toISOString(),
        registrationLink: "",
        status: "upcoming",
      };

      const res = await axios.post(API_URL, newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents((prev) => [...prev, res.data]);
      setExpandedEvent((prev) => ({ ...prev, [res.data._id]: true }));
    } catch (err) {
      console.error("Add event error:", err);
      alert("Failed to add event");
    }
  };

  /* ===============================
        ADD COMPLETED EVENT
  ================================*/
  const addCompleted = async () => {
    if (!isAdmin) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    try {
      const newEvent = {
        title: "",
        description: "",
        completedDate: new Date().toISOString(),
        videoLink: "",
        status: "completed",
      };

      const res = await axios.post(API_URL, newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCompletedEvents((prev) => [...prev, res.data]);
      setExpandedCompleted((prev) => ({ ...prev, [res.data._id]: true }));
    } catch (err) {
      console.error("Add completed error:", err);
      alert("Failed to add completed event");
    }
  };

  /* ===============================
          DELETE EVENT
  ================================*/
  const deleteEvent = async (id, completed = false) => {
    if (!window.confirm("Are you sure?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (completed) {
        setCompletedEvents((prev) => prev.filter((e) => e._id !== id));
      } else {
        setEvents((prev) => prev.filter((e) => e._id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  /* ===============================
        UPDATE EVENT FIELD
  ================================*/
  const handleChange = async (id, field, value, completed = false) => {
    if (!isAdmin) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/${id}`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (completed) {
        setCompletedEvents((prev) =>
          prev.map((e) => (e._id === id ? { ...e, [field]: value } : e)),
        );
      } else {
        setEvents((prev) =>
          prev.map((e) => (e._id === id ? { ...e, [field]: value } : e)),
        );
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  /* ===============================
        EXPAND / COLLAPSE
  ================================*/
  const toggleExpand = (id) => {
    setExpandedEvent((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpandCompleted = (id) => {
    setExpandedCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /* ===============================
          COUNTDOWN
  ================================*/
  const getTimeLeft = (deadline) => {
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return "Registration Closed";

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    return `${d}d ${h}h ${m}m ${s}s`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setEvents((p) => [...p]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* ===============================
            LOADING
  ================================*/
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading events...
      </div>
    );
  }

  /* ===============================
            UI
  ================================*/
  return (
    <div className="min-h-screen bg-[#fff7ec] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-[#FFAC1C] mb-10 text-center">
          Events
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* UPCOMING EVENTS */}
          <div>
            <h3 className="text-2xl font-bold text-[#FFAC1C] mb-4 text-center">
              Upcoming Events
            </h3>

            {isAdmin && (
              <div className="text-center mb-4">
                <button
                  onClick={addEvent}
                  className="bg-[#FFAC1C] text-white px-4 py-2 rounded border border-[#FFAC1C] hover:bg-white hover:text-black"
                >
                  Add Upcoming Event
                </button>
              </div>
            )}

            <div className="space-y-6">
              {events.map((event, idx) => (
                <div
                  key={event._id}
                  className="bg-white rounded-xl shadow-xl p-4 border-t-8 border-[#FFAC1C]"
                >
                  {isAdmin ? (
                    <>
                      <div
                        onClick={() => toggleExpand(event._id)}
                        className="flex justify-between cursor-pointer"
                      >
                        <span className="font-bold">Event {idx + 1}</span>
                        <span>
                          {expandedEvent[event._id] ? "Collapse" : "Expand"}
                        </span>
                      </div>

                      {expandedEvent[event._id] && (
                        <div className="mt-4 space-y-3">
                          <input
                            value={event.title}
                            onChange={(e) =>
                              handleChange(event._id, "title", e.target.value)
                            }
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Title"
                          />

                          <textarea
                            value={event.description}
                            onChange={(e) =>
                              handleChange(
                                event._id,
                                "description",
                                e.target.value,
                              )
                            }
                            rows={3}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Description"
                          />

                          <input
                            type="datetime-local"
                            value={event.deadline?.slice(0, 16)}
                            onChange={(e) =>
                              handleChange(
                                event._id,
                                "deadline",
                                e.target.value,
                              )
                            }
                            className="w-full border px-3 py-2 rounded"
                          />

                          <input
                            value={event.registrationLink}
                            onChange={(e) =>
                              handleChange(
                                event._id,
                                "registrationLink",
                                e.target.value,
                              )
                            }
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Link"
                          />

                          <button
                            onClick={() => deleteEvent(event._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <h4 className="font-semibold text-[#FFAC1C]">
                        {event.title}
                      </h4>
                      <p>{event.description}</p>
                      <p>Time Left: {getTimeLeft(event.deadline)}</p>

                      {/* REGISTER BUTTON FOR MEMBERS */}
                      {event.registrationLink &&
                        getTimeLeft(event.deadline) !==
                          "Registration Closed" && (
                          <div className="mt-2">
                            <a
                              href={event.registrationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-[#FFAC1C] text-white px-4 py-2 rounded hover:bg-white hover:text-black! border transition"
                            >
                              Register
                            </a>
                          </div>
                        )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* COMPLETED / PREVIOUS EVENTS */}
          <div>
            <h3 className="text-2xl font-bold text-[#FFAC1C] mb-4 text-center">
              Previous Events
            </h3>

            {isAdmin && (
              <div className="text-center mb-4">
                <button
                  onClick={addCompleted}
                  className="bg-[#FFAC1C] text-white px-4 py-2 rounded border border-[#FFAC1C] hover:bg-white hover:text-black"
                >
                  Add Previous Event
                </button>
              </div>
            )}

            <div className="space-y-6">
              {completedEvents.map((event, idx) => (
                <div
                  key={event._id}
                  className="bg-white rounded-xl shadow-xl p-4 border-t-8 border-[#FFAC1C]"
                >
                  {isAdmin ? (
                    <>
                      <div
                        onClick={() => toggleExpandCompleted(event._id)}
                        className="flex justify-between cursor-pointer"
                      >
                        <span>Completed {idx + 1}</span>
                        <span>
                          {expandedCompleted[event._id] ? "Collapse" : "Expand"}
                        </span>
                      </div>

                      {expandedCompleted[event._id] && (
                        <div className="mt-4 space-y-3">
                          <input
                            value={event.title}
                            onChange={(e) =>
                              handleChange(
                                event._id,
                                "title",
                                e.target.value,
                                true,
                              )
                            }
                            className="w-full border px-3 py-2 rounded"
                          />

                          <textarea
                            value={event.description}
                            onChange={(e) =>
                              handleChange(
                                event._id,
                                "description",
                                e.target.value,
                                true,
                              )
                            }
                            rows={3}
                            className="w-full border px-3 py-2 rounded"
                          />

                          <input
                            type="datetime-local"
                            value={event.completedDate?.slice(0, 16)}
                            onChange={(e) =>
                              handleChange(
                                event._id,
                                "completedDate",
                                e.target.value,
                                true,
                              )
                            }
                            className="w-full border px-3 py-2 rounded"
                          />

                          <input
                            value={event.videoLink}
                            onChange={(e) =>
                              handleChange(
                                event._id,
                                "videoLink",
                                e.target.value,
                                true,
                              )
                            }
                            className="w-full border px-3 py-2 rounded"
                          />

                          <button
                            onClick={() => deleteEvent(event._id, true)}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <h4 className="font-semibold text-[#FFAC1C]">
                        {event.title}
                      </h4>
                      <p>{event.description}</p>

                      {/* VIEW EVENT BUTTON FOR MEMBERS */}
                      {event.videoLink && (
                        <div className="mt-2">
                          <a
                            href={event.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-[#FFAC1C] text-white px-4 py-2 rounded hover:bg-white hover:text-black! border transition"
                          >
                            View Event
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
