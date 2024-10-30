import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import HospitalsService from "../services/HospitalsService";

/**
 * Custom hook to manage the retrieval of hospitals with pagination and optional filtering.
 *
 * @returns {Object} Contains hospital data, methods to set filter, fetch more hospitals, and status flags.
 */
export default function useHospitals() {
    const service: HospitalsService = new HospitalsService();
    const [filter, setFilter] = useState<string | null>(null);

    /**
     * Fetches a paginated list of hospitals.
     *
     * @returns {Object} Contains the data, method to fetch the next page, and status flags.
     */
    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["hospitals", filter],
        queryFn: async ({ pageParam }) => {
            return await service.list(pageParam);
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
     * Fetches the next page of hospitals if not already fetching.
     */
    const loadMore = () => {
        if (!isFetchingNextPage) fetchNextPage();
    };

    return { data, setFilter, fetchNextPage, loadMore, isFetchingNextPage };
}
