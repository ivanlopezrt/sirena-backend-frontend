import { useMenuDrawer } from "../../context/MenuDrawerContext";

export default function MobileMenuButton() {
    const { opened, setOpened } = useMenuDrawer();

    const toggleOpened = () => {
        setOpened(!opened);
    };

    return (
        <>
            <div
                className="btn btn-flex btn-icon btn-active-color-primary w-30px h-30px"
                id="kt_app_header_menu_toggle"
                onClick={() => toggleOpened()}
            >
                <i className="ki-duotone ki-element-4 fs-1">
                    <span className="path1"></span>
                    <span className="path2"></span>
                </i>
            </div>
        </>
    );
}
