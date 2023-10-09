import React, { useEffect } from "react";
import type { I18nVariables } from "@supabase/auth-ui-shared";
import { supabase } from "../supabase";
import { AuthError, User, UserAttributes } from "@supabase/supabase-js";
import { useParams } from "react-router-dom";

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

export const SupaReset = () => {
  const params = useParams();

  const [user, setUser] = React.useState<User | null | undefined>(null);
  const [userLoading, setUserLoading] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const [fieldError, setFieldError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const getUrlSesh = async () => {
    const access = params["access_token"];
    const refresh = params["refresh_token"];
    setFieldError((access ?? "") + (refresh ?? ""));
    if (!access || !refresh) {
      return new AuthError("No tokens");
    }

    const val = await supabase.auth.setSession({
      access_token: access,
      refresh_token: refresh,
    });

    setMessage(
      val.error?.message ??
        val.data.session?.access_token ??
        "" + access + refresh
    );
  };

  useEffect(() => {
    getUrlSesh();
  }, [params]);

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldError("");
    setMessage("");
    setLoading(true);
    const l: UserAttributes = {};
    supabase.auth.updateUser({});
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setFieldError(error.message);
    else setMessage(locale.update_password?.confirmation_text as string);
    setLoading(false);
  };

  return (
    <div
      key={"inner"}
      style={{
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handlePasswordReset}
        style={{
          boxShadow: "1px 1px 3px #ccc",
          borderRadius: "8px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "35rem",
          gap: "1rem",
        }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {locale.update_password?.password_label}
          <input
            id="password"
            name="password"
            type="password"
            autoFocus
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />
        </label>
        <button
          type="submit"
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
          {loading
            ? locale?.update_password?.loading_button_label
            : locale.update_password?.button_label}
        </button>
        {params && <h1>{params}</h1>}
        {message && <h2>{message}</h2>}
        {fieldError && <h2 style={{ color: "red" }}>{fieldError}</h2>}
      </form>
    </div>
  );
};
