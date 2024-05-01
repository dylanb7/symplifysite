"use client";

import { Label } from "./ui/label";
import dayjs from "dayjs";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { CopyButton } from "./copy-button";
import { Button } from "./ui/button";

type Unit = "Metric" | "Imperial";

export const Recipe: React.FC = () => {
  const [unit, setUnit] = useState<Unit>("Imperial");

  const isImperial = unit == "Imperial";

  const jamInstruction = `${isImperial ? "2 Tablespoons" : "30 ml"} Smuckers Seedless Raspberry Jam`;

  const jamAlt = `or any other flavor w/ 50 calories per ${isImperial ? "Tablespoon" : "15 ml"}`;

  const proteinInstuction = `${isImperial ? "1 1/2 Teaspoon" : "7.5 ml"} soy protein powder`;

  const proteinAlt = "Alt. Whey protein(10 calories)";

  const ingredients: string[] = [
    "3 Large egg whites",
    `${isImperial ? "1/2 Teaspoon" : "2.5 ml"} Cream of tartar`,
    `${isImperial ? "1 Tablespoon" : "15 ml"} Sugar`,
    `${jamInstruction} ${jamAlt}`,
    `${isImperial ? "2 Tablespoons" : "30 ml"} King Arthur Gluten-Free ‘Measure for measure’ Flour`,
    `${proteinInstuction} ${proteinAlt}`,
    `${isImperial ? "1 Teaspoon" : "5 ml"} McCormick blue food coloring`,
  ];

  const instructions: string[] = [
    `Pre-heat oven to ${isImperial ? "350° F" : "177° C"}`,
    "Use electric beaters to beat egg whites with cream of tartar and sugar for 1 minute or until soft peaks form",
    `Add ${isImperial ? "2 Tablespoons" : "30 ml"} jam and continue to beat for 30 seconds`,
    `Add flour in two batches, ${isImperial ? "1 Tablepoon" : "15 ml"} at a time, and beat for a full minute after each addition`,
    "Add protein powder and beat until incorporated",
    "Line muffin tins with parchment paper and fill two of these with batter",
    `Cook 30 minutes or until internal temperature reaches ${isImperial ? "206° F" : "97° C"}`,
  ];

  return (
    <div className="mx-0 flex flex-col justify-start md:mr-auto">
      <div className="flex  flex-row items-baseline justify-between">
        <div className="flex flex-col items-start md:flex-row md:items-center">
          <Label
            title="Muffin Recipe"
            className="font-heading mt-12 scroll-m-20 text-nowrap pb-2 text-2xl tracking-tight first:mt-0"
          >
            Muffin Recipe
            <CopyButton
              value={`Ingredients\n${ingredients.join("\n")}\n\nInstructions\n${instructions.join("\n")}`}
              copyMessage={"Copied recipe to clipboard"}
            />
          </Label>
          <span className="text-md text-nowrap text-left text-muted-foreground">
            &nbsp;· 2 per serving
          </span>{" "}
        </div>
        <Label className="text-right">{`· ${dayjs("2020-07-09").format("YYYY")} Dallman Moshiree`}</Label>
      </div>
      <div className="mt-6  flex  max-w-prose flex-row gap-5">
        <div className="text-md flex flex-col gap-1 font-semibold">
          <span>Total Time:</span>
          <span>Prep Time:</span>
          <span>Cook Time:</span>
        </div>
        <div className="flex flex-col gap-1 text-muted-foreground ">
          <span>40 Minutes</span>
          <span>10 Minutes</span>
          <span>30 Minutes</span>
        </div>
      </div>

      <Separator className="my-6" />
      <div className="flex flex-row items-center justify-between">
        <Label className="text-xl">
          Ingredients{" "}
          <CopyButton
            value={ingredients.join("\n")}
            copyMessage={"Copied ingredients to clipboard"}
          />
        </Label>
        <Button
          variant={"default"}
          size={"sm"}
          onClick={() => {
            setUnit((currentUnit) => {
              if (currentUnit === "Imperial") return "Metric";
              return "Imperial";
            });
          }}
        >
          {unit}
        </Button>
      </div>
      <ul
        style={{}}
        className="max-w-prose  list-disc  space-y-4 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 [&>li]:mt-2"
      >
        <li>{ingredients[0]}</li>
        <li>{ingredients[1]}</li>
        <li>{ingredients[2]}</li>
        <li>
          {jamInstruction}
          <br className="my-1" />
          <Label className="text-xs text-muted-foreground">{jamAlt}</Label>
        </li>
        <li>{ingredients[4]}</li>
        <li>
          {proteinInstuction}
          <br className="my-1" />
          <Label className="text-xs text-muted-foreground">{proteinAlt}</Label>
        </li>
        <li>{ingredients[6]}</li>
      </ul>
      <Separator className="my-6" />
      <Label className="text-xl">
        Instuctions{" "}
        <CopyButton
          value={instructions.join("\n")}
          copyMessage={"Copied instructions to clipboard"}
        />
      </Label>
      <ul className="max-w-prose  list-decimal  space-y-4 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 [&>li]:mt-2">
        {instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ul>
    </div>
  );
};
