<script>
    import { goto } from '$app/navigation';
    import { toast } from 'svoast';
    import isValidEmail from '$lib/isValidEmail';

    import sidebarDrawer from '$lib/stores/sidebarDrawer';
    import initialValues from '$lib/stores/initialValues';

    import Header from '$lib/component/Header.svelte';
    import Sidebar from '$lib/component/Sidebar.svelte';
    import Dashboard from '$lib/component/Dashboard.svelte';
    import Editor from '$lib/component/Editor.svelte';

    export let data;

    let { contents } = data;

    let search = {
        keyword: '',
        loading: false,
        results: [],
    };

    async function doLogout() {
        try {
            const response = await fetch('/api/auth', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error();

            toast.success('You are now logged out.');
            goto('/login', { invalidateAll: true });
        } catch (e) {
            console.error(e);
            toast.error('Logout failed, please try again!');
        }
    }

    async function reloadEnvList() {
        try {
            const response = await fetch(`/api/env`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error();

            const result = await response.json();
            contents.all_contents = result.data;
        } catch (e) {
            console.error(e);
        }
    }

    async function doSearch() {
        search.loading = true;

        try {
            const response = await fetch(`/api/env?s=${search.keyword}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error();

            const result = await response.json();
            search.results = result.data;
            search.loading = false;
        } catch (e) {
            search.loading = false;

            console.error(e);
        }
    }

    async function openEnv(id) {
        sidebarDrawer.set(false);

        try {
            if (!id)
                return (contents.opened_contents = {
                    is_new: true,
                });

            delete contents.opened_contents.is_new;
            const response = await fetch(`/api/env?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error();

            const result = await response.json();
            initialValues.set({
                title: result.data[0].title,
                content: result.data[0].content,
            });

            contents.opened_contents = result.data[0];
        } catch (e) {
            console.error(e);
        }
    }

    async function closeEditor() {
        sidebarDrawer.set(false);

        contents.opened_contents.id = '';
        contents.opened_contents.title = '';
        contents.opened_contents.content = '';
        contents.opened_contents.timestamp = '';
        delete contents.opened_contents.is_new;
    }
</script>

<main
    class="card flex flex-1 lg:m-3 bg-white w-full max-w-screen-lg shadow-2xl overflow-hidden"
>
    <Header {closeEditor} {doLogout} />
    <div class="flex flex-1 justify-stretch items-stretch gap-4 px-4">
        <Sidebar
            contents={contents?.all_contents}
            activeEnv={contents?.opened_contents?.id}
            {search}
            {doSearch}
            {openEnv}
        />
        <Dashboard {contents} />
        <Editor
            contents={contents?.opened_contents}
            {closeEditor}
            {reloadEnvList}
        />
    </div>
</main>
