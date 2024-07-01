// Pagination of @/components/ui/pagination with logic to reuse
"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import * as constants from "@/shared/constants";
import { useMemo } from "react";

type PaginationType = {
  total: number;

  limit: number;
  setLimit: (current: number) => void;

  offset: number;
  setOffset: (current: number) => void;
};

const PACE = constants.PaginationPace;

export default function PaginationData({
  total,

  limit,
  setLimit,

  offset,
  setOffset,
}: PaginationType) {
  // 12 contacts pace 5 -> 3 pages
  const numberOfPages = Math.ceil(total / PACE);

  // offset pace 5: 0-4 -> page 1, 5-9 -> page 2 etc...
  const isActiveNumber = (offset % PACE) + 1;

  // [1, 2, 3] ...etc NOTE: must be in useMemo or array can cause infinite loop
  const arrayPages = useMemo(
    () =>
      Array.from({ length: numberOfPages }, (_, i) => i + 1)
        // turn into [1, 0, 5, 0, 9] to display first, isActive, last only
        .reduce((total: number[], current, index) => {
          if (
            current === 1 ||
            current === numberOfPages ||
            current === isActiveNumber
          )
            return [...total, current];

          if (total[index - 1] === 0) return total;

          return [...total, 0];
        }, []),
    [numberOfPages, isActiveNumber],
  );

  // page boundary
  const prev = offset - PACE < 0 ? 0 : offset - PACE;
  const next = offset + PACE > total ? offset : offset + PACE;

  console.log(arrayPages);

  return (
    <div className="">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setOffset(prev)} />
          </PaginationItem>

          {arrayPages.map((num, index) => {
            if (num === 0)
              return (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              );

            return (
              <PaginationItem key={index}>
                <PaginationLink onClick={() => setOffset(num)}>
                  {num}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext onClick={() => setOffset(next)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
