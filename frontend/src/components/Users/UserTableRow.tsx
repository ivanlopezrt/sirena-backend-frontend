import User from "../../models/User";

export default function UserTableRow(props: { code: User }) {
    const { code } = props;

    return (
        <>
            <td className="w-10px pe-2"></td>
            <td className="min-w-125px text-gray-800">{code.name}</td>
            <td className="min-w-125px text-gray-700">{code.specialty_name}</td>
            <td></td>
        </>
    );
}
