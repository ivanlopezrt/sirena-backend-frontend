import Hospital from "../../models/Hospital";

export default function HospitalTableRow(props: { code: Hospital }) {
    const { code } = props;

    return (
        <>
            <td className="w-10px pe-2"></td>
            <td className="min-w-125px text-gray-800">{code.postal_code}</td>
            <td className="min-w-125px text-gray-700">{code.name}</td>
            <td></td>
        </>
    );
}
