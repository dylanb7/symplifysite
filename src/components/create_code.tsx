import { useState } from "react";

import React from "react";
import cryptoRandomString from "crypto-random-string";
import { createClient } from "~/utils/supabase/component";

export const CreateAccessCode = () => {
  const supabase = createClient();
  const [currentCode, setCode] = useState("");
  const [error, setError] = useState("");

  const genCode = async () => {
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
          onClick={(e) => {
            e.preventDefault();
            void genCode();
          }}
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
