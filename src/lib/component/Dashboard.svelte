<script>
    import { onMount } from 'svelte';
    import { FileCog, CalendarClock } from 'lucide-svelte';
    import datePrettier from '$lib/datePrettier';

    export let contents;

    let currentTime = {
        long: 'Loading time...',
        short: 'Loading time...',
    };

    onMount(() => {
        function updateClock() {
            currentTime.long = datePrettier(Date.now(), true);
            currentTime.short = datePrettier(Date.now(), false);
        }

        updateClock();
        const interval = setInterval(updateClock, 1000);

        return () => clearInterval(interval);
    });
</script>

{#if !(contents?.opened_contents?.id || contents?.opened_contents?.is_new)}
    <main
        class="flex flex-1 flex-col lg:flex-row items-start gap-3 mt-2 mb-6 py-3"
    >
        <div
            class="card flex justify-center gap-3 p-6 bg-secondary/15 w-full lg:w-2/5 h-30 shadow-lg"
        >
            <FileCog size={40} class={'text-secondary'} />
            <span class="text-lg text-gray-700 font-bold">
                {contents?.all_contents?.length}
                {contents?.all_contents?.length > 1
                    ? 'Environments'
                    : 'Environment'}
            </span>
        </div>
        <div
            class="card flex justify-center gap-3 p-6 bg-accent/20 w-full lg:w-3/5 h-30 shadow-lg"
        >
            <CalendarClock size={40} class={'text-accent'} />
            <span class="text-lg text-gray-700 font-bold md:hidden">
                {currentTime.short}
            </span>
            <span class="text-lg text-gray-700 font-bold hidden md:inline">
                {currentTime.long}
            </span>
        </div>
    </main>
{/if}
