import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Contexto para manejar el estado del menú lateral (drawer).
const MenuDrawerContext = createContext<{
    opened: boolean; // Estado que indica si el menú está abierto o cerrado.
    setOpened: (opened: boolean) => void; // Función para establecer el estado del menú.
}>({
    opened: false, // Estado inicial del menú.
    setOpened: () => {},
});

// Proveedor del contexto del menú lateral.
export const MenuDrawerProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [opened, setOpened] = useState<boolean>(false);
    const location = useLocation();

    // Efecto que cierra el menú cuando la ruta cambia.
    useEffect(() => {
        setOpened(false);
    }, [location]);

    return (
        <MenuDrawerContext.Provider value={{ opened, setOpened }}>
            {children} {/* Renderiza los hijos del proveedor. */}
        </MenuDrawerContext.Provider>
    );
};

/**
 * Hook para usar el contexto del menú lateral en los componentes.
 * @returns Contexto del menú lateral.
 */
export const useMenuDrawer = () => useContext(MenuDrawerContext);
