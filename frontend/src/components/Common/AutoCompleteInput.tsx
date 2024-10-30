import { useRef, useState } from "react";

interface AutoCompleteInputOption {
    option: string;
    value: any;
}
export interface AutoCompleteInputProps {
    filter: (query: string) => Promise<AutoCompleteInputOption[]>;
    onSelect: (item: AutoCompleteInputOption) => void;
    minQueryLength?: number;
}
export default function AutoCompleteInput(props: AutoCompleteInputProps) {
    const [options, setOptions] = useState<AutoCompleteInputOption[]>([]);
    const [query, setQuery] = useState<string>("");
    const [visible, setVisible] = useState<boolean>(false);
    const { filter, onSelect } = props;
    let { minQueryLength } = props;
    let intervalRef = useRef<NodeJS.Timeout>();

    const handleChange = async (query: string) => {
        clearTimeout(intervalRef.current);

        if (!minQueryLength || minQueryLength == 0) {
            minQueryLength = 3;
        }

        setQuery(query);

        if (query.length >= minQueryLength) {
            intervalRef.current = setTimeout(async () => {
                setOptions(await filter(query));
            }, 500);
        } else {
            setVisible(false);
        }
    };

    return (
        <div className="autocomplete_component">
            <input
                onFocus={() => {
                    setVisible(true);
                }}
                onBlur={() => {
                    setTimeout(() => {
                        setVisible(false);
                    }, 200);
                }}
                onChange={(e) => {
                    handleChange(e.target.value);
                    setVisible(true);
                }}
                type="text"
                className="search-input form-control  ps-10"
                name="search"
                value={query}
                placeholder="Buscar código"
            />

            {visible && options && options.length > 0 && (
                <ul className="autocomplete-ul">
                    {options.map((option) => (
                        <li
                            className="autocomplete-ul__li"
                            onClick={() => {
                                onSelect(option);
                                setVisible(false);
                            }}
                        >
                            {option.option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
