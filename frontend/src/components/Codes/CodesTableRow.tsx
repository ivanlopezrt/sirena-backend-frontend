import DiagnosisCode from "../../models/DiagnosisCode";

export default function CodesTableRow(props: { code: DiagnosisCode }) {
    const { code } = props;

    return (
        <>
            <td className="w-10px pe-2"></td>
            <td className="min-w-125px text-gray-800">{code.code}</td>
            <td className="min-w-125px text-gray-700">{code.description}</td>
            <td></td>
        </>
    );
}
