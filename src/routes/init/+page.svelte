<script>
    import { goto } from '$app/navigation';
    import { Eye, EyeOff, LogIn, Check } from 'lucide-svelte';
    import { toast } from 'svoast';
    import isValidEmail from '$lib/isValidEmail';

    let register = {
        email: '',
        password: '',
        loading: false,
    };
    let showPassword = false;

    async function handleKeydown(event) {
        if (event.key === 'Enter' && register.email && register.password) {
            doRegister();
        }
    }

    async function doRegister() {
        try {
            register.loading = true;
            if (!isValidEmail(register.email)) throw new Error();

            const response = await fetch('/api/auth', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(register),
            });

            if (!response.ok) throw new Error();

            toast.success('Site initialization completed, you may now log in.');
            goto('/login', { invalidateAll: true });
        } catch (e) {
            register.loading = false;

            console.error(e);
            toast.error(
                'Register failed, please check all data and try again!',
            );
        }
    }
</script>

<main
    class="card flex flex-col gap-2 my-auto p-6 bg-white w-full max-w-[320px] shadow-2xl"
>
    <h1 class="mt-2 text-3xl text-center">
        {import.meta.env.VITE_APP_NAME}
    </h1>
    <p class="mb-2 text-center text-gray-500">
        Please register an account before you can use this application
    </p>
    <input
        type="email"
        class="input input-bordered w-full"
        placeholder="Email"
        bind:value={register.email}
        on:keydown={handleKeydown}
    />
    <label class="input input-bordered flex items-center gap-2 w-full">
        {#if !showPassword}
            <input
                type="password"
                class="grow"
                placeholder="Password"
                bind:value={register.password}
                on:keydown={handleKeydown}
            />
            <button
                class="-ms-8 text-black z-[100] cursor-pointer"
                title="Click to show password"
                on:click={() => (showPassword = !showPassword)}
            >
                <Eye size={18} />
            </button>
        {:else}
            <input
                type="text"
                class="grow"
                placeholder="Password"
                bind:value={register.password}
                on:keydown={handleKeydown}
            />
            <button
                class="-ms-8 text-black z-[100] cursor-pointer"
                title="Click to hide password"
                on:click={() => (showPassword = !showPassword)}
            >
                <EyeOff size={18} />
            </button>
        {/if}
    </label>
    <button
        class="btn btn-primary mt-2"
        title="Register new account"
        disabled={!register.email ||
            !isValidEmail(register.email) ||
            !register.password ||
            register.loading}
        on:click={() => doRegister()}
    >
        {#if register.loading}
            <span class="loading loading-spinner loading-xs"></span> Loading...
        {:else}
            <Check size={16} /> Register
        {/if}
    </button>
</main>
