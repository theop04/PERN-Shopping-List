import React, { useEffect, useState } from "react";
import EditEntry from "./EditEntry";

const ListEntries = () => {
  const [entries, setEntries] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  // UI theme state (persisted in localStorage)
  const [theme, setTheme] = useState({
    font: "Arial",
    background: "#ffffff",
    textColor: "#000000",
    headerTitle: "My Shopping List",
  });

  // Fetch all entries from the backend API
  const getEntries = async () => {
    try {
      const response = await fetch("http://localhost:5000/entries/user/1");
      const jsonData = await response.json();

      // Merge persisted checkbox states with fetched entries
      setEntries(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Delete entry from backend and remove from UI
  const deleteEntry = async (id) => {
    try {
      await fetch(`http://localhost:5000/entries/${id}`, {
        method: "DELETE",
      });
      setEntries(entries.filter((entry) => entry.entry_id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  // Toggle the 'checked' state for an entry and persist it - updates backend and local state
  const toggleChecked = async (id) => {
    try {
      const entry = entries.find((e) => e.entry_id === id);
      const newCheckedState = !entry.checked;

      // Update backend using PATCH endpoint
      const response = await fetch(`http://localhost:5000/entries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checked: newCheckedState }),
      });

      setEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.entry_id === id ? { ...entry, checked: newCheckedState } : entry
        )
      );
    } catch (err) {
      console.error("Error toggling checked state:", err.message);
    }
  };

  // Toggle priority flag - NEW FEATURE using your PATCH endpoint
  const togglePriority = async (id) => {
    try {
      const entry = entries.find((e) => e.entry_id === id);
      const newPriorityState = !entry.priority_flag;

      const response = await fetch(`http://localhost:5000/entries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority_flag: newPriorityState }),
      });

      if (response.ok) {
        setEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry.entry_id === id
              ? { ...entry, priority_flag: newPriorityState }
              : entry
          )
        );
      }
    } catch (err) {
      console.error("Error toggling priority:", err.message);
    }
  };

  // Load saved theme settings from localStorage
  const loadThemeSettings = () => {
    const saved = localStorage.getItem("themeSettings");
    return saved ? JSON.parse(saved) : null;
  };

  // Save theme settings to localStorage
  const saveThemeSettings = (settings) => {
    localStorage.setItem("themeSettings", JSON.stringify(settings));
  };

  // Sort entries: priority items first, checked items last
  const sortedEntries = [...entries].sort((a, b) => {
    // First, separate checked vs unchecked
    if (a.checked && !b.checked) return 1; // checked items go to bottom
    if (!a.checked && b.checked) return -1; // unchecked items stay up

    // Within the same checked status, priority items first
    if (a.priority_flag && !b.priority_flag) return -1;
    if (!a.priority_flag && b.priority_flag) return 1;
    return 0;
  });

  // Initial load: entries + theme from localStorage
  useEffect(() => {
    getEntries();

    const savedTheme = loadThemeSettings();
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <div
      style={{
        fontFamily: theme.font,
        backgroundColor: theme.background,
        color: theme.textColor,
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      {/* Top-right settings toggle button */}
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <button
          className="btn btn-secondary"
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️
        </button>
      </div>

      {/* Settings panel for font and theme */}
      {showSettings && (
        <div
          style={{
            position: "absolute",
            top: 50,
            right: 10,
            background: "#f0f0f0",
            padding: "1rem",
            borderRadius: "10px",
            zIndex: 1000,
          }}
        >
          <label>
            Font:
            <select
              value={theme.font}
              onChange={(e) => {
                const updated = { ...theme, font: e.target.value };
                setTheme(updated);
                saveThemeSettings(updated);
              }}
            >
              <option>Arial</option>
              <option>Courier New</option>
              <option>Georgia</option>
              <option>Roboto</option>
              <option>Comic Sans MS</option>
              <option>Lucida Handwriting</option>
              <option>Segoe Script</option>
            </select>
          </label>
          <br />
          <label>
            Background:
            <input
              type="color"
              value={theme.background}
              onChange={(e) => {
                const updated = { ...theme, background: e.target.value };
                setTheme(updated);
                saveThemeSettings(updated);
              }}
            />
          </label>
          <br />
          <label>
            Text Color:
            <input
              type="color"
              value={theme.textColor}
              onChange={(e) => {
                const updated = { ...theme, textColor: e.target.value };
                setTheme(updated);
                saveThemeSettings(updated);
              }}
            />
          </label>
          <br />
          <label>
            Header Title:
            <input
              type="text"
              value={theme.headerTitle || "My Shopping List"}
              onChange={(e) => {
                const updated = { ...theme, headerTitle: e.target.value };
                setTheme(updated);
                saveThemeSettings(updated);
              }}
              placeholder="My Shopping List"
              style={{ width: "150px", marginLeft: "5px" }}
            />
          </label>
        </div>
      )}

      {/* Entries table */}
      <table
        className="table mt-5 text-center"
        style={{ color: theme.textColor }}
      >
        <thead>
          <tr>
            <th>Priority</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: "2rem", fontStyle: "italic" }}>
                No items in your shopping list
              </td>
            </tr>
          ) : (
            sortedEntries.map((entry) => (
              <tr key={entry.entry_id}>
                {/* Priority column with clickable flag */}
                <td>
                  <button
                    onClick={() => togglePriority(entry.entry_id)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                    }}
                    title={
                      entry.priority_flag
                        ? "Remove priority"
                        : "Mark as priority"
                    }
                  >
                    {entry.priority_flag ? "🚩" : "⚐"}
                  </button>
                </td>

                {/* Item name with checkbox */}
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={entry.checked || false}
                      onChange={() => toggleChecked(entry.entry_id)}
                      style={{ marginRight: "10px" }}
                    />
                    <span
                      style={{
                        textDecoration: entry.checked ? "line-through" : "none",
                        color: theme.textColor,
                      }}
                    >
                      {entry.entry_name}
                    </span>
                  </div>
                </td>
                <td>{entry.quantity}</td>
                <td>
                  <EditEntry entry={entry} />
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this item?"
                        )
                      ) {
                        deleteEntry(entry.entry_id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListEntries;
