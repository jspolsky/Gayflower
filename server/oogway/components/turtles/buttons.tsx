import { deleteTurtle } from '@/lib/actions/turtle'
import { TrashIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export function GoToTurtleDetails({
    id,
    disabled,
}: {
    id: string
    disabled?: boolean
}) {
    return (
        <Link
            href={`/turtles/${id}`}
            className="rounded-md border p-2 hover:bg-gray-100"
            aria-disabled={disabled}
        >
            <ArrowRightCircleIcon className="w-5" />
        </Link>
    )
}

export function DeleteTurtle({
    id,
    disabled,
}: {
    id: string
    disabled?: boolean
}) {
    const deleteTurtleWithId = deleteTurtle.bind(null, id)

    return (
        <form action={deleteTurtleWithId}>
            <button
                className="inline-flex items-center gap-x-2 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                disabled={disabled}
            >
                <TrashIcon className="-ml-0.5 h-5 w-5" />
                Delete
            </button>
        </form>
    )
}
