<script>
    import '../app.css';
    import { Toasts } from 'svoast';
</script>

<svelte:head>
    <title>
        {import.meta.env.VITE_APP_NAME}
    </title>
</svelte:head>

<div
    class="flex flex-col justify-center items-center bg-teal-100 w-full h-screen"
>
    <slot />
    <Toasts position={'bottom-center'} />
</div>
