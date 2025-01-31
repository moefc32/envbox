<script>
  import { page } from "$app/stores";
  import { invalidateAll } from "$app/navigation";
  import { toast } from "svoast";

  import Login from "$lib/component/Login.svelte";
  import Header from "$lib/component/Header.svelte";
  import Sidebar from "$lib/component/Sidebar.svelte";

  let formData = {
    email: "",
    password: "",
  };

  async function loginFormAction() {
    try {
      const response = await fetch("/api/auth", {
        method: $page.data.is_registered ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();

      formData.email = "";
      formData.password = "";

      await invalidateAll();
    } catch (e) {
      console.error(e);
      toast.error(
        `${$page.data.is_registered ? "Login" : "Register"} failed, please check all data and try again!`
      );
    }
  }

  async function doLogout() {
    try {
      const response = await fetch("/api/auth", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error();

      await invalidateAll();
    } catch (e) {
      console.error(e);
      toast.error("Logout failed, please try again!");
    }
  }
</script>

{#if !$page.data.access_token}
  <Login {formData} {loginFormAction} />
{:else}
  <main
    class="card flex flex-1 lg:m-3 bg-white w-full max-w-screen-lg shadow-2xl overflow-hidden"
  >
    <Header {doLogout} />
    <div class="flex flex-1 justify-stretch items-stretch">
      <Sidebar />
      <div class="flex-1 p-3"></div>
    </div>
  </main>
{/if}
