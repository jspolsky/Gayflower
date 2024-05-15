import Breadcrumbs from '@/components/breadcrumbs'
import Form from '@/components/configs/create-form'

export default async function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Configurations', href: '/configs' },
                    {
                        label: 'Create Configuratin',
                        href: '/configs/create',
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    )
}
