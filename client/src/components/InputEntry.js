import React, { useState, useEffect } from "react";

const InputEntry = () => {
  const [entry_name, setEntryName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [priorityFlag, setPriorityFlag] = useState(false);
  const [font, setFont] = useState("Arial");
  const [headerTitle, setHeaderTitle] = useState("My Shopping List");

  // Load font from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("themeSettings");
    if (savedTheme) {
      const theme = JSON.parse(savedTheme);
      setFont(theme.font || "Arial");
      setHeaderTitle(theme.headerTitle || "My Shopping List");
    }
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = {
        entry_name,
        quantity,
        priority_flag: priorityFlag,
        user_id: 1,
      };

      const response = await fetch("http://localhost:5000/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div style={{ fontFamily: font }}>
      <h1 className="text-center mt-5">{headerTitle}</h1>
      <form
        className="d-flex align-items-center gap-2 mt-5"
        onSubmit={onSubmitForm}
      >
        {/* Priority Checkbox */}
        <div
          className="d-flex align-items-center"
          style={{ marginRight: "15px" }}
        >
          <input
            type="checkbox"
            checked={priorityFlag}
            onChange={(e) => setPriorityFlag(e.target.checked)}
            id="priorityCheck"
            style={{
              marginRight: "10px",
              width: "18px",
              height: "18px",
              cursor: "pointer",
            }}
          />
          <label
            htmlFor="priorityCheck"
            style={{ cursor: "pointer", fontSize: "1rem" }}
          >
            Priority
          </label>
        </div>

        {/* Entry Name */}
        <input
          type="text"
          className="form-control"
          value={entry_name}
          onChange={(e) => setEntryName(e.target.value)}
          placeholder="Item name"
          required
        />

        {/* Quantity */}
        <input
          type="number"
          className="form-control"
          placeholder="Qty"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: "80px" }}
        />

        {/* Submit Button */}
        <button className="btn btn-success" type="submit">
          Add
        </button>
      </form>
    </div>
  );
};

export default InputEntry;
