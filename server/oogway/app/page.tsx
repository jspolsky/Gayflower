import EditTurtleForm from '@/components/turtles/edit-form'
import { fetchTurtlesWithStats } from '@/lib/data/turtle'
import { UNASSIGNED_TURTLE_NAME } from '@/lib/schema/turtle'
import { unstable_noStore as noStore } from 'next/cache'
import clsx from 'clsx'

export default async function HomePage() {
    noStore()
    const turtles = await fetchTurtlesWithStats()

    const unassigned = turtles.filter((t) => t.name === UNASSIGNED_TURTLE_NAME)

    return (
        <div>
            <details open={!!unassigned.length}>
                <summary>Unassigned Turtles</summary>
                <div className="mt-6 flow-root">
                    <div className="inline-block min-w-full align-middle">
                        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {unassigned?.map((turtle) => (
                                    <div
                                        key={turtle.id}
                                        className="p-2.5 col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow m-3"
                                    >
                                        <EditTurtleForm
                                            key={turtle.id}
                                            turtle={turtle}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </details>
            <details>
                <summary>All Turtles</summary>
                <div className="mt-6 flow-root">
                    <div className="inline-block min-w-full align-middle">
                        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {turtles?.map((turtle) => (
                                    <div
                                        key={turtle.id}
                                        className="p-2.5 col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow m-3"
                                    >
                                        <EditTurtleForm
                                            key={turtle.id}
                                            turtle={turtle}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </details>
        </div>
    )
}
