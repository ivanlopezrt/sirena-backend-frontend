import { useMenuDrawer } from "../../context/MenuDrawerContext";

export default function DrawerOverlay() {
    const { opened, setOpened } = useMenuDrawer();

    return (
        <div
            style={{ zIndex: 109 }}
            className="drawer-overlay"
            onClick={() => {
                setOpened(!opened);
            }}
        ></div>
    );
}
