import { useState } from "react";
import { supabase } from "../utils/supabaseBrowser";
import React from "react";
import cryptoRandomString from "crypto-random-string";

export const CreateAccessCode = () => {
  const [currentCode, setCode] = useState("");
  const [error, setError] = useState("");

  const genCode: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    const code = cryptoRandomString({ length: 6, type: "alphanumeric" });
    const ret = await supabase.from("codes").insert({ value: code });
    if (!ret.error) {
      setCode(code);
      setError("");
    } else {
      setError(ret.error.message);
      setCode("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "start",
        gap: "1rem",
        padding: "20px",
        boxShadow: "1px 1px 3px #ccc",
        backgroundColor: "#e5e9f0",
        borderRadius: "8px",
        marginBottom: "2rem",
      }}
    >
      <h5>Access Code/Pseudonym</h5>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "start",
          gap: "1rem",
        }}
      >
        <button
          onClick={(e) => genCode(e)}
          style={{
            backgroundColor: "var(--accent)",
            border: "none",
            padding: "6px 10px",
            fontSize: "large",
            color: "white",
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          Generate Code
        </button>
        {currentCode && <h4>{currentCode}</h4>}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};
