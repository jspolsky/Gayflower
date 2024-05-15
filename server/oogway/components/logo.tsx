import Image from 'next/image'
import { nabla } from '@/components/fonts'

export default function AppLogo() {
    return (
        <div
            className={`${nabla.className} flex flex-row items-center leading-none text-white`}
        >
            <Image
                className="h-12 w-12"
                width={30}
                height={30}
                src="/favicon.svg"
                alt="Turtle Icon"
            />
            <p className="text-[44px]">Oogway</p>
        </div>
    )
}
