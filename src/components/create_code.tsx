import { useState } from "react";

import React from "react";
import cryptoRandomString from "crypto-random-string";
import { createClient } from "~/utils/supabase/component";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { LoadingSpinner } from "./loading-spinner";

export const CreateAccessCode = () => {
  const supabase = createClient();
  const [currentCode, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const genCode = async () => {
    setLoading(true);
    const code = cryptoRandomString({ length: 6, type: "alphanumeric" });
    const ret = await supabase.from("codes").insert({ value: code });
    setLoading(false);
    if (!ret.error) {
      setCode(code);
      setError("");
    } else {
      setError(ret.error.message);
      setCode("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Code/Pseudonym</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={(e) => {
            e.preventDefault();
            void genCode();
          }}
        >
          Generate Code
        </Button>
        {loading && <LoadingSpinner />}
        {!loading && currentCode && <Label>{currentCode}</Label>}
        {!loading && error && <Label className="text-red-600">{error}</Label>}
      </CardContent>
    </Card>
  );
};
