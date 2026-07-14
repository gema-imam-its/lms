"use client";

export default function DeleteSesiButton({
  deleteAction,
}: {
  deleteAction: () => Promise<void>;
}) {
  return (
    <form
      action={deleteAction}
      onSubmit={(e) => {
        if (!confirm("Yakin ingin menghapus sesi ini? Data tidak bisa dikembalikan.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="min-h-[48px] px-6 border-2 border-red-100 text-red-500 rounded-xl font-gohan font-bold hover:bg-red-50 hover:border-red-200 transition-colors w-full sm:w-auto"
      >
        Hapus
      </button>
    </form>
  );
}
