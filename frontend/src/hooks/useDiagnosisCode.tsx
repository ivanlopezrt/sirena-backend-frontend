import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useDiagnosisCodeService from "./useDiagnosisCodeService";

/**
 * Custom hook to manage the retrieval of diagnosis codes with filtering and pagination.
 *
 * @returns {Object} Contains diagnosis code data, filter setting, and methods to fetch more codes.
 */
export default function useDiagnosisCode() {
    const [filter, setFilter] = useState<string | null>(null);
    const { list, find } = useDiagnosisCodeService();

    /**
     * Fetches diagnosis codes with optional filtering.
     * Supports infinite scrolling to load more pages of data.
     *
     * @returns {Object} Contains the data, methods to fetch the next page, and status flags.
     */
    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["codes", filter],
        queryFn: async ({ pageParam }) => {
            if (filter && filter.length >= 3) {
                return await find(filter, pageParam);
            }
            return await list(pageParam);
        },
        initialPageParam: 1,
        getNextPageParam: (
            lastPage,
            allPages,
            lastPageParam,
            allPageParams
        ) => {
            return lastPage.length === 100 ? lastPageParam + 1 : null;
        },
    });

    /**
     * Fetches the next page of diagnosis codes, if not already in the process of fetching.
     */
    const loadMore = () => {
        if (!isFetchingNextPage) fetchNextPage();
    };

    return { data, setFilter, fetchNextPage, loadMore, isFetchingNextPage };
}
