"use client";

import React, { useMemo, useState } from "react";
import { SourceType, TourTravelsActionsType } from "@/types/tour.types";
import { useCreateTours } from "@/contexts/TourTravelProvider";
import SelectSourcesDynamic from "./parts/SelectSources";
import AddPlacesSelect from "./parts/AddPlacesSelect";
import { Box, Button, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ArrowBack, ArrowForward, Save } from "@mui/icons-material";

export const ToursSourcePlaces: React.FC = () => {
  const { state, dispatch, isEdit } = useCreateTours();
  const [details, setDetails] = useState<SourceType>({
    source: (state.tours as any)?.source || [],
    places: (state.tours as any)?.places || [],
  });

  const disableBtn = useMemo(
    () => !(details?.places?.length > 0 && details?.source?.length > 0),
    [details]
  );

  return (
    <div className="container mx-auto p-6">
      <section className="bg-white p-6 rounded-lg shadow-md mb-3">
        <Typography variant="subtitle2" color="textSecondary" mb={1}>
          Min fare for this tour is selected with{" "}
          <b>{(state.tours as any)?.minfair || 0}</b>.
        </Typography>
        {/* expose min fare for default fare prefill */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__TOUR_MIN_FARE__=${Number(
              (state.tours as any)?.minfair || 0
            )};`,
          }}
        />
        <SelectSourcesDynamic
          value={details.source}
          onSave={(source) => setDetails((prev) => ({ ...prev, source }))}
        />
        <AddPlacesSelect
          value={details.places}
          onSave={(places) => setDetails((prev) => ({ ...prev, places }))}
        />

        <div>
          {details?.source?.length > 0 && (
            <div className="bg-white shadow rounded-md p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Selected Sources
              </h3>
              <Box sx={{ overflowX: "auto" }}>
                <Table sx={{ minWidth: 650 }} aria-label="source table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>Source</b>
                      </TableCell>
                      <TableCell align="right">
                        <b>Fare</b>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          maxWidth: 300,
                        }}
                      >
                        <b>On Boarding Points</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {details?.source.map((row) => (
                      <TableRow
                        key={row?.location?._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row?.location?.name}, {row?.location?.state}
                        </TableCell>
                        <TableCell align="right">{row.fare}</TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            maxWidth: 300,
                          }}
                        >
                          {row.onBoarding?.join(" | ")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </div>
          )}
        </div>

        {details?.places?.length > 0 && (
          <div className="bg-white shadow rounded-md p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Selected Places
            </h3>
            <ul className="divide-y divide-gray-200">
              {details.places.map((place) => (
                <li
                  key={place._id}
                  className="py-2 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {place.name}
                    </p>
                    <p className="text-xs text-gray-500">{place.state}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Selected
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            startIcon={<ArrowBack />}
            variant="outlined"
            size="small"
            onClick={() => dispatch({ type: TourTravelsActionsType.BACK })}
          >
            Back
          </Button>
          <Box display="flex" gap={1}>
            {isEdit && (
              <Button
                startIcon={<Save />}
                variant="contained"
                color="success"
                size="small"
                onClick={() => dispatch({ type: TourTravelsActionsType.NEXT })}
              >
                SKIP
              </Button>
            )}
            <Button
              endIcon={<ArrowForward />}
              variant="outlined"
              size="small"
              onClick={() =>
                dispatch({
                  type: TourTravelsActionsType.SOURCE_DETAILS,
                  payload: details,
                })
              }
              disabled={disableBtn}
            >
              Next
            </Button>
          </Box>
        </Box>
      </section>
    </div>
  );
};
