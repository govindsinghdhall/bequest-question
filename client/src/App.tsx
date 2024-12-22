import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch(`${API_URL}/data`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const { data } = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again later.");
    }
  };

  const updateData = async () => {
    if (!data.trim()) {
      alert("Data cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/data`, {
        method: "POST",
        body: JSON.stringify({ data }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      await getData();
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update data. Please try again later.");
    }
  };

  const verifyData = async () => {
    try {
      const response = await fetch(`${API_URL}/data`);
      if (!response.ok) {
        alert("Data tampering detected! Please restore from backup.");
      } else {
        alert("Data integrity verified.");
      }
    } catch (error) {
      console.error("Error verifying data:", error);
      alert("Failed to verify data. Please try again later.");
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
    </div>
  );
}

export default App;
