"use client"

import { useSupabaseClient } from '@supabase/auth-helpers-react'
import type {NextPage } from 'next'
import { CreateAccessCode } from '~/components/create_code'
import { PseudLookup } from '~/components/pseud_lookup'

const HomePage: NextPage = () => {
  const supabaseClient = useSupabaseClient();

  return (
    <div className='m-4 flex flex-col justify-start gap-2'>
      <div><button onClick={() => supabaseClient.auth.signOut()} style={{
            backgroundColor: "var(--accent)",
            border: "none",
            padding: "6px 10px",
            fontSize: "large",
            color: "white",
            cursor: "pointer",
            borderRadius: "6px",
          }}>Sign out</button></div>
      <CreateAccessCode />
      <PseudLookup />
    </div>
  )
} 

export default HomePage
