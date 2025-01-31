<script>
  import { page } from "$app/stores";
  import { Menu } from "lucide-svelte";

  export let doLogout;
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_missing_attribute -->
<header class="navbar bg-primary/75 text-white px-3">
  <div class="flex-1 hidden md:block">
    <span class="px-3 text-2xl font-bold">{import.meta.env.VITE_APP_NAME}</span>
  </div>
  <div class="navbar-start md:hidden">
    <button class="btn btn-ghost btn-circle">
      <Menu size={24} />
    </button>
  </div>
  <div class="navbar-center md:hidden">
    <span class="px-3 text-2xl font-bold">{import.meta.env.VITE_APP_NAME}</span>
  </div>
  <div class="navbar-end">
    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
        <div class="w-9 bg-white rounded-full">
          <img src="https://gravatar.com/avatar/{$page.data.hashed_email}" />
        </div>
      </div>
      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content mt-3 p-2 bg-base-100 text-black w-32 rounded-box z-[1] shadow-lg"
      >
        <li>
          <button on:click={() => edit_profile.showModal()}>Edit Profile</button
          >
        </li>
        <li>
          <button on:click={() => doLogout()}>Logout</button>
        </li>
      </ul>
    </div>
  </div>
</header>

<dialog id="edit_profile" class="modal modal-bottom sm:modal-middle">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Hello!</h3>
    <p class="py-4">Press ESC key or click outside to close</p>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
