import React from "react";
import cryptoRandomString from "crypto-random-string";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { LoadingSpinner } from "./loading-spinner";
import { api } from "~/utils/api";

export const CreateAccessCode = () => {
  const { data, isPending, mutate } = api.actions.createCode.useMutation();

  const genCode = async () => {
    const code = cryptoRandomString({ length: 6, type: "alphanumeric" });
    mutate(code);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Code/Pseudonym</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex-row gap-6">
          <Button
            onClick={(e) => {
              e.preventDefault();
              void genCode();
            }}
          >
            Generate Code
          </Button>
          {isPending && <LoadingSpinner />}
          {!isPending && typeof data === "string" && <Label>{data}</Label>}
          {!isPending && data && typeof data !== "string" && (
            <div className="flex flex-col gap-2">
              <Label className="text-red-600">{data.code}</Label>
              <Label className="text-red-600">{data.message}</Label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
