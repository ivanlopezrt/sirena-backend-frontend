import { useCallback, useRef } from "react";
import HospitalTableRow from "./HospitalTableRow";
import useHospitals from "../../hooks/useHospitals";
import Loading from "../UI/Loading";

export default function HospitalTable() {
    const { data, loadMore, isFetchingNextPage } = useHospitals();
    const observer = useRef();

    const renderRow = (hospital, pageIndex, elementIndex) => {
        const isLast =
            parseInt(pageIndex + 1) ===
                parseInt(data.pageParams.slice(-1)[0]) &&
            parseInt(elementIndex) ===
                parseInt(data.pages[pageIndex].length - 1);

        return (
            <tr
                key={hospital.id}
                className="text-gray border-bottom bg-white bg-hover-light-primary rounded"
                ref={isLast ? lastElementRef : null}
            >
                <HospitalTableRow code={hospital} />
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
                        Hospitales
                    </span>
                    <span className="text-muted mt-1 fw-semibold fs-7">
                        Lista de hospitales en el sistema
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
                                <th className="min-w-125px">Código postal</th>
                                <th className="min-w-125px">Nombre</th>
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
