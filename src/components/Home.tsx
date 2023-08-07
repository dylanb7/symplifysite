import { useEffect, useState } from "react"
import { supabase } from "../supabase"
import type { Session } from "@supabase/supabase-js"
import React from "react"
import { AuthComponent } from "./AuthComponent"
import { CreateAccessCode } from "./CreateAccessCode"
import { PseudLookup } from "./PseudLookup"

export const Home = () => {

    const [sesh, setSesh] = useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.onAuthStateChange((_, sesh) => {
            setSesh(sesh);
        })
    });

    return <>
        <h2 style={{ textAlign: "center" }}>Symplify Portal</h2>
        <hr />
        {!sesh && <AuthComponent />}
        {sesh && <CreateAccessCode />}
        {sesh && <PseudLookup />}
    </>

}