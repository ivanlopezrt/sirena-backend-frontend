import { useCallback, useRef } from "react";
import CodesTableRow from "./CodesTableRow";
import Loading from "../UI/Loading";
import useDiagnosisCode from "../../hooks/useDiagnosisCode";

export default function CodesTable() {
    const { data, setFilter, loadMore, isFetchingNextPage } =
        useDiagnosisCode();
    const observer = useRef();

    let timeout = 0;

    const renderRow = (code, pageIndex, elementIndex) => {
        const isLast =
            parseInt(pageIndex + 1) ===
                parseInt(data.pageParams.slice(-1)[0]) &&
            parseInt(elementIndex) ===
                parseInt(data.pages[pageIndex].length - 1);

        return (
            <tr
                key={code.id}
                className="text-gray border-bottom bg-white bg-hover-light-primary rounded"
                ref={isLast ? lastElementRef : null}
            >
                <CodesTableRow code={code} />
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
                        Códigos
                    </span>
                    <span className="text-muted mt-1 fw-semibold fs-7">
                        Códigos de diagnóstico
                    </span>
                </h3>
                <div className="card-toolbar">
                    <input
                        onChange={(event) => {
                            clearTimeout(timeout);
                            timeout = setTimeout(() => {
                                if (event.target.value.length >= 3)
                                    setFilter(event.target.value);
                            }, 500);
                        }}
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                    ></input>
                </div>
            </div>
            <div className="card-body py-4 h-100">
                {!data ? (
                    <div className="w-25 m-auto align-middle">
                        <Loading />
                    </div>
                ) : (
                    <table
                        className="table align-middle table-row-dashed fs-6 gy-5"
                        id="kt_table_users"
                    >
                        <thead>
                            <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                <th className="w-10px pe-2"></th>
                                <th className="min-w-125px">Código</th>
                                <th className="min-w-125px">Descripción</th>
                                <th className="min-w-125px"></th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 fw-semibold">
                            {data.pages.map((codes, pageIndex) =>
                                codes.map((code, index) => {
                                    return renderRow(code, pageIndex, index);
                                })
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
