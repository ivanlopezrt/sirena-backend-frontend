import { useCallback, useRef } from "react";

import UserTableRow from "./UserTableRow";
import useUsers from "../../hooks/useUsers";
import Loading from "../UI/Loading";

export default function UsersTable() {
    const { data, loadMore, isFetchingNextPage } = useUsers();
    const observer = useRef();

    const renderRow = (user, pageIndex, elementIndex) => {
        const isLast =
            parseInt(pageIndex + 1) ===
                parseInt(data.pageParams.slice(-1)[0]) &&
            parseInt(elementIndex) ===
                parseInt(data.pages[pageIndex].length - 1);

        return (
            <tr
                key={user.name + "_" + elementIndex}
                className="text-gray border-bottom bg-white bg-hover-light-primary rounded"
                ref={isLast ? lastElementRef : null}
            >
                <UserTableRow code={user} />
            </tr>
        );
    };

    // Callback para manejar la intersección (cuando el usuario alcanza el final de la tabla)
    const lastElementRef = useCallback((node) => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isFetchingNextPage) {
                loadMore();
            }
        });

        if (node) observer.current.observe(node);
    }, []);

    return (
        <div className="card h-100">
            <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                    <span className="card-label fw-bold fs-3 mb-1">
                        Usuarios
                    </span>
                    <span className="text-muted mt-1 fw-semibold fs-7">
                        Lista de usuarios en el sistema
                    </span>
                </h3>
            </div>
            <div className="card-body py-4 h-100">
                {!data ? (
                    <div className="w-25 m-auto align-middle">
                        <Loading />
                    </div>
                ) : (
                    <table className="table align-middle table-row-dashed fs-6 gy-5">
                        <thead>
                            <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                <th className="w-10px pe-2"></th>
                                <th className="min-w-125px">Nombre</th>
                                <th className="min-w-125px">Especialidad</th>
                                <th className="min-w-125px"></th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 fw-semibold">
                            {data.pages.map((users, pageIndex) =>
                                users.map((user, index) => {
                                    return renderRow(user, pageIndex, index);
                                })
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
