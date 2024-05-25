import SwipeTable from '@/components/swipes/swipe_table'
import { DeleteTurtle } from '@/components/turtles/buttons'
import EditTurtleForm from '@/components/turtles/edit-form'
import { fetchSwipeLogsForTurtle } from '@/lib/data/swipe-log'
import { fetchTurtleWithStatsById } from '@/lib/data/turtle'
import { unstable_noStore as noStore } from 'next/cache'

export default async function Page({ params }: { params: { id: string } }) {
    noStore()

    const id = params.id
    const turtle = await fetchTurtleWithStatsById(id)
    const swipes = await fetchSwipeLogsForTurtle(id)

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <EditTurtleForm turtle={turtle} />
                </div>
            </div>
            <div className="mt-8 flow-root">
                <SwipeTable swipes={swipes} />
            </div>

            <DeleteTurtle id={turtle.id} />
        </div>
    )
}
