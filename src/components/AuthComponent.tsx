
import React, { useState } from "react";
import { supabase } from "../supabase";


export const AuthComponent = () => {
  const [errors, setErrors] = useState({ email: "", password: "" });

  const submit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")
    const password = formData.get("password")
    try {
      await supabase.auth.signInWithPassword({
        email: email!.toString(),
        password: password!.toString(),
      });
    } catch (e) {
      console.error(e)
      setErrors((err) => ({ ...err, email: e?.toString() ?? "" }))
    }
  }
  return <div style={{ display: "flex", alignItems: "stretch", justifyContent: "center" }}><form onSubmit={submit} style={{
    boxShadow: "1px 1px 3px #ccc",
    borderRadius: "8px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: "35rem",
    gap: "1rem",
  }}>
    <div>
      <h4>Sign In</h4>
    </div>
    <label style={{
      display: "flex",
      flexDirection: "column"
    }}>
      Email:
      <input type="email" name="email" placeholder="Enter Email" required />
    </label>
    {errors.email && <p>{errors.email}</p>}
    <label style={{
      display: "flex",
      flexDirection: "column"
    }}>
      Password:
      <input
        type="password"
        name="password"
        placeholder="Enter Password"
        required
      />
    </label>
    {errors.password && <p>{errors.password}</p>}
    <button style={{
      backgroundColor: "var(--accent)",
      border: "none",
      padding: "6px 10px",
      fontSize: "large",
      color: "white",
      cursor: "pointer",
      borderRadius: "6px",
    }} type="submit" value={"Submit"} >Sign In</button>
  </form></div>
}
