import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Auth  } from '@supabase/auth-ui-react'
import { minimal } from '@supabase/auth-ui-shared'
import type { NextPage } from 'next'

const LoginPage: NextPage = () => {
  const supabaseClient = useSupabaseClient()
  const user = useUser()

  if (!user) {
    return (
      <main className="w-full h-full flex flex-col items-center justify-center mt-20">
        <Auth
          showLinks={false}
          providers={[]}
          appearance={{theme: { default: minimal }}}
          supabaseClient={supabaseClient}
          view={'sign_in'}
        />
      </main>
    )
  }

  return (
    <>
      <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
      <p>user:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  )
}

export default LoginPage