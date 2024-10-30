import { useState } from "react";
import UsersService from "../services/UsersService";
import { useInfiniteQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch and manage users with pagination and filtering.
 *
 * @returns {Object} Provides user data, methods to filter users, fetch more users, and status flags.
 */
export default function useUsers() {
    const service: UsersService = new UsersService();
    const [filter, setFilter] = useState<string | null>(null);

    /**
     * Fetches a paginated list of users, optionally filtered.
     *
     * @returns {Object} Contains the user data, method to fetch next page, and status flags.
     */
    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["users", filter],
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
     * Fetches the next page of users if not already fetching.
     */
    const loadMore = () => {
        if (!isFetchingNextPage) fetchNextPage();
    };

    return { data, setFilter, fetchNextPage, loadMore, isFetchingNextPage };
}
