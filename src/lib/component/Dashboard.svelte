<script>
    import { onMount } from 'svelte';
    import { FileCog, CalendarClock } from 'lucide-svelte';
    import datePrettier from '$lib/datePrettier';

    export let contents;

    const now = new Date();
    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    ).getTime();

    let currentTime;
    let recentActivity;

    function updateClock() {
        currentTime = Date.now();
    }

    updateClock();

    onMount(() => {
        const interval = setInterval(() => updateClock(), 1000);
        return () => clearInterval(interval);
    });

    $: {
        const nowMs = Date.now();

        let activeToday =
            contents?.all_contents?.filter(
                item =>
                    item.timestamp >= startOfToday && item.timestamp <= nowMs,
            ) || [];

        if (activeToday.length) {
            const date = new Date(activeToday[0].timestamp);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            recentActivity = `${hours}:${minutes}:${seconds}`;
        } else {
            recentActivity = null;
        }
    }
</script>

{#if !(contents?.opened_contents?.id || contents?.opened_contents?.is_new)}
    <main class="flex flex-1 flex-col items-stretch gap-4 py-4">
        <div class="flex flex-col lg:flex-row items-start gap-4">
            <div
                class="card flex justify-center gap-3 p-6 bg-secondary/15 border-[1px] border-secondary/25 w-full lg:w-2/5 h-30 shadow-lg"
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
                class="card flex justify-center gap-3 p-6 bg-accent/20 border-[1px] border-accent/25 w-full lg:w-3/5 h-30 shadow-lg"
            >
                <CalendarClock size={40} class={'text-accent'} />
                <span class="text-lg text-gray-700 font-bold md:hidden">
                    {datePrettier(currentTime, {
                        date: 'short',
                        time: true,
                    })}
                </span>
                <span class="text-lg text-gray-700 font-bold hidden md:inline">
                    {datePrettier(currentTime, {
                        date: true,
                        time: true,
                    })}
                </span>
            </div>
        </div>
        <div
            class="card flex justify-center gap-3 px-6 py-4 border-[1px] border-black/20 w-full"
        >
            {#if recentActivity}
                <span class="text-gray-700">
                    Recent activity at {recentActivity}
                </span>
            {:else}
                <span class="text-gray-500 text-center">
                    - No recent activity today -
                </span>
            {/if}
        </div>
    </main>
{/if}
