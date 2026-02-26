<script>
    import { X, Search, Plus, FileSearchCorner, File } from 'lucide-svelte';

    import sidebarDrawer from '$lib/stores/sidebarDrawer';

    export let contents;
    export let activeEnv;
    export let search;
    export let doSearch;
    export let openEnv;

    let searchTimeout;

    async function handleKeydown() {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            doSearch();
        }, 200);
    }
</script>

<aside
    class="{$sidebarDrawer
        ? 'active'
        : 'left-0'} flex flex-col md:py-4 bg-white w-[280px] fixed md:static top-[100] left-0 transition-transform duration-300 ease-in-out h-[calc(100%-64px)] md:h-auto z-[100] shadow-xl md:shadow-none"
>
    <div
        class="md:card flex flex-col gap-2 py-3 bg-primary/15 border-[1px] border-primary/20 w-full min-h-full overflow-y-auto"
    >
        <div class="flex gap-1 mx-2 pb-2 border-primary/50 border-b-[1px]">
            <label
                class="input input-bordered input-sm flex items-center gap-2 w-full"
            >
                <input
                    type="text"
                    class="grow"
                    placeholder="Search..."
                    on:input={handleKeydown}
                    bind:value={search.keyword}
                />
                {#if search?.keyword}
                    <button
                        class="-ms-8 text-black z-[100] cursor-pointer"
                        title="Click to close search"
                        on:click={() => {
                            search.keyword = '';
                            search.results = [];
                        }}
                    >
                        {#if search.loading}
                            <span class="loading loading-spinner loading-xs">
                            </span>
                        {:else}
                            <X size={16} />
                        {/if}
                    </button>
                {:else}
                    <Search size={16} />
                {/if}
            </label>
            <button
                class="btn btn-success btn-sm"
                title="Create new environment"
                on:click={() => openEnv()}
            >
                <Plus size={16} /> New
            </button>
        </div>
        <div class="env-list flex-1 mx-2 overflow-y-auto">
            {#if search.keyword && !search.results.length}
                <div
                    class="flex flex-col gap-1 justify-center items-center w-full h-full"
                >
                    <FileSearchCorner size={64} class={'text-primary/50'} />
                    <span class="text-primary/50">Environment not found</span>
                </div>
            {:else if !contents.length}
                <div
                    class="flex flex-col gap-1 justify-center items-center w-full h-full"
                >
                    <File size={64} class={'text-primary/50'} />
                    <span class="text-primary/50">No environment yet</span>
                </div>
            {:else}
                {#each search.keyword ? search.results : contents as item, i}
                    <button
                        class="card mb-1 px-4 py-3 {activeEnv === item.id
                            ? 'bg-primary/75'
                            : 'bg-primary/55'} text-white text-left w-full cursor-pointer"
                        on:click={() => openEnv(item.id)}
                    >
                        <span
                            class="truncate block whitespace-nowrap w-full"
                            title={item.title}
                        >
                            {item.title}
                        </span>
                    </button>
                {/each}
            {/if}
        </div>
    </div>
</aside>

<style>
    aside {
        translate: -100% 0;
    }

    aside.active {
        translate: 0 0;
    }

    .env-list {
        max-height: calc(100dvh - 145px) !important;
    }

    @media (width >= 48rem) {
        aside {
            translate: 0 0;
        }

        .env-list {
            max-height: calc(100dvh - 170px) !important;
        }
    }

    @media (width >= 64rem) {
        .env-list {
            max-height: calc(100dvh - 195px) !important;
        }
    }
</style>
