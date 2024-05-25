import { deleteTurtle } from '@/lib/actions/turtle'
import {
    TrashIcon,
    DocumentMagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
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
            <DocumentMagnifyingGlassIcon className="w-5" />
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
                className="rounded-md border p-2 hover:bg-gray-100"
                disabled={disabled}
            >
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-4" />
            </button>
        </form>
    )
}
