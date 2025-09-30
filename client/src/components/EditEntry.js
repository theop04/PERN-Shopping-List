import React, { useState } from "react";

const EditEntry = ({ entry }) => {
  const [entry_name, setEntryName] = useState(entry.entry_name);
  const [quantity, setQuantity] = useState(entry.quantity);

  //edit entry with all backend fields

  const updateEntry = async (e) => {
    e.preventDefault();
    try {
      const body = {
        entry_name,
        quantity: Number(quantity),
        checked: entry.checked || false,
        priority_flag: entry.priority_flag || false,
      };
      const response = await fetch(
        `http://localhost:5000/entries/${entry.entry_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-warning"
        data-toggle="modal"
        data-target={`#id${entry.entry_id}`}
      >
        Edit
      </button>

      <div
        className="modal"
        id={`id${entry.entry_id}`}
        onClick={(e) => {
          if (e.target.classList.contains("modal")) {
            setEntryName(entry.entry_name);
            setQuantity(entry.quantity);
          }
        }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Item</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => {
                  setEntryName(entry.entry_name);
                  setQuantity(entry.quantity);
                }}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                value={entry_name}
                onChange={(e) => setEntryName(e.target.value)}
              />
              <input
                type="number"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                data-dismiss="modal"
                onClick={(e) => updateEntry(e)}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditEntry;
