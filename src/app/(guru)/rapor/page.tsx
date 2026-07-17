import { requireGuru } from "@/lib/auth-guru";

// TODO(rewrite): the real roster (student list + add/delete + session control)
// is a separate task. The security pattern is the deliverable here: every guru
// page calls requireGuru() as its first line, and every future server action on
// this page must do the same before touching the database.
export default async function RaporPage() {
  const guru = await requireGuru();

  return (
    <section>
      <h1 className="font-gohan text-2xl font-bold text-gema-navy">
        Rapor Siswa
      </h1>
      <p className="mt-2 font-gilroy text-gema-navy/70">
        Masuk sebagai {guru.email}. Daftar siswa akan tampil di sini.
      </p>
    </section>
  );
}
