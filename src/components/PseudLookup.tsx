import React, { useMemo, useRef, useState } from "react";
import { supabase } from "../utils/supabaseBrowser";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type ExpandedState,
  getExpandedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { useDownloadExcel } from "react-export-table-to-excel";

dayjs.extend(LocalizedFormat);

type noDetailResponse = stamp & {
  all_selected: string | null;
  detail_link: number | null;
  numeric_response: number | null;
  pseud: string;
  qid: string;
  response: string | null;
  selected: number | null;
  type: string;
};

type detailPartialResponse = stamp & {
  desc: string | null;
  id: number;
  pseud: string;
  type: string | null;
};

type flatDetail = detailPartialResponse & noDetailResponse;

type flatDetailChildren = flatDetail & {
  responses: flatDetailChildren[];
};

type detailResponse = detailPartialResponse & {
  responses: noDetailResponse[];
};

type detailPairing = {
  details: detailResponse[];
  non: noDetailResponse[];
};

type stamp = {
  stamp: number;
};

type testResponse = stamp & {
  blueBowelMovementsKey: number | null;
  firstBlueKey: number | null;
  lastBlueKey: number | null;
  mealDurationKey: number | null;
  normalBowelMovementsKey: number | null;
  pseud: string;
};

type pseudonymData = {
  pseud: string;
  nonDetail: noDetailResponse[] | string;
  details: detailResponse[] | string;
  tests: testResponse[] | string;
};

interface question {
  id: string;
  prompt: string;
  type: string;
  [propName: string]: any;
}

type numeric = question & {
  min?: number;
  max?: number;
};

type multi = question & {
  choices: string[];
};

type free = question;

type check = question;

type all = question & {
  choices: string[];
};

const bm = "Poo";
const schmerzmedikation = "Schmerzmedikation";
const pain = "Schmerz";
const nutrition = "Ernährung";
const mood = "Stimmung";

const b1: string = "b1";

const m1 = "m1";

const n1 = "n1";
const n2 = "n2";
const n3 = "n3";
const n4 = "n4";
const n5 = "n5";
const n6 = "n6";
const n7 = "n7";

const s1 = "s1";
const s2 = "s2";

const p1 = "p1";

const mood1 = "mood1";

const questionSet: Record<string, question> = {
  b1: {
    id: b1,
    prompt: bm,
    type: bm,
    min: 1,
    max: 7,
  },
  p1: {
    id: p1,
    prompt: "Schmerzeintrag ",
    type: pain,
  },
  mood1: {
    id: mood1,
    prompt: "Stimmungseintrag",
    type: mood,
    min: 1.0,
    max: 10.0,
  },
  n1: {
    id: n1,
    type: nutrition,
    prompt:
      "Wie viele Ballaststoffe haben Sie heute zu sich genommen? (Ballaststoffreich sind bspw. Gemüse, Hülsenfrüchte, Vollkornprodukte)",
    choices: [
      "Mehr als normalerweise",
      "Weniger als normalerweise",
      "Ungefähr genauso viel wie normalerweise",
    ],
  },
  n2: {
    id: n2,
    type: nutrition,
    prompt: "Wie viel haben Sie sich heute bewegt?",
    choices: [
      "Mehr als normalerweise",
      "Weniger als normalerweise",
      "Ungefähr genauso viel wie normalerweise",
    ],
  },
  n3: {
    id: n3,
    type: nutrition,
    prompt: "Wie viel Flüssigkeit haben Sie heute zu sich genommen?",
    choices: [
      "Mehr als normalerweise",
      "Weniger als normalerweise",
      "Ungefähr genauso viel wie normalerweise",
    ],
  },
  n4: {
    id: n4,
    type: nutrition,
    prompt: "Wie viel Kaffee/ Schwarz-/ Grüntee haben Sie heute getrunken?",
    choices: [
      "Mehr als normalerweise",
      "Weniger als normalerweise",
      "Ungefähr genauso viel wie normalerweise",
    ],
  },
  n5: {
    id: n5,
    type: nutrition,
    prompt: "Wie viel Alkohol haben Sie heute getrunken?",
    choices: [
      "Mehr als normalerweise",
      "Weniger als normalerweise",
      "Ungefähr genauso viel wie normalerweise",
    ],
  },
  n6: {
    id: n6,
    type: nutrition,
    prompt: "Wie viele Süßigkeiten bzw. Fastfood haben Sie heute gegessen?",
    choices: [
      "Mehr als normalerweise",
      "Weniger als normalerweise",
      "Ungefähr genauso viel wie normalerweise",
    ],
  },
  n7: {
    id: n7,
    type: nutrition,
    prompt:
      "Wie viele Tierische Produkte haben Sie heute zu sich genommen? (Milch, Eier, Fleisch...)",
    choices: [
      "Mehr als normalerweise",
      "Weniger als normalerweise",
      "Ungefähr genauso viel wie normalerweise",
    ],
  },
  s1: {
    id: s1,
    prompt:
      "Haben Sie heute Ihre Schmerzmedikation nach dem üblichen Schema eingenommen?",
    type: schmerzmedikation,
    choices: ["Ja", "Nein"],
  },
  s2: {
    id: s2,
    prompt:
      "Falls nein, schreiben Sie bitte kurz was anders heute war und warum:",
    type: schmerzmedikation,
  },
};

const dateFormat = (date: number | null, pretty: boolean) => {
  if (!date) return "";
  if (pretty) return dayjs(date).format("lll");
  return `${date}`;
};

const durationFormat = (duration: number) => {
  const portions: string[] = [];

  const msInHour = 1000 * 60 * 60;
  const hours = Math.trunc(duration / msInHour);
  if (hours > 0) {
    portions.push(hours + "h");
    duration = duration - hours * msInHour;
  }

  const msInMinute = 1000 * 60;
  const minutes = Math.trunc(duration / msInMinute);
  if (minutes > 0) {
    portions.push(minutes + "m");
    duration = duration - minutes * msInMinute;
  }

  const seconds = Math.trunc(duration / 1000);
  if (seconds > 0) {
    portions.push(seconds + "s");
  }

  return portions.join(" ");
};

const getDetails = (
  detailPart: detailPartialResponse[],
  allNon: noDetailResponse[]
): detailPairing => {
  const toPair: noDetailResponse[] = [];
  const non: noDetailResponse[] = [];

  for (const value of allNon) {
    if (value.detail_link) {
      toPair.push(value);
    } else {
      non.push(value);
    }
  }

  const details: detailResponse[] = [];

  for (const part of detailPart) {
    const children: noDetailResponse[] = [];
    for (const response of toPair) {
      if (response.detail_link === part.stamp) {
        children.push(response);
      }
    }
    details.push({ ...part, responses: children });
  }

  return {
    details,
    non,
  };
};

function parseRes<T>(res: PostgrestSingleResponse<T>): T | string {
  return res.error ? res.error.message : res.data;
}

export const PseudLookup: React.FC = () => {
  const [pseud, setPseud] = useState("");

  const [loading, setLoading] = useState(false);

  const [pseudData, setPseudData] = useState<pseudonymData | undefined>(
    undefined
  );

  const submit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setLoading(true);
    const pseudResponses = await supabase
      .from("pseud_responses")
      .select()
      .eq("pseud", pseud);
    const detailResponses = await supabase
      .from("detail")
      .select()
      .eq("pseud", pseud);
    const testResponses = await supabase
      .from("blue_dye_resp")
      .select()
      .eq("pseud", pseud);
    const non = parseRes<noDetailResponse[]>(pseudResponses);
    const grouper = parseRes<detailPartialResponse[]>(detailResponses);
    const tests = parseRes<testResponse[]>(testResponses);
    if (typeof non !== "string" && typeof grouper !== "string") {
      const { details, non: nonDetail } = getDetails(grouper, non);
      setPseudData({
        nonDetail,
        details,
        tests,
        pseud,
      });
    } else {
      setPseudData({
        nonDetail: non,
        details: "Could not construct details",
        tests: parseRes<testResponse[]>(testResponses),
        pseud,
      });
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          boxShadow: "1px 1px 3px #ccc",
          backgroundColor: "#e5e9f0",
          borderRadius: "8px",
        }}
      >
        <hr />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "end",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h5>Pseudonym Lookup:</h5>
            <input
              type="text"
              name="pseudonym"
              onChange={(e) => {
                setPseud(e.currentTarget.value);
              }}
              placeholder="Enter Pseudonym"
              required
            />
          </div>
          {!loading ? (
            <button
              style={{
                backgroundColor: "var(--accent)",
                border: "none",
                padding: "6px 10px",
                fontSize: "large",
                color: "white",
                cursor: "pointer",
                borderRadius: "6px",
              }}
              onClick={(e) => submit(e)}
            >
              Lookup
            </button>
          ) : (
            <h5>Loading...</h5>
          )}
        </div>
      </div>
      {pseudData && <EntryDisplay data={pseudData} />}
    </div>
  );
};

const Checkbox: React.FC<{
  label: string;
  value: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}> = ({ label, value, onChange }) => {
  return (
    <label>
      <input type="checkbox" checked={value} onChange={onChange} />
      {label}
    </label>
  );
};

const EntryDisplay: React.FC<{ data: pseudonymData }> = ({ data }) => {
  const { nonDetail, details, tests } = data;

  const [prettyDates, setPrettyDates] = useState(true);

  const [formatRes, setFormatRes] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",

        gap: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          boxShadow: "1px 1px 3px #ccc",
          backgroundColor: "#e5e9f0",
          borderRadius: "8px",
          gap: "1rem",
        }}
      >
        <Checkbox
          value={formatRes}
          onChange={(e) => {
            setFormatRes(!formatRes);
          }}
          label={"Format responses"}
        />
      </div>
      {typeof tests !== "string" ? (
        <TestsTable data={tests} prettyDates={prettyDates} pseud={data.pseud} />
      ) : (
        <p>{tests}</p>
      )}

      {typeof details !== "string" ? (
        <DetailResponsesTable
          data={details}
          prettyDates={prettyDates}
          formatRes={formatRes}
          pseud={data.pseud}
        />
      ) : (
        <p>{details}</p>
      )}
      {typeof nonDetail !== "string" ? (
        <ResponsesTable
          data={nonDetail}
          prettyDates={prettyDates}
          formatRes={formatRes}
          pseud={data.pseud}
        />
      ) : (
        <p>{nonDetail}</p>
      )}
    </div>
  );
};

const TestsTable: React.FC<{
  data: testResponse[];
  prettyDates: boolean;
  pseud: string;
}> = ({ data, prettyDates, pseud }) => {
  const ref = useRef(null);

  const columns = useMemo<ColumnDef<testResponse, any>[]>(
    () => [
      {
        header: "Start",
        accessorFn: (row) => dateFormat(row.stamp, prettyDates),
        footer: (props) => props.column.id,
      },
      {
        header: "Meal Time",
        accessorFn: (row) =>
          row.mealDurationKey ? durationFormat(row.mealDurationKey) : "",
        footer: (props) => props.column.id,
      },
      {
        header: "First blue",
        accessorFn: (row) => dateFormat(row.firstBlueKey, prettyDates),
        footer: (props) => props.column.id,
      },
      {
        header: "Last blue",
        accessorFn: (row) => dateFormat(row.lastBlueKey, prettyDates),
        footer: (props) => props.column.id,
      },
      {
        header: "Blue poos",
        accessorFn: (row) => row.blueBowelMovementsKey ?? "",
        footer: (props) => props.column.id,
      },
      {
        header: "Normal poos",
        accessorFn: (row) => row.normalBowelMovementsKey ?? "",
        footer: (props) => props.column.id,
      },
    ],
    [prettyDates]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { onDownload } = useDownloadExcel({
    currentTableRef: ref.current,
    filename: `${pseud}_tests`,
    sheet: "tests",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxShadow: "1px 1px 3px #ccc",
        backgroundColor: "#e5e9f0",
        borderRadius: "8px",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <h5>Tests</h5>

        <button
          style={{
            backgroundColor: "var(--accent)",
            border: "none",
            padding: "6px 10px",
            fontSize: "large",
            color: "white",
            cursor: "pointer",
            borderRadius: "6px",
          }}
          onClick={onDownload}
        >
          Export
        </button>
      </div>
      <table ref={ref}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DetailResponsesTable: React.FC<{
  data: detailResponse[];
  prettyDates: boolean;
  formatRes: boolean;
  pseud: string;
}> = ({ data, prettyDates, formatRes, pseud }) => {
  const ref = useRef(null);

  const flat: flatDetailChildren[] = useMemo(() => {
    const temp = [];
    for (const detail of data) {
      temp.push({
        ...detail,
        all_selected: null,
        selected: null,
        response: null,
        numeric_response: null,
        detail_link: null,
        qid: "",
        type: detail.type ?? "",
        responses: detail.responses.map((resp) => ({
          ...detail,
          ...resp,
          stamp: detail.stamp,
          responses: [],
        })),
      });
    }
    return temp;
  }, [data]);

  const columns = useMemo<ColumnDef<flatDetailChildren, any>[]>(
    () => [
      {
        id: "expander",
        header: ({ table }) => (
          <button
            {...{
              onClick: table.getToggleAllRowsExpandedHandler(),
              style: { cursor: "pointer" },
            }}
          >
            {table.getIsAllRowsExpanded() ? "-" : "+"}
          </button>
        ),
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <button
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: "pointer" },
              }}
            >
              {row.getIsExpanded() ? "-" : "+"}
            </button>
          ) : (
            ""
          );
        },
      },
      {
        header: "Time",
        accessorFn: (row) => dateFormat(row.stamp, prettyDates),
        footer: (props) => props.column.id,
      },
      {
        header: "Type",
        accessorFn: (row) => row.type,

        footer: (props) => props.column.id,
      },
      {
        header: "Description",
        accessorFn: (row) => row.desc,

        footer: (props) => props.column.id,
      },
      {
        header: formatRes ? "Question" : "Qid",
        accessorFn: (row) =>
          formatRes ? questionSet[row.qid]?.prompt : row.qid,
        footer: (props) => props.column.id,
      },
      {
        header: "Response",
        accessorFn: (row) => {
          if (!formatRes)
            return (
              row.response ??
              row.numeric_response ??
              row.all_selected ??
              row.selected
            );
          const question = questionSet[row.qid];
          console.log(question);
          if (row.response) return row.response;
          if (row.numeric_response) return row.numeric_response;
          if (row.selected) return question.choices[row.selected];
          if (row.all_selected) {
            const indices = row.all_selected.split(",");
            return indices.map((e) => question.choices[e]).join(", ");
          }
          return null;
        },
      },
    ],
    [prettyDates, formatRes]
  );

  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data: flat,
    columns,
    state: {
      expanded,
    },
    debugAll: true,
    enableExpanding: true,
    onExpandedChange: setExpanded,
    getFilteredRowModel: getFilteredRowModel(),
    getSubRows: (original) =>
      original.responses.length === 0 ? undefined : original.responses,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const { onDownload } = useDownloadExcel({
    currentTableRef: ref.current,
    filename: `${pseud}_responses`,
    sheet: "responses",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxShadow: "1px 1px 3px #ccc",
        backgroundColor: "#e5e9f0",
        borderRadius: "8px",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <h5>Detail Responses</h5>

        <button
          style={{
            backgroundColor: "var(--accent)",
            border: "none",
            padding: "6px 10px",
            fontSize: "large",
            color: "white",
            cursor: "pointer",
            borderRadius: "6px",
          }}
          onClick={onDownload}
        >
          Export
        </button>
      </div>
      <table ref={ref}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const ResponsesTable: React.FC<{
  data: noDetailResponse[];
  prettyDates: boolean;
  formatRes: boolean;
  pseud: string;
}> = ({ data, prettyDates, formatRes, pseud }) => {
  const ref = useRef(null);

  const columns = useMemo<ColumnDef<noDetailResponse, any>[]>(
    () => [
      {
        header: "Time",
        accessorFn: (row) => dateFormat(row.stamp, prettyDates),
        footer: (props) => props.column.id,
      },
      {
        header: "Type",
        accessorFn: (row) => row.type,
        footer: (props) => props.column.id,
      },
      {
        header: formatRes ? "Question" : "Qid",
        accessorFn: (row) =>
          formatRes ? questionSet[row.qid]?.prompt : row.qid,
        footer: (props) => props.column.id,
      },
      {
        header: "Response",
        accessorFn: (row) => {
          if (!formatRes)
            return (
              row.response ??
              row.numeric_response ??
              row.all_selected ??
              row.selected
            );
          const question = questionSet[row.qid];
          if (row.response) return row.response;
          if (row.numeric_response) return row.numeric_response;
          if (row.selected) return question.choices[row.selected];
          if (row.all_selected) {
            const indices = row.all_selected.split(",");
            return indices.map((e) => question.choices[e]).join(", ");
          }
          return null;
        },
      },
    ],
    [prettyDates, formatRes]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { onDownload } = useDownloadExcel({
    currentTableRef: ref.current,
    filename: `${pseud}_responses`,
    sheet: "responses",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxShadow: "1px 1px 3px #ccc",
        backgroundColor: "#e5e9f0",
        borderRadius: "8px",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <h5>Single Responses</h5>

        <button
          style={{
            backgroundColor: "var(--accent)",
            border: "none",
            padding: "6px 10px",
            fontSize: "large",
            color: "white",
            cursor: "pointer",
            borderRadius: "6px",
          }}
          onClick={onDownload}
        >
          Export
        </button>
      </div>
      <table ref={ref}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
};
