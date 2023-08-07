import React, { useState } from "react"
import { supabase } from "../supabase"


export const PseudLookup = () => {

    const [error, setError] = useState("");

    const [pseud, setPsued] = useState("");

    const [loading, setLoading] = useState(false);

    const submit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const pseud = formData.get("pseudonym");
        const pseudResponses = await supabase.from("pseud_responses").select().eq("pseud", pseud);
        const testResponses = await supabase.from("blue_dye_resp").select().eq("pseud", pseud);
        setLoading(false);
    }

    return <div style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxShadow: "1px 1px 3px #ccc",
        backgroundColor: "#e5e9f0",
        borderRadius: "8px",
    }}>
        <hr />
        <form onSubmit={submit} style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "end",

        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",

            }}>
                <h5>Pseudonym Lookup:</h5>
                <input type="text" name="pseudonym" placeholder="Enter Pseudonym" required />
            </div>
            <button style={{
                backgroundColor: "var(--accent)",
                border: "none",
                padding: "6px 10px",
                fontSize: "large",
                color: "white",
                cursor: "pointer",
                borderRadius: "6px",
            }} type="submit" value={"Submit"} >Lookup</button>
        </form>
        {pseud && <p>Showing: <b>{pseud}</b></p>}
        {error && <p>{error}</p>}
    </ div >
}
