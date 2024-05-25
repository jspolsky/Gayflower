import SwipeTable from '@/components/swipes/swipe_table'
import { fetchSwipeLogs } from '@/lib/data/swipe-log'
import { unstable_noStore as noStore } from 'next/cache'

export default async function Page() {
    noStore()
    const swipes = await fetchSwipeLogs()

    return <SwipeTable swipes={swipes} />
}
