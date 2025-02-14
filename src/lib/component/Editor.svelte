<script>
  import { goto } from "$app/navigation";
  import { ArrowLeft, Check, Trash2, X } from "lucide-svelte";
  import { toast } from "svoast";
  import datePrettier from "$lib/datePrettier";

  import { initialValues } from "$lib/stores/initialValues";

  export let contents;
  export let closeEditor;
  export let reloadEnvList;

  async function saveEnvironment() {
    try {
      const response = await fetch(
        contents.id ? `/api/env?id=${contents.id}` : "/api/env",
        {
          method: contents.id ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contents),
        }
      );

      if (!response.ok) throw new Error();

      const result = await response.json();
      initialValues.set({
        title: result.data.column.title,
        content: result.data.column.content,
      });

      toast.success(
        `${contents.id ? "Environment" : "New environment"} saved successfully.`
      );

      contents.id = result.data.column.id;
      contents.title = result.data.column.title;
      contents.content = result.data.column.content;
      contents.timestamp = result.data.column.timestamp;
      delete contents.is_new;

      await reloadEnvList();
    } catch (e) {
      console.error(e);
      toast.error("Save environment failed, please try again!");
    }
  }

  async function deleteEnvironment(id) {
    try {
      const response = await fetch(`/api/env?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error();

      toast.success("Environment deleted successfully.");
      await closeEditor();
      await reloadEnvList();
    } catch (e) {
      console.error(e);
      toast.error("Delete environment failed, please try again!");
    }
  }
</script>

{#if contents?.id || contents?.is_new}
  <main class="flex flex-1 flex-col gap-3 mt-2 mb-6 py-3">
    <div class="flex items-center gap-2">
      <button
        class="cursor-pointer"
        title="Back to dashboard"
        on:click={async () => {
          await closeEditor();
          goto("/");
        }}
      >
        <ArrowLeft size={30} />
      </button>
      <input
        type="text"
        class="input input-bordered input-lg text-xl px-4 w-full"
        placeholder={contents?.is_new
          ? "New environment title"
          : "Environment title"}
        bind:value={contents.title}
      />
    </div>
    <p class="text-gray-500 text-xs">
      Last saved at {datePrettier(contents?.timestamp)}
    </p>
    <textarea
      class="card flex-1 px-4 py-3 bg-[#272822] text-white w-full resize-none shadow-xl"
      spellcheck="false"
      bind:value={contents.content}
    ></textarea>
    <div class="flex gap-1">
      <button
        class="btn btn-success me-auto"
        title="Save this environment"
        disabled={!contents?.title ||
          ($initialValues.title === contents.title &&
            $initialValues.content === contents.content)}
        on:click={() => saveEnvironment()}
      >
        <Check size={16} /> Save
      </button>
      {#if contents?.id}
        <button
          class="btn btn-outline btn-error"
          title="Delete this environment"
          on:click={() => env_delete.showModal()}
        >
          <Trash2 size={16} /> Delete
        </button>
      {:else}
        <button
          class="btn btn-outline btn-error"
          title="Cancel create new environment"
          on:click={() => delete contents.is_new}
        >
          <X size={16} /> Cancel
        </button>
      {/if}
    </div>
  </main>
{/if}

<dialog id="env_delete" class="modal modal-bottom sm:modal-middle">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Delete Environment</h3>
    <p class="py-4">Are you sure you want to delete this environment?</p>
    <div class="modal-action mt-3">
      <form method="dialog">
        <button class="btn">Cancel</button>
        <button
          class="btn btn-error"
          on:click={() => deleteEnvironment(contents.id)}
        >
          Delete
        </button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
