import React, { useState, useEffect } from "react";
import api from "../utils/api";

const MakeFormTab = () => {
  const [formFields, setFormFields] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [isCompulsory, setIsCompulsory] = useState(false);
  const [deadline, setDeadline] = useState(3);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const addField = () => {
    setFormFields([
      ...formFields,
      {
        type: "text",
        label: "",
        required: false,
        options: [],
        signatureData: null,
      },
    ]);
  };

  const updateField = (index, field) => {
    const updatedFields = [...formFields];
    updatedFields[index] = field;
    setFormFields(updatedFields);
  };

  const removeField = (index) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
  };

  const addOption = (fieldIndex) => {
    const updatedFields = [...formFields];
    updatedFields[fieldIndex].options.push("");
    setFormFields(updatedFields);
  };

  const updateOption = (fieldIndex, optionIndex, value) => {
    const updatedFields = [...formFields];
    updatedFields[fieldIndex].options[optionIndex] = value;
    setFormFields(updatedFields);
  };

  const saveForm = async () => {
    try {
      const response = await api.post("/api/forms/save", {
        title: formTitle,
        fields: formFields,
        isCompulsory,
        deadline,
        category,
      });
      alert("Form saved successfully");
      // Reset form after saving
      setFormFields([]);
      setFormTitle("");
      setIsCompulsory(false);
      setDeadline(3);
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Error saving form. Please try again.");
    }
  };

  return (
    <div
      style={{
        margin: "2rem auto",
        padding: "2rem",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "800px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease-in-out",
        transform: "scale(1)",
        ":hover": {
          transform: "scale(1.05)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <h2
        style={{
          marginBottom: "1.5rem",
          color: "#333",
          fontSize: "2em",
          textAlign: "center",
          transition: "color 0.3s ease-in-out",
          ":hover": {
            color: "#4CAF50",
          },
        }}
      >
        Create New Form
      </h2>
      <div
        className="form-group"
        style={{
          marginBottom: "1.5rem",
          width: "100%",
        }}
      >
        <label
          htmlFor="formTitle"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Form Title:
        </label>
        <input
          type="text"
          id="formTitle"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          placeholder="Enter form title"
          required
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #e0e0e0",
            borderRadius: "6px",
            fontSize: "1rem",
            transition:
              "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            ":focus": {
              borderColor: "#4CAF50",
              boxShadow: "0 0 5px rgba(76, 175, 80, 0.5)",
            },
          }}
        />
      </div>

      <h3
        style={{
          marginBottom: "1rem",
          color: "#333",
          fontSize: "1.5em",
          textAlign: "center",
        }}
      >
        Form Fields
      </h3>
      {formFields.map((field, index) => (
        <div
          key={index}
          className="form-field"
          style={{
            marginBottom: "1.5rem",
            width: "100%",
            padding: "1rem",
            border: "1px solid #e0e0e0",
            borderRadius: "6px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
            transition:
              "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            ":hover": {
              transform: "scale(1.02)",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <input
            type="text"
            value={field.label}
            onChange={(e) =>
              updateField(index, { ...field, label: e.target.value })
            }
            placeholder="Field Label"
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              marginBottom: "0.5rem",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              fontSize: "1rem",
              transition:
                "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              ":focus": {
                borderColor: "#4CAF50",
                boxShadow: "0 0 5px rgba(76, 175, 80, 0.5)",
              },
            }}
          />
          <select
            value={field.type}
            onChange={(e) =>
              updateField(index, { ...field, type: e.target.value })
            }
            style={{
              width: "100%",
              padding: "0.75rem",
              marginBottom: "0.5rem",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              fontSize: "1rem",
              transition:
                "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              ":focus": {
                borderColor: "#4CAF50",
                boxShadow: "0 0 5px rgba(76, 175, 80, 0.5)",
              },
            }}
          >
            <option value="text">Text</option>
            <option value="file">File</option>
            <option value="dropdown">Dropdown</option>
            <option value="digitalSignature">Digital Signature</option>
          </select>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.5rem",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) =>
                updateField(index, { ...field, required: e.target.checked })
              }
              style={{
                marginRight: "0.5rem",
              }}
            />
            Required
          </label>
          <button
            type="button"
            onClick={() => removeField(index)}
            style={{
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9em",
              transition: "background-color 0.3s ease, transform 0.2s ease",
              ":hover": {
                backgroundColor: "#da190b",
                transform: "translateY(-2px)",
              },
            }}
          >
            Remove Field
          </button>

          {field.type === "dropdown" && (
            <div
              className="dropdown-options"
              style={{
                marginTop: "1rem",
              }}
            >
              <h4
                style={{
                  marginBottom: "0.5rem",
                  color: "#333",
                  fontSize: "1.2em",
                }}
              >
                Options:
              </h4>
              {field.options.map((option, optionIndex) => (
                <input
                  key={optionIndex}
                  type="text"
                  value={option}
                  onChange={(e) =>
                    updateOption(index, optionIndex, e.target.value)
                  }
                  placeholder={`Option ${optionIndex + 1}`}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    marginBottom: "0.5rem",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    transition:
                      "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    ":focus": {
                      borderColor: "#4CAF50",
                      boxShadow: "0 0 5px rgba(76, 175, 80, 0.5)",
                    },
                  }}
                />
              ))}
              <button
                type="button"
                onClick={() => addOption(index)}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9em",
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                  ":hover": {
                    backgroundColor: "#45a049",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Add Option
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addField}
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          padding: "0.75rem 1.5rem",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "1rem",
          transition: "background-color 0.3s ease, transform 0.2s ease",
          marginBottom: "1.5rem",
          ":hover": {
            backgroundColor: "#45a049",
            transform: "translateY(-2px)",
          },
        }}
      >
        Add Field
      </button>

      <div
        className="form-group"
        style={{
          marginBottom: "1.5rem",
          width: "100%",
        }}
      >
        <label
          htmlFor="isCompulsory"
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          <input
            type="checkbox"
            id="isCompulsory"
            checked={isCompulsory}
            onChange={(e) => setIsCompulsory(e.target.checked)}
            style={{
              marginRight: "0.5rem",
            }}
          />
          Is Compulsory
        </label>
      </div>

      <div
        className="form-group"
        style={{
          marginBottom: "1.5rem",
          width: "100%",
        }}
      >
        <label
          htmlFor="deadline"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Deadline (in days):
        </label>
        <input
          type="number"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(parseInt(e.target.value))}
          min="1"
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #e0e0e0",
            borderRadius: "6px",
            fontSize: "1rem",
            transition:
              "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            ":focus": {
              borderColor: "#4CAF50",
              boxShadow: "0 0 5px rgba(76, 175, 80, 0.5)",
            },
          }}
        />
      </div>

      <div
        className="form-group"
        style={{
          marginBottom: "1.5rem",
          width: "100%",
        }}
      >
        <label
          htmlFor="category"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Category:
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #e0e0e0",
            borderRadius: "6px",
            fontSize: "1rem",
            transition:
              "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            ":focus": {
              borderColor: "#4CAF50",
              boxShadow: "0 0 5px rgba(76, 175, 80, 0.5)",
            },
          }}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={saveForm}
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "0.75rem 1.5rem",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "1rem",
          transition: "background-color 0.3s ease, transform 0.2s ease",
          ":hover": {
            backgroundColor: "#45a049",
            transform: "translateY(-2px)",
          },
        }}
      >
        Save Form
      </button>
    </div>
  );
};

export default MakeFormTab;
