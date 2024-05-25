'use client'

import * as schema from '@/lib/schema/turtle'
import { updateTurtle } from '@/lib/actions/turtle'
import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { PencilIcon } from '@heroicons/react/24/outline'
import { GoToTurtleDetails } from './buttons'
import clsx from 'clsx'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function EditTurtleForm({
    turtle,
}: {
    turtle: schema.TurtleWithStats
}) {
    const [enabled, setEnabled] = useState(turtle.enabled || false)

    const updateTurtleWithId = (formDate: FormData) =>
        updateTurtle(turtle.id, enabled, formDate)

    return (
        <form action={updateTurtleWithId}>
            <div className="flex w-full items-center justify-between py-3">
                <label
                    htmlFor="turtleName"
                    className="block text-sm font-medium leading-6 text-gray-900"
                >
                    {turtle.id}
                </label>
                <div className="flex justify-end gap-2">
                    <span
                        className={clsx(' rounded-full px-3 py-0.5 ', {
                            'bg-green-400': turtle.successful_swipe_count,
                            'bg-green-100': !turtle.successful_swipe_count,
                        })}
                    >
                        ✔︎ {turtle.successful_swipe_count}
                    </span>
                    <span
                        className={clsx(' rounded-full px-3 py-0.5 ', {
                            'bg-red-400': turtle.failed_swipe_count,
                            'bg-red-100': !turtle.failed_swipe_count,
                        })}
                    >
                        ✖︎ {turtle.failed_swipe_count}
                    </span>
                </div>
            </div>
            <div className="relative mt-2 rounded-md shadow-sm">
                <input
                    type="text"
                    name="turtleName"
                    id="turtleName"
                    className="inline-block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    placeholder="Name"
                    defaultValue={turtle.name}
                />
                <div className="flex w-full items-center justify-between py-3">
                    <div>
                        <Switch
                            checked={enabled}
                            onChange={setEnabled}
                            className={classNames(
                                enabled ? 'bg-sky-600' : 'bg-gray-200',
                                'inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2'
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    enabled ? 'translate-x-5' : 'translate-x-0',
                                    'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                )}
                            />
                        </Switch>
                    </div>
                    <div className="flex justify-end gap-2">
                        <GoToTurtleDetails id={turtle.id} />
                        <button
                            type="submit"
                            className="float-right items-center rounded-md p-1 bg-white text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            <PencilIcon className="w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <p className="mt-2 text-sm text-gray-500" id="form-description">
                created at {turtle.created_at} UTC
            </p>
        </form>
    )
}
