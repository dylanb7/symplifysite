import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import {  minimal, supabase, type I18nVariables } from "@supabase/auth-ui-shared";
import { type NextPage } from "next";

const UpdatePassword: NextPage = () => {
    const supabaseClient = useSupabaseClient()
 
      return (
        <main className="w-full h-full flex flex-col items-center justify-center mt-20">
          
          <Auth
            showLinks={false}
            providers={[]}
            appearance={{theme: { default: minimal }}}
            supabaseClient={supabaseClient}
            
            localization={{variables: locale}}
            view={'update_password'}
          />
         
        </main>
      )
    
  
   
  }
  const locale: I18nVariables = {
    sign_up: {
      email_label: "E-Mail Adresse",
      password_label: "Passwort erstellen",
      email_input_placeholder: "Ihre E-Mail Adresse",
      password_input_placeholder: "Ihr Passwort",
      button_label: "Registrieren",
      loading_button_label: "Registrieren ...",
      social_provider_text: "Anmelden mit {{provider}}",
      link_text: "Haben Sie noch kein Konto? Registrieren",
    },
    sign_in: {
      email_label: "E-Mail Adresse",
      password_label: "Passwort erstellen",
      email_input_placeholder: "Ihre E-Mail Adresse",
      password_input_placeholder: "Ihr Passwort",
      button_label: "Anmelden",
      loading_button_label: "Anmelden ...",
      social_provider_text: "Anmelden mit {{provider}}",
      link_text: "Haben Sie bereits ein Konto? Anmelden",
    },
    magic_link: {
      email_input_label: "E-Mail Adresse",
      email_input_placeholder: "Ihre E-Mail Adresse",
      button_label: "Magischen Link senden",
      loading_button_label: "Magischen Link senden ...",
      link_text: "Einen magischen Link per E-Mail versenden",
    },
    forgotten_password: {
      email_label: "E-Mail Adresse",
      password_label: "Ihr Passwort",
      email_input_placeholder: "Ihre E-Mail Adresse",
      button_label: "Anweisungen zum Zurücksetzen des Passworts senden",
      loading_button_label: "Anweisungen zum Zurücksetzen senden ...",
      link_text: "Passwort vergessen?",
    },
    update_password: {
      password_label: "Neues Passwort",
      password_input_placeholder: "Ihr neues Passwort",
      button_label: "Passwort aktualisieren",
      loading_button_label: "Passwort aktualisieren ...",
    },
  };
  
  export default UpdatePassword;