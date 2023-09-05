import React, { useMemo, useState } from "react";
import { supabase } from "../supabase";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  ExpandedState,
  getExpandedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

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
  nonDetail: noDetailResponse[] | string;
  details: detailResponse[] | string;
  tests: testResponse[] | string;
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
      });
    } else {
      setPseudData({
        nonDetail: non,
        details: "Could not constuct details",
        tests: parseRes<testResponse[]>(testResponses),
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
        </div>
      </div>
      {pseudData && <EntryDisplay data={pseudData} />}
    </div>
  );
};

const EntryDisplay: React.FC<{ data: pseudonymData }> = ({ data }) => {
  const { nonDetail, details, tests } = data;
  const allTypes = useMemo(() => {
    const types: Set<string> = new Set();
    if (typeof data.nonDetail !== "string") {
      for (const entry of data.nonDetail) {
        types.add(entry.type);
      }
    }
    if (typeof data.details !== "string") {
      for (const entry of data.details) {
        if (entry.type) types.add(entry.type);
      }
    }
    return types;
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",

        gap: "2rem",
      }}
    >
      {typeof tests !== "string" ? (
        <TestsTable data={tests} prettyDates={true} />
      ) : (
        <p>{tests}</p>
      )}

      {typeof details !== "string" ? (
        <DetailResponsesTable data={details} prettyDates={true} />
      ) : (
        <p>{details}</p>
      )}
      {typeof nonDetail !== "string" ? (
        <ResponsesTable data={nonDetail} prettyDates={true} />
      ) : (
        <p>{nonDetail}</p>
      )}
    </div>
  );
};

const TestsTable: React.FC<{ data: testResponse[]; prettyDates: boolean }> = ({
  data,
  prettyDates,
}) => {
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
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
      <h5>Tests</h5>
      <table>
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
}> = ({ data, prettyDates }) => {
  const flat: flatDetailChildren[] = [];

  for (const detail of data) {
    flat.push({
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
                onClick: () => {
                  console.log(row.subRows);
                  row.getToggleExpandedHandler();
                },
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
        header: "Qid",
        accessorFn: (row) => row.qid,

        footer: (props) => props.column.id,
      },
      {
        header: "Response",

        accessorFn: (row) =>
          row.response ??
          row.numeric_response ??
          row.all_selected ??
          row.selected,
      },
    ],
    []
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
      <h5>Detail Responses</h5>
      <table>
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
}> = ({ data, prettyDates }) => {
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
        header: "Qid",
        accessorFn: (row) => row.qid,
        footer: (props) => props.column.id,
      },
      {
        header: "Response",
        accessorFn: (row) =>
          row.response ??
          row.numeric_response ??
          row.all_selected ??
          row.selected,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
      <h5>Single Responses</h5>
      <table>
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
